/* Gọi AI qua NR10 Gateway (n8n) – dùng chung cho trợ lý trong app.js.
   Luồng:
   1. Lấy Firebase ID token của phiên đăng nhập ẩn danh (tự tạo lần đầu, không cần học sinh đăng nhập).
   2. Gửi {id_token, page_url} tới /nr10-gw-token -> nhận token sống ~5 phút.
   3. Gọi /nr10-gw-chat kèm token -> n8n kiểm tra, gọi LLM và trả lời.
   Token được làm mới âm thầm: (a) hẹn giờ ở phút thứ 4 nếu em vừa dùng trợ lý, (b) làm mới "lười" ngay trước khi gọi
   nếu token còn dưới 60 giây, (c) tự thử lại 1 lần khi gặp 401.
   Cần: firebase-app-compat + firebase-auth-compat + firebase-config.js (đã nạp trước file này ở mỗi trang). */
const GW=(()=>{
  const RENEW_BEFORE_MS=60*1000,RENEW_TIMER_BEFORE_MS=60*1000,ACTIVE_WINDOW_MS=10*60*1000;
  let cached=null,inflight=null,userP=null,renewTimer=null,lastUsedAt=0;
  class GwError extends Error{constructor(code,status){super(code);this.code=code;this.status=status||0}}

  async function postJson(path,body){
    let res;
    try{
      // text/plain = "simple request": trình duyệt không gửi preflight (OPTIONS) tới n8n, tránh lỗi CORS qua proxy hosting.
      res=await fetch(GATEWAY_BASE_URL+path,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify(body)});
    }catch(e){throw new GwError("network_error")}
    let data=null;
    try{data=await res.json()}catch(e){/* phản hồi không phải JSON */}
    return{status:res.status,data};
  }

  // Phiên Firebase ẩn danh: khôi phục phiên đã lưu, nếu chưa có thì tạo mới.
  function getUser(){
    if(userP)return userP;
    userP=(async()=>{
      let auth;
      try{auth=firebase.auth()}catch(e){throw new GwError("auth_unavailable")}
      if(auth.currentUser)return auth.currentUser;
      const restored=await new Promise(ok=>{const off=auth.onAuthStateChanged(u=>{off();ok(u)})});
      if(restored)return restored;
      try{return(await auth.signInAnonymously()).user}
      catch(e){console.error("NR10: không đăng nhập ẩn danh được (đã bật Authentication > Anonymous chưa?)",e&&e.code);throw new GwError("auth_failed")}
    })().catch(e=>{userP=null;throw e});
    return userP;
  }

  async function fetchToken(){
    const user=await getUser();
    const idToken=await user.getIdToken();
    const{status,data}=await postJson("/nr10-gw-token",{id_token:idToken,page_url:location.href});
    if(status!==200||!data||!data.token)throw new GwError((data&&data.error)||"token_http_"+status,status);
    const ttlMs=(Number(data.expires_in)||300)*1000;
    cached={token:data.token,expMs:Date.now()+ttlMs};
    scheduleRenew(ttlMs);
    return cached.token;
  }

  function scheduleRenew(ttlMs){
    clearTimeout(renewTimer);
    renewTimer=setTimeout(()=>{if(Date.now()-lastUsedAt<ACTIVE_WINDOW_MS)ensureToken(true).catch(()=>{})},Math.max(10*1000,ttlMs-RENEW_TIMER_BEFORE_MS));
  }

  /** Đảm bảo có token còn hạn; force=true để bắt buộc xin mới. */
  function ensureToken(force=false){
    if(!force&&cached&&cached.expMs-Date.now()>RENEW_BEFORE_MS)return Promise.resolve(cached.token);
    if(!inflight)inflight=fetchToken().finally(()=>{inflight=null});
    return inflight;
  }

  /** Gọi khi em mở khung chat, để câu hỏi đầu tiên không phải chờ xin token. */
  function prefetch(){lastUsedAt=Date.now();ensureToken().catch(()=>{})}

  /** Thông báo lỗi thân thiện bằng tiếng Việt. */
  function friendly(err){
    const code=(err&&err.code)||"";
    const map={
      auth_unavailable:"Trợ lý chưa sẵn sàng, hãy tải lại trang rồi thử lại.",
      auth_failed:"Chưa kết nối được phiên dùng trợ lý, hãy tải lại trang rồi thử lại.",
      network_error:"Không kết nối được tới trợ lý, hãy kiểm tra mạng rồi thử lại.",
      user_rate_limit:"Bạn gửi hơi nhanh, đợi một chút rồi hỏi tiếp nhé.",
      user_daily_limit:"Hôm nay bạn đã dùng hết lượt hỏi trợ lý. Mai quay lại nhé!",
      web_daily_cap:"Hôm nay trợ lý đã hết lượt dùng. Thử lại vào ngày mai nhé.",
      daily_cap_reached:"Hôm nay trợ lý đã hết lượt dùng. Thử lại vào ngày mai nhé.",
      gateway_disabled:"Trợ lý đang tạm dừng để bảo trì. Thử lại sau nhé.",
      message_too_long:"Tin nhắn quá dài, hãy rút gọn lại.",
      too_many_requests:"Có quá nhiều yêu cầu, đợi một chút rồi thử lại.",
      llm_unavailable:"Trợ lý đang quá tải, thử lại sau ít phút nhé."
    };
    return map[code]||("Trợ lý đang gặp sự cố ("+(code||"lỗi không rõ")+"). Thử lại sau hoặc hỏi thầy cô nhé.");
  }

  /** Gửi câu hỏi tới AI. @returns {Promise<string>} nội dung trả lời */
  async function ask({message,history=[],context=""}){
    lastUsedAt=Date.now();
    for(let attempt=0;attempt<2;attempt++){
      const token=await ensureToken(attempt>0);
      const{status,data}=await postJson("/nr10-gw-chat",{token,message,history,context,page_url:location.href});
      if(status===200&&data&&typeof data.reply==="string")return data.reply;
      const code=(data&&data.error)||"http_"+status;
      // token hết hạn/không hợp lệ -> xin token mới và thử lại đúng 1 lần
      if(status===401&&attempt===0){cached=null;continue}
      throw new GwError(code,status);
    }
    throw new GwError("token_refresh_failed");
  }
  return{ask,prefetch,friendly,ensureToken};
})();
