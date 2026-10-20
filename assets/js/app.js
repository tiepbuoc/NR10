/* Ngã Rẽ 10 – tiện ích dùng chung: khung trang, lưu trữ, so sánh, trợ lý AI, QR */
const KEY="ngare10_v1",CMP="ngare10_cmp",PLAN="ngare10_plan";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{const r=localStorage.getItem(k);return r==null?d:JSON.parse(r)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
// Trợ lý AI: đặt ENDPOINT là địa chỉ proxy của bạn (không đặt khóa API trong file này). Xem README.
const AI={ENDPOINT:"",MODEL:"",SYSTEM:"Bạn là trợ lý hướng nghiệp thân thiện cho học sinh lớp 9 đang chọn môn lớp 10. Trả lời ngắn, dễ hiểu bằng tiếng Việt. Không quyết định thay học sinh; gợi mở, nêu ưu và nhược điểm. Với thông tin tuyển sinh cụ thể, nhắc học sinh kiểm tra thông báo mới nhất của trường."};
const NAV=[["index.html","Trang chủ","home","house"],["khao-sat.html","Khảo sát","survey","clipboard-list"],["nghe-nghiep.html","Nghề","careers","briefcase"],["mon-hoc.html","Chọn môn","subjects","book-open"],["so-sanh.html","So sánh","compare","scale-balanced"],["ke-hoach.html","Kế hoạch","plan","list-check"]];
const GI={K:"microchip",T:"flask",N:"palette",X:"people-group",D:"chart-line",Q:"landmark"};

function calc(d){
  const gs={K:0,T:0,N:0,X:0,D:0,Q:0};Q.forEach((q,i)=>gs[q[1]]+=d.a[i]);
  const bo={};d.s.forEach(x=>(BOOST[x]||"").split("").forEach(g=>bo[g]=1));
  const list=C.map((c,i)=>{const m=c[3].split("|"),h=m.filter(x=>d.s.includes(x)).length,sc=gs[c[1]]*2+h*1.5+(bo[c[1]]?1:0);return{i,c,m,pct:Math.min(99,Math.round(sc/13.5*100)),sc}}).sort((a,b)=>b.sc-a.sc);
  return{gs,list};
}
const chips=(m,s=[])=>m.map(x=>`<span class="chip ${s.includes(x)?"pick":""}">${x}</span>`).join("");
const inCmp=i=>store.get(CMP,[]).includes(i);
function careerBody(i,s=[]){const c=C[i];return `<p>${c[2]}</p><p style="margin-bottom:2px"><b>Môn lựa chọn gợi ý:</b></p>${chips(c[3].split("|"),s)}<p><b>Ngành học:</b> ${c[4]}<br><b>Khối thi tham khảo:</b> ${c[5]}</p><div class="row" style="margin:8px 0 0"><button class="btn alt sm" data-cmp="${i}">${inCmp(i)?"Bỏ khỏi so sánh":"Thêm vào so sánh"}</button><a class="btn alt sm" href="mon-hoc.html?nghe=${i}"><i class="fas fa-book-open ic"></i>Xem tổ hợp</a></div>`}
function toast(t){let e=$(".toast");if(e)e.remove();e=document.createElement("div");e.className="toast";e.setAttribute("role","status");e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),2200)}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-cmp]");if(!b)return;
  const i=+b.dataset.cmp;let l=store.get(CMP,[]);
  if(l.includes(i)){l=l.filter(x=>x!==i);toast("Đã bỏ khỏi danh sách so sánh")}
  else if(l.length>=3){toast("Chỉ so sánh tối đa 3 nghề. Hãy bỏ bớt một nghề trước.");return}
  else{l.push(i);toast("Đã thêm vào so sánh ("+l.length+"/3)")}
  store.set(CMP,l);$$(`[data-cmp="${i}"]`).forEach(x=>x.textContent=l.includes(i)?"Bỏ khỏi so sánh":"Thêm vào so sánh");
  if(window.onCmpChange)onCmpChange();
});

// Khung trang
const cur=document.body.dataset.p;
document.body.insertAdjacentHTML("afterbegin",`<header class="top"><a class="logo" href="index.html" aria-label="Về trang chủ">Ngã Rẽ<i>10</i></a><nav aria-label="Các mục chính">${NAV.map(n=>`<a href="${n[0]}" ${n[2]===cur?'aria-current="page"':""}><i class="fas fa-${n[3]}"></i><span>${n[1]}</span></a>`).join("")}</nav><button class="btn alt sm" id="share" aria-label="Chia sẻ mã QR"><i class="fas fa-qrcode"></i><span class="lb"> Chia sẻ</span></button></header>`);
document.body.insertAdjacentHTML("beforeend",`<footer><p>Ngã Rẽ 10 là công cụ tham khảo cho học sinh lớp 9. Công cụ không thay thế tư vấn của thầy cô và gia đình. Thông tin tuyển sinh và tổ hợp môn thay đổi theo năm và theo trường, hãy kiểm tra thông báo mới nhất của trường THPT bạn quan tâm. Dữ liệu cá nhân chỉ lưu trên máy của bạn.</p></footer><button class="btn" id="chat-fab" aria-label="Hỏi trợ lý"><i class="fas fa-comments"></i><span class="lb"> Hỏi trợ lý</span></button>`);

// Chia sẻ QR
$("#share").onclick=()=>{
  let d=$("#qrd");if(!d){document.body.insertAdjacentHTML("beforeend",`<dialog id="qrd"><h3>Quét để mở trang này</h3><div id="qr" style="display:flex;justify-content:center;margin:12px"></div><p class="soft" style="font-size:13px;max-width:240px;word-break:break-all">${location.href}</p><div class="row" style="justify-content:center"><button class="btn alt sm" id="cp">Sao chép liên kết</button><button class="btn sm" id="qc">Đóng</button></div></dialog>`);d=$("#qrd");
    $("#qc").onclick=()=>d.close();$("#cp").onclick=()=>navigator.clipboard.writeText(location.href).then(()=>toast("Đã sao chép liên kết"),()=>toast("Không sao chép được, hãy chọn và sao chép thủ công"));
    const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";s.onload=()=>new QRCode($("#qr"),{text:location.href,width:200,height:200});s.onerror=()=>$("#qr").textContent="Không tải được mã QR. Kiểm tra kết nối mạng.";document.head.appendChild(s)}
  d.showModal();
};

// Trợ lý AI
let hist=[{role:"system",content:AI.SYSTEM}];
$("#chat-fab").onclick=()=>{
  if($("#chat"))return;$("#chat-fab").hidden=true;
  document.body.insertAdjacentHTML("beforeend",`<div class="card" id="chat" role="dialog" aria-label="Trợ lý hướng nghiệp"><div class="h"><span><i class="fas fa-robot ic"></i>Trợ lý Ngã Rẽ 10</span><button aria-label="Đóng" id="cx">×</button></div><div id="cb"><div class="m b">Chào bạn! Bạn đang băn khoăn điều gì về việc chọn môn lớp 10?</div></div><form id="cf"><input type="text" id="ci" placeholder="Nhập câu hỏi" autocomplete="off"><button class="btn sm" aria-label="Gửi"><i class="fas fa-paper-plane"></i></button></form></div>`);
  const add=(t,c)=>{const m=document.createElement("div");m.className="m "+c;m.textContent=t;$("#cb").appendChild(m);$("#cb").scrollTop=1e9;return m};
  $("#cx").onclick=()=>{$("#chat").remove();$("#chat-fab").hidden=false};$("#ci").focus();
  $("#cf").onsubmit=async e=>{e.preventDefault();const t=$("#ci").value.trim();if(!t)return;$("#ci").value="";add(t,"u");
    if(!AI.ENDPOINT){add("Trợ lý AI chưa được bật trên trang này. Trong lúc chờ, bạn có thể làm khảo sát hoặc xem mục Chọn môn để có gợi ý.","b");return}
    hist.push({role:"user",content:t});const w=add("Đang trả lời…","b");
    try{const r=await fetch(AI.ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:AI.MODEL,messages:hist,temperature:.6})});
      if(!r.ok)throw new Error(r.status);const j=await r.json(),a=j?.choices?.[0]?.message?.content?.trim();if(!a)throw new Error("rỗng");w.textContent=a;hist.push({role:"assistant",content:a})}
    catch(err){w.textContent="Trợ lý đang gặp sự cố kết nối ("+err.message+"). Bạn thử lại sau hoặc hỏi thầy cô nhé.";hist.pop()}};
};
