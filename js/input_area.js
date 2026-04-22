const InputArea = (() => {
  const obj = {};

  window.addEventListener("load", () => {
    InputArea.k = "朝聖者";
    input_area.addEventListener("click", ({target}) => on_click(target));
    document.addEventListener("click", ({target}) => {
      if(target.closest("#input_area, #keyboard")) return;
      clear_avtive();
      input_area.classList.remove("focus");
    });
  });

  /* ================================ */
  /*  游標控制                        */
  /* ================================ */
  function on_click(target) {
    clear_avtive();
    if(target.matches("char")) target.classList.add("active");
    else InputArea.adder.classList.add("active");
    input_area.classList.add("focus");
  }
  function clear_avtive() {
    find_all(input_area, ".active").forEach(el => el.classList.remove("active"));
  }
  Object.defineProperty(obj, "cur_char", {
    get: () => {
      let cur_el = find(input_area, "char.active");
      if(!cur_el) cur_el = InputArea.adder;
      return cur_el;
    },
  });
  Object.defineProperty(obj, "adder", {
    get: () => {
      let adder_el = find(input_area, "#input_adder");
      if(!adder_el) adder_el = new_el_to_el(input_area, "char#input_adder");
      return adder_el;
    },
  });
  Object.defineProperty(obj, "move_cursor", { get: () => move_cursor });
  function move_cursor(direction) {
    if(InputArea.disabled) return;
    let cursor = InputArea.cur_char;
    let target = null;
    if(direction == -1) target = cursor.previousElementSibling;
    if(direction == 1) target = cursor.nextElementSibling;
    clear_avtive();
    (target || cursor).classList.add("active");
  }

  /* ================================ */
  /*  目前語言                        */
  /* ================================ */
  Object.defineProperty(obj, "k", {
    get: () => input_area.getAttribute("k"),
    set: (val) => {
      input_area.setAttribute("k", val);
      input_area.innerHTML = "";
    },
  });

  /* ================================ */
  /*  取得                            */
  /* ================================ */
  Object.defineProperty(obj, "length", {
    get: () => {
      return [...find_all(input_area, "char[word]")].length;
    },
  });

  /* ================================ */
  /*  輸入文字                        */
  /* ================================ */
  Object.defineProperty(obj, "word_input", { get: () => word_input });
  function word_input(word) {
    if(InputArea.disabled) return;
    input_area.classList.add("focus");
    if(InputArea.length + 1 >= 64) return;
    let cursor = InputArea.cur_char;
    let prev_char = cursor.previousElementSibling;
    if(prev_char) {
      let last_word = prev_char.getAttribute("word");
      let new_word = word_and_word(InputArea.k, last_word, word);
      if(new_word != word) {
        prev_char.remove();
        word = new_word;
      }
    }
    let char_el = word_to_char(InputArea.k, word);
    if(!char_el) return;
    cursor.before(char_el);
    clear_avtive();
    cursor.classList.add("active");
  }
  Object.defineProperty(obj, "del_one", { get: () => del_one });
  function del_one() {
    if(InputArea.disabled) return;
    let cursor = InputArea.cur_char;
    let target = cursor.previousElementSibling;
    if(!target) return;
    target.remove();
  }

  /* ================================ */
  /*  發送相關                        */
  /* ================================ */
  Object.defineProperty(obj, "disabled", {
    get: () => {
      return input_area.matches("[disabled]");
    },
    set: (val) => {
      if(!!val) input_area.setAttribute("disabled", "");
      else input_area.removeAttribute("disabled");
    },
  });
  Object.defineProperty(obj, "cur_cnt", { get: () => get_cur_cnt() });
  function get_cur_cnt() {
    return [...find_all(input_area, "char[word]")].map(char_el => {
      return char_el.getAttribute("word");
    }).filter(v => v).join(",");
  }
  Object.defineProperty(obj, "clear_cnt", { get: () => clear_cnt });
  function clear_cnt() {
    input_area.innerHTML = "";
    input_area.click();
  }

  /* ================================ */
  /*  轉換工具                        */
  /* ================================ */
  // word = js字串，單一一個字
  // text = js字串，格式： word,word,word
  // char = char_el

  function word_and_word(keysname, word_a, word_b) {
    let combo = data_table[keysname]?.combo;
    return combo?.[`${word_a}+${word_b}`] || word_b
  }

  Object.defineProperty(obj, "word_to_char", { get: () => word_to_char });
  function word_to_char(keysname, word) {
    word = word.trim();
    if(!word) return null;
    let words = data_table[keysname]?.words;
    if(!words) return null;
    let i_arr = word.split(/\[|\]/).filter(w => w).map(w => words.indexOf(w)).filter(i => i != -1);
    if(i_arr.length == 0) return null;
    let char_el = new_el("char", {word});
    char_el.style.setProperty("--i", i_arr[0]);
    if(i_arr[1]) char_el.style.setProperty("--i1", i_arr[1]);
    if(i_arr[2]) char_el.style.setProperty("--i2", i_arr[2]);
    return char_el;
  }

  Object.defineProperty(obj, "text_to_chars", { get: () => text_to_chars });
  function text_to_chars(keysname, text) {
    let words = data_table[keysname]?.words;
    if(!words) return null;
    return text.split(",").map(word => {
      let i = words.indexOf(word);
      if(i != -1) return new_el("char", {word, style: `--i:${i};`});
    }).filter(v => v);
  }

  return obj;
})();
