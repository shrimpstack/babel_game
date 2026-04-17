const MsgMgr = (() => {
  const obj = {};

  window.addEventListener("load", async () => {
    let res = await post("get_last_msg_100");
    add(...res.msg_arr);
    loop();
  });
  
  /* ================================ */
  /*  反覆讀取                        */
  /* ================================ */
  async function loop() {
    try {
      let res = await post("get_new_msg", {last_time: MsgMgr.last_time});
      let new_msgs = res.msg_arr.filter(msg_data => !msgs[msg_data.time]);
      add(...new_msgs);
    }
    catch(err) {
      return;
    }
    setTimeout(loop, 1e3);
  }
  Object.defineProperty(obj, "last_time", { get: () => get_last_time() });
  function get_last_time() {
    let last_msg = [...find_all(msg_list, ".msg:not(.self)")].pop();
    return last_msg?.time || 0;
  }

  /* ================================ */
  /*  顯示相關                        */
  /* ================================ */
  Object.defineProperty(obj, "add", { get: () => add });
  let msgs = {};
  function add(...msgs_data) {
    let cur_name = RoleMgr.cur_data?.name;
    msgs_data.forEach(msg_data => {
      let chars = InputArea.text_to_chars(msg_data.lang, msg_data.cnt);
      let msg_el = new_el_to_el(msg_list, "div.msg", [
        new_el("img"),
        new_el("div.name", msg_data.name),
        new_el("div.cnt", {k: msg_data.lang}, chars),
      ]);
      if(msg_data.name == cur_name) msg_el.classList.add("self");
      msgs[msg_data.time] = msg_el;
      msg_el.style.order = msg_data.time;
      if(msg_data.img) find(msg_el, "img").src = msg_data.img;
    });
    msg_list.scrollTop = msg_list.scrollHeight;
  }
  Object.defineProperty(obj, "change_role", { get: () => change_role });
  function change_role(role_name) {
    find_all(msg_list, ".msg").forEach(msg_el => {
      let name = find(msg_el, ".name").innerText;
      msg_el.classList.toggle("self", name == role_name);
    });
  }

  return obj;
})();
