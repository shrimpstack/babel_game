async function enter_new_msg() {
  if(InputArea.disabled) return;
  let role_data = RoleMgr.cur_data;
  let cur_cnt = InputArea.cur_cnt;
  if(!role_data) { alert("還沒選角色"); return; }
  if(!role_data.name) { alert("角色名字不能空白"); return; }
  if(!cur_cnt) { alert("文字內容不能空白"); return; }
  InputArea.disabled = true;
  let msg_data = {
    time: Date.now(),
    name: role_data.name,
    img: role_data.img || "",
    cnt: cur_cnt,
    lang: InputArea.k,
  };
  MsgMgr.add(msg_data);
  await post("new_msg", msg_data);
  InputArea.disabled = false;
  InputArea.clear_cnt();
}

function post(action, data = {}) {
  if(!window.XMLHttpRequest) {
    alert('無法連線，請更換瀏覽器');
    return;
  }
  data.action = action || "";
  let url = "https://script.google.com/macros/s/AKfycbxXuN7Z1DHXkLf9K9DG7iokdw5l3I74Lp-TsZ9gnz63IMnurFKYWB_8ZaVN6ejYdODa/exec";
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.responseType = "json";
    xhr.addEventListener("load", () => {
      if(xhr.status == 200) {
        resolve(xhr.response);
      }
      else {
        reject(xhr.status);
      }
    });
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let content = JSON.stringify(data);
    xhr.send("content=" + encodeURI(content.replace(/\&/g, "＆")));
  });
}
