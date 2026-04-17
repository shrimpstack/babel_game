const RoleMgr = (() => {
  const obj = {};

  window.addEventListener("load", read_roles);

  function save_roles() {
    let roles_data = [];
    [...roles_el.children].forEach(role_el => {
      let data = {
        name: find(role_el, ".name").value,
        img: find(role_el, ".img_url").value,
      };
      if(data.name) roles_data.push(data);
    });
    roles_data = JSON.stringify(roles_data);
    localStorage.setItem("roles", roles_data);
  }
  function read_roles() {
    roles_el.innerHTML = "";
    let roles_data = localStorage.getItem("roles");
    if(!roles_data) return;
    try {
      roles_data = JSON.parse(roles_data);
    }
    catch(err) { console.log(err); return; }
    roles_data.forEach(role_data => {
      let role_el = create_new();
      find(role_el, ".name").value = role_data.name;
      find(role_el, ".img_url").value = role_data.img;
      if(role_data.img) find(role_el, "img").src = role_data.img;
    });
  }

  Object.defineProperty(obj, "create_new", { get: () => create_new });
  function create_new() {
    if(roles_el.childElementCount >= 12) return;
    let role_el = new_el_to_el(roles_el, "div.role", [
      new_el("img"),
      new_el("input.name"),
      new_el("input.img_url"),
      new_el("button.del_btn", "X"),
    ]);
    role_el.addEventListener("click", ({target}) => {
      if(target.matches(".del_btn")) return;
      find_all(roles_el, ".active").forEach(el => el.classList.remove("active"));
      role_el.classList.add("active");
      let role_name = find(role_el, ".name").value;
      MsgMgr.change_role(role_name);
    });
    find_on(role_el, ".del_btn", "click", () => {
      role_el.remove();
      save_roles();
    });
    find_on(role_el, ".name", "input", () => {
      if(!role_el.matches(".active")) return;
      let role_name = find(role_el, ".name").value;
      MsgMgr.change_role(role_name);
      save_roles();
    });
    find_on(role_el, ".img_url", "input", () => {
      find(role_el, "img").src = find(role_el, ".img_url").value;
      save_roles();
    });
    return role_el;
  }

  Object.defineProperty(obj, "cur_data", { get: () => cur_data() });
  function cur_data() {
    let role_el = find(roles_el, ".active");
    if(!role_el) return null;
    return {
      name: find(role_el, ".name").value,
      img: find(role_el, ".img_url").value,
    };
  }

  return obj;
})();
