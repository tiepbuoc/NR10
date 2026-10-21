/* Ngã Rẽ 10 – tiện ích dùng chung: khung trang, lưu trữ, so sánh, trợ lý AI, QR */
const KEY="ngare10_v1",CMP="ngare10_cmp",PLAN="ngare10_plan";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get(k,d){try{const r=localStorage.getItem(k);return r==null?d:JSON.parse(r)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
// Trợ lý AI: gọi API chuẩn OpenAI-compatible (POST {ENDPOINT}/chat/completions) giống chatbot AI SMART.
// Lưu ý: khóa API đặt ở đây ai cũng đọc được. Muốn an toàn hơn, để KEY rỗng và trỏ ENDPOINT tới proxy của bạn
// (ví dụ Firebase Cloud Function giữ khóa ở phía máy chủ). Xem README.
const AI={
  ENDPOINT:"https://api.shopaikey.com/v1",
  MODEL:"gpt-4.1-mini-2025-04-14",
  KEY:"sk-4150297863e3eee405805e8609648e6c5cebb1b502ffb46e",
  MAX_TOKENS:1500,
  KEEP:20, // số tin nhắn gần nhất được lưu và gửi kèm
  SYSTEM:`Bạn là trợ lý hướng nghiệp thân thiện của website "Ngã Rẽ 10", dành cho học sinh lớp 9 (khoảng 14-15 tuổi) sắp chọn con đường sau khi tốt nghiệp THCS.
BỐN CON ĐƯỜNG CHÍNH:
1. Học tiếp THPT (3 năm), hướng tới đại học/cao đẳng; cần chọn môn lựa chọn và tổ hợp phù hợp.
2. Học nghề: trung cấp, cao đẳng nghề. Nhiều trường nhận học sinh tốt nghiệp THCS, có thể vừa học nghề vừa học văn hóa THPT, tùy trường và tùy chương trình.
3. Học GDTX (giáo dục thường xuyên): học văn hóa theo chương trình THPT với thời gian linh hoạt, có thể kết hợp học nghề hoặc làm việc.
4. Học nghề dịch vụ, đi làm sớm: học nghề ngắn hạn, học việc ở cơ sở (làm tóc, nấu ăn, sửa chữa, bán hàng, du lịch...).
CÁCH TƯ VẤN:
- Nếu có "HỒ SƠ HỌC SINH" thì dựa vào đó (giới tính, tuổi, vùng sống, nơi ở, dự định, hướng nghề quan tâm) và nói rõ vì sao gợi ý như vậy. Nếu thiếu thông tin quan trọng, hỏi lại tối đa 2 câu ngắn rồi vẫn đưa gợi ý sơ bộ.
- Theo vùng: gắn gợi ý với cơ hội thực tế ở địa phương. Miền núi: nông lâm nghiệp, chăn nuôi, du lịch cộng đồng, nghề thủ công truyền thống, điện, sửa chữa máy nông nghiệp. Trung du: cây công nghiệp, chế biến nông sản, khu công nghiệp, cơ khí. Đồng bằng: cơ khí, điện - điện tử, chế biến thực phẩm, làng nghề, logistics. Thành phố: dịch vụ, nhà hàng - khách sạn, công nghệ thông tin, thiết kế, kỹ thuật cao. Xã/huyện: nhắc tới trung tâm GDNN-GDTX và trường nghề gần nhà. Đây là gợi ý chung, không khẳng định địa phương nào cũng có.
- Theo nhóm nghề: thủ công (mây tre, thêu, gốm, mộc, chế tác...), dịch vụ, kỹ thuật cao (điện tử, tự động hóa, CNTT, cơ điện tử...). Nêu điểm mạnh, thử thách, kỹ năng cần có.
- Giới tính: KHÔNG định kiến. Mọi nghề đều mở cho cả nam và nữ; chỉ nêu lưu ý về môi trường làm việc hoặc sức khỏe khi thật sự liên quan, không loại trừ nghề nào vì giới tính.
- Tuổi: học sinh dưới 15 tuổi chưa nên đi làm hưởng lương; nghề dịch vụ lúc này nên hiểu là học nghề, học việc. Nhắc kiểm tra quy định lao động hiện hành.
- Mỗi câu trả lời: đưa 2-3 lựa chọn kèm ưu - nhược điểm ngắn, rồi 1-2 bước tiếp theo cụ thể (hỏi thầy cô chủ nhiệm, đi tham quan trường nghề, hỏi trung tâm GDNN-GDTX ở huyện, trao đổi với gia đình).
- Nếu em lo về kinh tế gia đình, động viên và nhắc hỏi nhà trường về chính sách hỗ trợ, miễn giảm học phí, học bổng; không nêu mức cụ thể.
QUY TẮC:
- Trả lời tiếng Việt, ngắn gọn, thân thiện, dễ hiểu. Không quyết định thay học sinh, tôn trọng mọi lựa chọn, không coi con đường nào là thấp kém.
- Không bịa tên trường, học phí, điểm chuẩn, chỉ tiêu, số liệu. Thông tin cụ thể thì nhắc kiểm tra thông báo mới nhất của trường, Sở GD&ĐT hoặc cơ sở giáo dục nghề nghiệp.
- Câu hỏi ngoài chủ đề hướng nghiệp, học tập: từ chối nhẹ nhàng và đưa về chủ đề chính.
- Dùng Markdown đơn giản: **in đậm** ý chính, danh sách gạch đầu dòng. Không dùng bảng phức tạp.`
};
const NAV=[["con-duong.html","Con đường","paths","signs-post"],["khao-sat.html","Khảo sát","survey","clipboard-list"],["nghe-nghiep.html","Nghề","careers","briefcase"],["mon-hoc.html","Chọn môn","subjects","book-open"],["so-sanh.html","So sánh","compare","scale-balanced"],["ke-hoach.html","Kế hoạch","plan","list-check"]];

// Bốn con đường sau lớp 9 (nội dung tham khảo chung; chi tiết từng trường cần hỏi trực tiếp nhà trường)
const PK="ngare10_profile";
const PATHS=[
{k:"thpt",n:"Học tiếp THPT",ic:"graduation-cap",c:"#3B6CFF",tag:"3 năm, hướng tới đại học hoặc cao đẳng",
 who:["Em thích học các môn văn hóa và muốn mở rộng cửa vào đại học, cao đẳng","Em chưa chắc nghề nào và muốn thêm thời gian để khám phá","Em sẵn sàng học đều, ôn thi và chọn tổ hợp môn phù hợp"],
 note:["Cần chọn môn lựa chọn lớp 10 sớm, vì ảnh hưởng tới khối thi sau này","Nên đối chiếu môn học với nghề em thích bằng khảo sát và trang Chọn môn","Tuyển sinh lớp 10 mỗi tỉnh mỗi khác, hãy xem thông báo mới nhất của Sở GD&ĐT"],
 jobs:["Công nghệ thông tin, kỹ thuật","Y dược, sinh học","Sư phạm, kinh tế, luật, truyền thông"],
 steps:["Làm khảo sát nghề nghiệp","Xem các nghề gợi ý","Chọn tổ hợp môn lớp 10","Lập kế hoạch ôn thi vào lớp 10"],
 links:[["khao-sat.html","Làm khảo sát","clipboard-list"],["mon-hoc.html","Chọn môn","book-open"],["ke-hoach.html","Kế hoạch","list-check"]],
 asks:["Em nên chọn tổ hợp môn nào để theo nghề em thích?","Học THPT có hợp với em không nếu em thích làm việc tay chân?"]},
{k:"cdn",n:"Học nghề: trung cấp, cao đẳng nghề",ic:"screwdriver-wrench",c:"#12B886",tag:"Học nghề bài bản, ra trường sớm có tay nghề",
 who:["Em thích thực hành, làm ra sản phẩm hơn là ngồi học lý thuyết","Em muốn có nghề trong tay và đi làm sớm hơn","Em cần một trường gần nhà hoặc có chính sách hỗ trợ"],
 note:["Nhiều trường nhận học sinh tốt nghiệp THCS; có thể vừa học nghề vừa học văn hóa THPT, tùy trường","Có thể học liên thông lên bậc cao hơn sau này","Hãy tham quan trường, hỏi rõ ngành, thời gian học và điều kiện tuyển sinh"],
 jobs:["Điện, điện tử, cơ khí, ô tô","Công nghệ thông tin, tự động hóa","Nấu ăn, du lịch, khách sạn, chăm sóc sắc đẹp"],
 steps:["Chọn 2-3 nghề em quan tâm","Tìm trường nghề gần nơi ở","Đi tham quan, hỏi tuyển sinh","Trao đổi với gia đình và thầy cô"],
 links:[["nghe-nghiep.html","Xem các nghề","briefcase"]],
 asks:["Em là học sinh miền núi, nên học nghề gì dễ có việc gần nhà?","Học cao đẳng nghề sau lớp 9 có học được văn hóa THPT không?"]},
{k:"gdtx",n:"Học GDTX",ic:"school",c:"#F76707",tag:"Học văn hóa linh hoạt, kết hợp học nghề hoặc làm việc",
 who:["Em cần thời gian học linh hoạt vì phải giúp gia đình hoặc làm thêm","Em muốn có bằng THPT nhưng chưa vào được hoặc chưa muốn vào trường THPT","Em muốn vừa học văn hóa vừa học một nghề"],
 note:["Học theo chương trình giáo dục thường xuyên, thường ở trung tâm GDNN-GDTX của huyện hoặc tỉnh","Nên hỏi trung tâm về lịch học, ngành nghề kết hợp và điều kiện nhập học","Có thể là bước đệm để học tiếp nghề, cao đẳng hoặc đại học"],
 jobs:["Học văn hóa kết hợp nghề ngắn hạn","Làm việc ở cơ sở sản xuất, dịch vụ địa phương","Học tiếp trung cấp, cao đẳng"],
 steps:["Hỏi thầy cô về trung tâm GDNN-GDTX gần nhà","Tìm hiểu lịch học và học phí","Chọn nghề học kèm","Chuẩn bị hồ sơ nhập học"],
 links:[],
 asks:["Học GDTX khác gì học THPT, em có thi đại học được không?","Em muốn vừa học GDTX vừa học nghề thì nên bắt đầu thế nào?"]},
{k:"nghe",n:"Học nghề dịch vụ, đi làm sớm",ic:"store",c:"#E64980",tag:"Học nghề ngắn hạn, học việc để có thu nhập sớm",
 who:["Em thích giao tiếp, phục vụ, làm đẹp, nấu ăn, sửa chữa, bán hàng","Em muốn tự lập sớm hoặc kế thừa nghề, cửa hàng của gia đình","Em thích học bằng cách làm thật"],
 note:["Dưới 15 tuổi chưa nên đi làm hưởng lương; lúc này hãy hiểu là học nghề, học việc","Chọn nơi học uy tín, an toàn, có người hướng dẫn rõ ràng","Nên học thêm kỹ năng giao tiếp, tính toán và học tiếp văn hóa sau này nếu có thể"],
 jobs:["Làm tóc, spa, nail","Nấu ăn, pha chế, nhà hàng, khách sạn","Sửa xe, sửa điện thoại, bán hàng, du lịch"],
 steps:["Chọn 1-2 nghề dịch vụ em thích","Hỏi các lớp học nghề ngắn hạn ở địa phương","Học việc thử một thời gian","Nói chuyện với gia đình về kế hoạch"],
 links:[],
 asks:["Em 14 tuổi muốn học nghề dịch vụ thì nên bắt đầu từ đâu?","Nghề thủ công ở quê em có thể trở thành nghề nuôi sống không?"]}
];
const cix=id=>C.findIndex(c=>c[6]===id),cid=i=>C[i][6];
function calc(d){
  const gs={};Object.keys(G).forEach(k=>gs[k]=0);Q.forEach((q,i)=>{if(q[0] in gs)gs[q[0]]+=(d.a[i]||0)});
  const mx=Math.max(2,...Object.keys(G).map(k=>Q.filter(q=>q[0]===k).length*2));
  const bo={};d.s.forEach(x=>(BOOST[x]||"").split("").forEach(g=>bo[g]=1));
  const list=C.map((c,i)=>{const m=c[3].split("|"),h=m.filter(x=>d.s.includes(x)).length,sc=gs[c[1]]*2+h*1.5+(bo[c[1]]?1:0);return{i,c,m,pct:Math.min(99,Math.round(sc/(mx*2+5.5)*100)),sc}}).sort((a,b)=>b.sc-a.sc);
  return{gs,list,mx};
}
const chips=(m,s=[])=>m.map(x=>`<span class="chip ${s.includes(x)?"pick":""}">${x}</span>`).join("");
const inCmp=i=>store.get(CMP,[]).includes(cid(i));
function careerBody(i,s=[]){const c=C[i];return `<p>${c[2]}</p><p style="margin-bottom:2px"><b>Môn lựa chọn gợi ý:</b></p>${chips(c[3].split("|"),s)}<p><b>Ngành học:</b> ${c[4]}<br><b>Khối thi tham khảo:</b> ${c[5]}</p><div class="row" style="margin:8px 0 0"><button class="btn alt sm" data-cmp="${i}">${inCmp(i)?"Bỏ khỏi so sánh":"Thêm vào so sánh"}</button><a class="btn alt sm" href="mon-hoc.html?nghe=${encodeURIComponent(c[6])}"><i class="fas fa-book-open ic"></i>Xem tổ hợp</a></div>`}
function toast(t){let e=$(".toast");if(e)e.remove();e=document.createElement("div");e.className="toast";e.setAttribute("role","status");e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),2200)}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-cmp]");if(!b)return;
  const i=+b.dataset.cmp,id=cid(i);let l=store.get(CMP,[]).filter(x=>cix(x)>=0);
  if(l.includes(id)){l=l.filter(x=>x!==id);toast("Đã bỏ khỏi danh sách so sánh")}
  else if(l.length>=3){toast("Chỉ so sánh tối đa 3 nghề. Hãy bỏ bớt một nghề trước.");return}
  else{l.push(id);toast("Đã thêm vào so sánh ("+l.length+"/3)")}
  store.set(CMP,l);$$(`[data-cmp="${i}"]`).forEach(x=>x.textContent=l.includes(id)?"Bỏ khỏi so sánh":"Thêm vào so sánh");
  if(window.onCmpChange)onCmpChange();
});

// Khung trang
let cur=document.body.dataset.p;
document.body.insertAdjacentHTML("afterbegin",`<header class="top"><a class="logo" href="index.html" aria-label="Về trang chủ">Ngã Rẽ<i>10</i></a><nav id="mainnav" aria-label="Các mục chính">${NAV.map(n=>`<a href="${n[0]}" ${n[2]===cur?'aria-current="page"':""}><i class="fas fa-${n[3]}"></i><span>${n[1]}</span></a>`).join("")}</nav><button class="btn alt sm" id="share" aria-label="Chia sẻ mã QR"><i class="fas fa-qrcode"></i><span class="lb"> Chia sẻ</span></button></header>`);
document.body.insertAdjacentHTML("beforeend",`<footer><p>Công cụ tham khảo, không thay thế tư vấn của thầy cô và gia đình. Dữ liệu cá nhân chỉ lưu trên máy bạn.</p></footer><button class="btn" id="chat-fab" aria-label="Hỏi trợ lý"><i class="fas fa-comments"></i></button><button id="navtg" aria-controls="mainnav" aria-expanded="true" aria-label="Ẩn menu"><i class="fas fa-chevron-down"></i></button>`);

// Popup chi tiết
function pop(h){let d=$("#pop");if(!d){document.body.insertAdjacentHTML("beforeend",`<dialog id="pop"><button class="px" aria-label="Đóng"><i class="fas fa-xmark"></i></button><div id="pb"></div></dialog>`);d=$("#pop");$(".px",d).onclick=()=>d.close();d.addEventListener("click",e=>{if(e.target===d)d.close()})}$("#pb").innerHTML=h;$("#pb").scrollTop=0;d.showModal()}
function careerPop(i,s=[]){const c=C[i];pop(`<h3 class="pt"><span class="ib" style="--gc:${GC[c[1]]};margin-right:10px;vertical-align:middle"><i class="fas fa-${GI[c[1]]}"></i></span>${c[0]}</h3><p class="soft" style="font-size:14px;margin:0 0 6px">${G[c[1]]}</p>${careerBody(i,s)}`)}
document.addEventListener("click",e=>{const b=e.target.closest("[data-pop]");if(b)careerPop(+b.dataset.pop,(b.dataset.s||"").split("|").filter(Boolean))});
// Ẩn hiện menu trên điện thoại
function setNav(off){document.body.classList.toggle("nav-off",off);const b=$("#navtg");b.setAttribute("aria-expanded",String(!off));b.setAttribute("aria-label",off?"Hiện menu":"Ẩn menu");b.innerHTML=`<i class="fas fa-${off?"bars":"chevron-down"}"></i>`;store.set("ngare10_navoff",off)}
$("#navtg").onclick=()=>setNav(!document.body.classList.contains("nav-off"));setNav(store.get("ngare10_navoff",false)===true);

// Chia sẻ QR
$("#share").onclick=()=>{
  let d=$("#qrd");if(!d){document.body.insertAdjacentHTML("beforeend",`<dialog id="qrd"><h3>Quét để mở trang này</h3><div id="qr" style="display:flex;justify-content:center;margin:12px"></div><p class="soft" style="font-size:13px;max-width:240px;word-break:break-all">${location.href}</p><div class="row" style="justify-content:center"><button class="btn alt sm" id="cp">Sao chép liên kết</button><button class="btn sm" id="qc">Đóng</button></div></dialog>`);d=$("#qrd");
    $("#qc").onclick=()=>d.close();$("#cp").onclick=()=>navigator.clipboard.writeText(location.href).then(()=>toast("Đã sao chép liên kết"),()=>toast("Không sao chép được, hãy chọn và sao chép thủ công"));
    const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";s.onload=()=>new QRCode($("#qr"),{text:location.href,width:200,height:200});s.onerror=()=>$("#qr").textContent="Không tải được mã QR. Kiểm tra kết nối mạng.";document.head.appendChild(s)}
  d.showModal();
};

// Trợ lý AI
const CHAT_KEY="ngare10_chat";
let hist=(()=>{const h=store.get(CHAT_KEY,[]);return Array.isArray(h)?h.filter(m=>m&&(m.role==="user"||m.role==="assistant")&&typeof m.content==="string").slice(-AI.KEEP):[]})();
const saveHist=()=>store.set(CHAT_KEY,hist.slice(-AI.KEEP));
const PF=[["gt","Giới tính",["Nam","Nữ","Không muốn nói"]],["tuoi","Tuổi",["14","15","16","17 trở lên"]],["vung","Vùng em sống",["Miền núi","Trung du","Đồng bằng","Thành phố"]],["noi","Nơi ở",["Xã","Thị trấn / huyện","Phường / thành phố"]],["dd","Dự định sau lớp 9",["Học tiếp THPT","Học nghề (trung cấp, cao đẳng nghề)","Học GDTX","Học nghề dịch vụ, đi làm sớm","Chưa biết"]],["hn","Em quan tâm",["Nghề thủ công","Nghề dịch vụ","Kỹ thuật cao","Chưa rõ"]]];
const profile=()=>{const p=store.get(PK,{});return p&&typeof p==="object"?p:{}};
const DDMAP={thpt:"Học tiếp THPT",cdn:"Học nghề (trung cấp, cao đẳng nghề)",gdtx:"Học GDTX",nghe:"Học nghề dịch vụ, đi làm sớm"};
const REG={"Miền núi":["Nông lâm nghiệp, chăn nuôi","Du lịch cộng đồng, homestay","Nghề thủ công truyền thống (dệt, thêu, mây tre)","Điện, sửa chữa máy nông nghiệp"],"Trung du":["Cây công nghiệp, chế biến nông sản","Công nhân kỹ thuật ở khu công nghiệp","Cơ khí, sửa chữa","Trồng trọt, chăn nuôi ứng dụng công nghệ"],"Đồng bằng":["Cơ khí, điện - điện tử","Chế biến thực phẩm","Làng nghề (gốm, mộc, đúc...)","Bán hàng, logistics"],"Thành phố":["Nhà hàng, khách sạn, du lịch","Công nghệ thông tin, thiết kế","Kỹ thuật cao, tự động hóa","Làm đẹp, bán lẻ, dịch vụ"]};
function setProf(o){const p=profile();Object.assign(p,o);store.set(PK,p)}
function profText(){const p=profile(),l=PF.filter(f=>p[f[0]]).map(f=>`${f[1]}: ${p[f[0]]}`);let pg="";if(/con-duong/.test(location.pathname)){const k=new URLSearchParams(location.search).get("p"),x=PATHS.find(y=>y.k===k);if(x)pg="\n\nEm đang xem trang con đường: "+x.n+"."}
  return(l.length?"\n\nHỒ SƠ HỌC SINH (do em tự điền): "+l.join("; ")+".":"")+pg}
// Ngữ cảnh lấy từ nội dung của chính website (nghề, nhóm nghề, kết quả khảo sát của học sinh) để câu trả lời khớp với trang
function aiContext(){
  try{
    let t=profText();
    if(Array.isArray(C)&&C.length){
      t+="\n\nDANH SÁCH NGHỀ TRÊN WEBSITE (tên | nhóm | 4 môn lựa chọn gợi ý | ngành học | khối thi):\n"+C.map(c=>`- ${c[0]} | ${G[c[1]]||c[1]} | ${c[3].split("|").join(", ")} | ${c[4]} | ${c[5]}`).join("\n");
    }
    const d=store.get(KEY,null);
    if(d&&d.a&&d.s&&Array.isArray(C)&&C.length){
      const top=calc(d).list.slice(0,3).map(x=>`${x.c[0]} (${x.pct}%)`).join("; ");
      t+=`\n\nKẾT QUẢ KHẢO SÁT CỦA HỌC SINH NÀY: nhóm nghề phù hợp nhất: ${top}. Môn các em tự thấy mạnh: ${d.s.join(", ")||"chưa chọn"}. Chỉ nhắc tới khi liên quan đến câu hỏi.`;
    }
    return t;
  }catch(e){return profText()}
}
// Gọi API giống callAiApi của AI SMART: POST {endpoint}/chat/completions, trả về choices[0].message.content
async function callAi(messages){
  const url=AI.ENDPOINT.trim().replace(/\/$/,"")+"/chat/completions";
  const headers={"Content-Type":"application/json"};
  if(AI.KEY)headers.Authorization="Bearer "+AI.KEY;
  const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),60000);
  try{
    const r=await fetch(url,{method:"POST",headers,signal:ctl.signal,body:JSON.stringify({model:AI.MODEL,messages,max_tokens:AI.MAX_TOKENS,temperature:.6})});
    if(!r.ok){const e=await r.text().catch(()=>"");throw new Error("HTTP "+r.status+(e?": "+e.slice(0,120):""))}
    const j=await r.json();return(j?.choices?.[0]?.message?.content||"").trim();
  }catch(e){throw e.name==="AbortError"?new Error("quá thời gian chờ"):e}
  finally{clearTimeout(to)}
}
// Hiển thị Markdown (marked + DOMPurify như AI SMART), tải khi cần; nếu tải lỗi thì hiện chữ thường
let mdP=null;
function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
function loadMd(){return mdP||(mdP=Promise.all([loadScript("https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"),loadScript("https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js")]).catch(()=>{}))}
function renderBot(el,t){
  el.textContent=t;
  loadMd().then(()=>{if(window.marked&&window.DOMPurify){el.innerHTML=DOMPurify.sanitize(marked.parse(t,{breaks:true}));el.classList.add("md");$$("a",el).forEach(a=>{a.target="_blank";a.rel="noopener noreferrer"})}const b=$("#cb");if(b)b.scrollTop=1e9});
}

const GREET="Chào bạn! Mình là trợ lý hướng nghiệp. Sau lớp 9, em đang nghĩ tới con đường nào: học THPT, học nghề, học GDTX hay học nghề dịch vụ? Điền hồ sơ bên dưới để mình tư vấn đúng hơn nhé.";
const QUICK=["Em nên chọn con đường nào sau lớp 9?","Gợi ý nghề hợp với vùng em sống","So sánh học nghề và học GDTX giúp em"];
function closeChat(){$("#chat")?.remove();$("#chat-bd")?.remove();document.body.classList.remove("chat-open");const f=$("#chat-fab");f.hidden=false;f.focus()}
function openChat(pre){
  if($("#chat"))return;$("#chat-fab").hidden=true;document.body.classList.add("chat-open");
  const sel=f=>`<label>${f[1]}<select data-f="${f[0]}"><option value="">Chọn…</option>${f[2].map(o=>`<option${profile()[f[0]]===o?" selected":""}>${o}</option>`).join("")}</select></label>`;
  document.body.insertAdjacentHTML("beforeend",`<div id="chat-bd" aria-hidden="true"></div><div class="card" id="chat" role="dialog" aria-modal="true" aria-label="Trợ lý hướng nghiệp"><div class="h"><span><i class="fas fa-robot ic"></i>Trợ lý Ngã Rẽ 10</span><span class="hb"><button aria-label="Cuộc trò chuyện mới" title="Cuộc trò chuyện mới" id="cn"><i class="fas fa-rotate-right"></i></button><button aria-label="Đóng" id="cx">×</button></span></div><details id="cprof"${Object.keys(profile()).length?"":" open"}><summary><i class="fas fa-user-pen ic"></i>Hồ sơ của em</summary><div class="pg">${PF.map(sel).join("")}</div><p class="soft">Chỉ lưu trên máy em, dùng để trợ lý tư vấn sát hơn.</p></details><div id="cb"></div><form id="cf"><input type="text" id="ci" placeholder="Nhập câu hỏi" autocomplete="off"><button class="btn sm" id="cs" aria-label="Gửi"><i class="fas fa-paper-plane"></i></button></form></div>`);
  const add=(t,c)=>{const m=document.createElement("div");m.className="m "+c;if(c==="b")renderBot(m,t);else m.textContent=t;$("#cb").appendChild(m);$("#cb").scrollTop=1e9;return m};
  const send=async t=>{
    if(!t||$("#cs").disabled)return;$("#ci").value="";$("#cq")?.remove();$("#cprof").open=false;add(t,"u");hist.push({role:"user",content:t});
    $("#cs").disabled=true;const w=add("Đang trả lời…","b");w.classList.add("wait");
    try{
      const a=await callAi([{role:"system",content:AI.SYSTEM+aiContext()},...hist.slice(-AI.KEEP)]);
      if(!a)throw new Error("không có nội dung trả về");
      w.classList.remove("wait");renderBot(w,a);hist.push({role:"assistant",content:a});saveHist();
    }catch(err){
      hist.pop();w.classList.remove("wait");w.classList.add("err");
      w.textContent="Trợ lý đang gặp sự cố kết nối ("+err.message+"). Bạn thử lại sau hoặc hỏi thầy cô nhé.";
    }finally{const b=$("#cs");if(b){b.disabled=false;$("#ci")?.focus()}}
  };
  const draw=()=>{$("#cb").innerHTML="";add(GREET,"b");hist.forEach(m=>add(m.content,m.role==="user"?"u":"b"));
    if(!hist.length){const q=document.createElement("div");q.id="cq";q.innerHTML=QUICK.map(x=>`<button type="button" class="chip">${x}</button>`).join("");q.onclick=e=>{const b=e.target.closest("button");if(b)send(b.textContent)};$("#cb").appendChild(q)}};
  draw();
  $$("#cprof select").forEach(x=>x.onchange=()=>{const p=profile();if(x.value)p[x.dataset.f]=x.value;else delete p[x.dataset.f];store.set(PK,p)});
  $("#chat-bd").onclick=closeChat;$("#cx").onclick=closeChat;
  $("#cn").onclick=()=>{hist=[];saveHist();draw();$("#ci").focus()};
  $("#chat").addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();closeChat()}});
  $("#cf").onsubmit=e=>{e.preventDefault();send($("#ci").value.trim())};
  if(typeof pre==="string"&&pre)send(pre);else $("#ci").focus();
}
$("#chat-fab").onclick=()=>openChat();

// Chuyển trang không tải lại: lấy HTML trang đích, thay <main>, chạy lại script của trang
const PAGES=["index","con-duong","khao-sat","nghe-nghiep","mon-hoc","so-sanh","ke-hoach"],spaCache=new Map();let spaTok=0;
function spaUrl(h){try{const u=new URL(h,location.href);if(u.origin!==location.origin)return null;const m=u.pathname.split("/").pop().replace(/\.html$/,"")||"index";return PAGES.includes(m)?u:null}catch(e){return null}}
function spaLoad(u){const k=u.pathname;if(!spaCache.has(k))spaCache.set(k,fetch(k).then(r=>{if(!r.ok)throw new Error(r.status);return r.text()}).then(t=>new DOMParser().parseFromString(t,"text/html")).catch(e=>{spaCache.delete(k);throw e}));return spaCache.get(k)}
async function spaGo(href,push=true){
  const u=spaUrl(href);if(!u){location.href=href;return}
  const tok=++spaTok;
  try{
    const d=await spaLoad(u);if(tok!==spaTok)return;
    const nm=d.querySelector("main"),cm=$("main");if(!nm||!cm)throw new Error("no main");
    $$("dialog[open]").forEach(x=>x.close());
    if(push)history.pushState(null,"",u.pathname+u.search+u.hash);
    document.title=d.title;cur=document.body.dataset.p=d.body.dataset.p;
    $$("#mainnav a").forEach((a,i)=>NAV[i][2]===cur?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current"));
    delete window.onCmpChange;
    const n=document.importNode(nm,true);n.classList.add("enter");cm.replaceWith(n);
    window.scrollTo(0,0);
    d.querySelectorAll("script:not([src])").forEach(x=>{try{new Function(x.textContent)()}catch(e){console.error(e)}});
    if(u.hash)$(u.hash)?.scrollIntoView();
  }catch(e){location.href=href}
}
document.addEventListener("click",e=>{
  if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest("a[href]");if(!a||a.target||a.hasAttribute("download"))return;
  const u=spaUrl(a.href);if(!u)return;
  if(u.pathname===location.pathname&&u.search===location.search&&u.hash)return;
  e.preventDefault();spaGo(a.href,u.href!==location.href);
});
addEventListener("popstate",()=>spaGo(location.href,false));
const warm=e=>{const a=e.target.closest&&e.target.closest("a[href]"),u=a&&spaUrl(a.href);if(u)spaLoad(u).catch(()=>{})};
document.addEventListener("pointerover",warm);document.addEventListener("touchstart",warm,{passive:true});
setTimeout(()=>PAGES.forEach(x=>{const u=spaUrl(x+".html");if(u)spaLoad(u).catch(()=>{})}),1200);
