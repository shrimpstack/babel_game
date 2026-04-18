const Keyboard = (() => {
  const obj = {};

  window.addEventListener("load", () => {
    lang_select.innerHTML = "";
    Object.keys(data_table).forEach(keysname => {
      new_el_to_el(lang_select, "option", {value: keysname}, keysname);
    });
    lang_select.addEventListener("change", () => {
      InputArea.k = lang_select.value;
      change_lang(lang_select.value);
    });
    change_lang(InputArea.k);
  });

  window.addEventListener("keydown", event => {
    if(!input_area.matches(".focus")) return;
    let is_num = event.keyCode >= 48 && event.keyCode <= 57;
    let is_abc = event.keyCode >= 65 && event.keyCode <= 90;
    if(is_num || is_abc) {
      let key_codes = data_table[InputArea.k]?.key_codes;
      let word = key_codes[event.key.toLocaleLowerCase()];
      if(word) InputArea.word_input(word);
    }
    else switch(event.keyCode) {
      case 37: tool_key_on_click("left"); break;
      case 39: tool_key_on_click("right"); break;
      case 8: tool_key_on_click("del"); break;
      case 13: tool_key_on_click("send"); break;
    }
  });

  Object.defineProperty(obj, "change_lang", { get: () => change_lang });
  function change_lang(lang_name) {
    keyboard.innerHTML = "";
    keyboard.setAttribute("k", lang_name);
    create_keys(lang_name);
  }
  function create_keys(keysname) {
    if(!data_table[keysname]) return;
    let {words, keys, tool_keys} = data_table[keysname];
    keys.forEach(key => {
      if(typeof key == "string") {
        let i = words.indexOf(key);
        if(i == -1) return;
        let key_el = new_el_to_el(keyboard, "char", {key, style: `--i:${i};`});
        key_el.addEventListener("click", () => InputArea.word_input(key));
      }
      else if(key == -1) {
        let br = new_el_to_el(keyboard, "div");
        br.style.gridColumnEnd = -1;
      }
      else if(typeof key == "number") {
        key = Math.min(Math.max(Math.floor(key), 1), 39);
        let white = new_el_to_el(keyboard, "div");
        white.style.gridColumnEnd = `${key} span`;
      }
    });
    let tool_keys_el = {};
    Object.entries(tool_keys).forEach(([key, {r, c}]) => {
      let key_el = new_el_to_el(keyboard, "div.tool_key." + key);
      key_el.style.gridRowStart = r;
      key_el.style.gridColumnStart = c;
      key_el.addEventListener("click", () => tool_key_on_click(key));
      tool_keys_el[key] = key_el;
    });
  }
  function tool_key_on_click(key) {
    switch(key) {
      case "left": InputArea.move_cursor(-1); break;
      case "right": InputArea.move_cursor(1); break;
      case "del": InputArea.del_one(); break;
      case "send": enter_new_msg(); break;
    }
  }

  return obj;
})();
