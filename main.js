

// Find a list of words and display it to textDisplay
function setText(e) {
  e = e || window.event;
  let keepWordList = e && e.shiftKey;

  // Reset
  if (!keepWordList) {
    wordList = [];
  }
  currentWord = 0;
  correctKeys = 0;
  inputField.value = '';
  timerActive = false;
  clearTimeout(timer);
  textDisplay.style.display = 'block';
  inputField.className = '';

  switch (typingMode) {
    case 'wordcount':
      textDisplay.style.height = 'auto';
      textDisplay.innerHTML = '';
      if (!keepWordList) {
        wordList = [];
        while (wordList.length < wordCount) {
          const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];
          if (wordList[wordList.length - 1] !== randomWord || wordList[wordList.length - 1] === undefined || getCookie('language') === 'dots') {
            wordList.push(randomWord);
          }
        }
      }
      break;

    case 'time':
      textDisplay.style.height = '3.2rem';
      // document.querySelector(`#tc-${timeCount}`).innerHTML = timeCount;
      textDisplay.innerHTML = '';
      if (!keepWordList) {
        wordList = [];
        for (let i = 0; i < 500; i++) {
          let n = Math.floor(Math.random() * randomWords.length);
          wordList.push(randomWords[n]);
        }
      }
  }

  if (punctuation) addPunctuations();
  showText();
  inputField.focus();
}

function addPunctuations() {
  if (wordList[0] !== undefined) {
    // Capitalize first word
    wordList[0] = wordList[0][0].toUpperCase() + wordList[0].slice(1);

    // Add comma, fullstop, question mark, exclamation mark, semicolon. Capitalize the next word
    for (let i = 0; i < wordList.length; i++) {
      const ran = Math.random();
      if (i < wordList.length - 1) {
        if (ran < 0.03) {
          wordList[i] += ',';
        } else if (ran < 0.05) {
          wordList[i] += '.';
          wordList[i + 1] = wordList[i + 1][0].toUpperCase() + wordList[i + 1].slice(1);
        } else if (ran < 0.06) {
          wordList[i] += '?';
          wordList[i + 1] = wordList[i + 1][0].toUpperCase() + wordList[i + 1].slice(1);
        } else if (ran < 0.07) {
          wordList[i] += '!';
          wordList[i + 1] = wordList[i + 1][0].toUpperCase() + wordList[i + 1].slice(1);
        } else if (ran < 0.08) {
          wordList[i] += ';';
        }
      }
    }
    wordList[wordList.length - 1] += '.';

    // Add quotation marks
  }
}

// Display text to textDisplay
function showText() {
  wordList.forEach(word => {
    let span = document.createElement('span');
    span.innerHTML = word + ' ';
    textDisplay.appendChild(span);
  });
  textDisplay.firstChild.classList.add('highlight');
}


// Calculate and display result
function showResult() {
  let words, minute, acc;
  switch (typingMode) {
    case 'wordcount':
      words = correctKeys / 5;
      minute = (Date.now() - startDate) / 1000 / 60;
      let totalKeys = -1;
      wordList.forEach(e => (totalKeys += e.length + 1));
      acc = Math.floor((correctKeys / totalKeys) * 100);
      break;

    case 'time':
      words = correctKeys / 5;
      minute = timeCount / 60;
      let sumKeys = -1;
      for (let i = 0; i < currentWord; i++) {
        sumKeys += wordList[i].length + 1;
      }
      acc = acc = Math.min(Math.floor((correctKeys / sumKeys) * 100), 100);
  }
  let wpm = Math.floor(words / minute);
  document.querySelector('#right-wing').innerHTML = `WPM: ${wpm} / ACC: ${acc}`;
}


function setTheme(_theme) {
  const theme = _theme.toLowerCase();
  fetch(`themes/${theme}.css`)
    .then(response => {
      if (response.status === 200) {
        response
          .text()
          .then(css => {
            setCookie('theme', theme, 90);
            document.querySelector('#theme').setAttribute('href', `themes/${theme}.css`);
            setText();
          })
          .catch(err => console.error(err));
      } else {
        console.log(`theme ${theme} is undefine`);
      }
    })
    .catch(err => console.error(err));
}



function setLanguage(_lang) {
  const lang = _lang.toLowerCase();
  fetch('texts/random.json')
    .then(response => response.json())
    .then(json => {
      if (typeof json[lang] !== 'undefined') {
        randomWords = json[lang];
        setCookie('language', lang, 90);

        if (lang === "arabic") {
            textDisplay.style.direction = "rtl"
            inputField.style.direction = "rtl"
        } else {
            textDisplay.style.direction = "ltr"
            inputField.style.direction = "ltr"
        }

        setText();
      } else {
        console.error(`language ${lang} is undefine`);
      }
    })
    .catch(err => console.error(err));
}



function setTypingMode(_mode) {
  const mode = _mode.toLowerCase();
  console.log(mode,bar_mode_i);
  bar_mode_i.textContent = mode
  switch (mode) {
    case 'wordcount':
      typingMode = mode;
      setCookie('typingMode', mode, 90);
      document.querySelector('#word-count').style.display = 'inline';
      document.querySelector('#time-count').style.display = 'none';
      setText();
      break;
    case 'time':
      typingMode = mode;
      setCookie('typingMode', mode, 90);
      document.querySelector('#word-count').style.display = 'none';
      document.querySelector('#time-count').style.display = 'inline';
      setText();
      break;
    default:
      console.error(`mode ${mode} is undefine`);
  }
}

function setPunctuation(_punc) {
  const punc = _punc.toLowerCase();
  if (punc === 'true') {
    punctuation = true;
    setCookie('punctuation', true, 90);
    setText();
  } else if (punc === 'false') {
    punctuation = false;
    setCookie('punctuation', false, 90);
    setText();
  }
}

function setWordCount(wc) {
  setCookie('wordCount', wc, 90);
  wordCount = wc;
  // document.querySelectorAll('#word-count > span').forEach(e => {
    bar_words_span.forEach(e => {
    let n = e.textContent    
    if(e.style.getPropertyValue('border-bottom')!=='') {
      if(n!= wc) e.style.removeProperty('border-bottom')
    }else{
      if(n== wc) e.style.setProperty('border-bottom','2px solid')
    }

  });
  // document.querySelector(`#wc-${wordCount}`).style.borderBottom = '2px solid';
  setText();
}

function setTimeCount(c) {
  setCookie('timeCount', c, 90);
  timeCount = c;
  // document.querySelectorAll('#time-count > span').forEach(e => {
    bar_time_span.forEach(e => {
    let n = e.textContent    
    if(e.style.getPropertyValue('border-bottom')!=='') {
      if(n!= c) e.style.removeProperty('border-bottom')
    }else{
      if(n== c) e.style.setProperty('border-bottom','2px solid')
    }
  });
  // document.querySelector(`#tc-${timeCount}`).style.borderBottom = '2px solid';
  setText();
}

function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}


function showAllThemes(){
    fetch(`themes/theme-list.json`)
    .then(response => {
      if (response.status === 200) {
        response
          .text()
          .then(body => {
            let themes = JSON.parse(body);
            let keys = Object.keys(themes);
            // let i;
            for(let i = 0;i < keys.length; i ++){

              let theme = document.createElement('div');
              theme.setAttribute('class', 'theme-button');
              // theme.setAttribute('onClick', `setTheme('${keys[i]}')`);

              theme.addEventListener('click',()=>{setTheme(keys[i])})

              theme.setAttribute('id', keys[i]);

              // set tabindex to current theme index + 4 for the test page
              theme.setAttribute('tabindex', i + 5);
              theme.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                  setTheme(theme.id);
                  inputField.focus();

                }
              })

              if(themes[keys[i]]['customHTML'] != undefined){
                theme.style.background = themes[keys[i]]['background'];
                theme.innerHTML = themes[keys[i]]['customHTML']
              }else{
                theme.textContent = keys[i];
                theme.style.background = themes[keys[i]]['background'];
                theme.style.color = themes[keys[i]]['color'];
              }
              document.getElementById('theme-area').appendChild(theme);
            }
          })
          .catch(err => console.error(err));
      } else {
        console.log(`Cant find theme-list.json`);
      }
    })
    .catch(err => console.error(err));
}



function showThemeCenter() {
  el_theme_center.classList.remove('hidden');
  el_command_center.classList.add('hidden');
}

function hideThemeCenter() {
  el_theme_center.classList.add('hidden');
  el_command_center.classList.remove('hidden');
}




// Get document element
const textDisplay = document.getElementById('text-display')
  ,inputField = document.getElementById('input-field')
  ,el_theme_center = document.getElementById('theme-center')
  ,el_command_center = document.getElementById('command-center')
  ,bar_time_span = document.getElementById('time-count').querySelectorAll('span')
  ,bar_words_span = document.getElementById('word-count').querySelectorAll('span')
  ,bar_time_active = document.getElementById('time-count').querySelector('i')
  ,bar_mode_i = document.getElementById('command-center').querySelector('i')

  // console.log(bar_mode_i);
  // bar_mode_i.textContent ='mode'

// Initialize typing mode variables
let typingMode = 'wordcount';
let wordCount;
let timeCount;

// Initialize dynamic variables
let randomWords = [];
let wordList = [];
let currentWord = 0;
let correctKeys = 0;
let startDate = 0;
let timer;
let timerActive = false;
let punctuation = false;

// Get cookies
const def_theme_name = getCookie('theme')||'light'
  ,def_language = getCookie('language')||'english'
  ,def_word_count = getCookie('wordCount')|| 50
  ,def_time_count = getCookie('timeCount')|| 60
  ,def_type_mode = getCookie('typingMode') || 'wordcount'
  ,def_punctuation = getCookie('punctuation') || 'false'

;

setTheme(def_theme_name)
setLanguage(def_language)
setWordCount(def_word_count)
setTimeCount(def_time_count)
setTypingMode(def_type_mode)
setPunctuation(def_punctuation)






// Command actions
document.addEventListener('keydown', e => {
  // Modifiers Windows: [Alt], Mac: [Cmd + Ctrl]
  
  if(e.altKey ) {
    console.log(e.key)

  }

  if (e.altKey || (e.metaKey && e.ctrlKey)) {
    // [mod + t] => Change the theme
    if (e.key === 't') {
      setTheme(inputField.value);
    }
    // [mod + l] => Change the language
    if (e.key === 'l') {
      setLanguage(inputField.value);
    }

    // [mod + m] => Change the typing mode
    if (e.key === 'm') {
      setTypingMode(inputField.value);
    }

    // [mod + p] => Change punctuation active
    if (e.key === 'p') {
      setPunctuation(inputField.value);
    }
  } else if (!el_theme_center.classList.contains('hidden')) {
    if (e.key === 'Escape'){
      hideThemeCenter();
      inputField.focus();
    }
  } else if (e.key === 'Escape') {
    setText(e);
    // console.log(e.key)
  }
});

function startTimer(time) {
  if (time > 0) {
      // bar_time_active.textContent= time
      bar_mode_i.textContent= time
    timer = setTimeout(() => {
      time--;
      startTimer(time);
    }, 1000);
  } else {
    timerActive = false;
    textDisplay.style.display = 'none';
    inputField.className = '';
    // document.querySelector(`#tc-${timeCount}`).innerHTML = timeCount;
    // bar_time_active.textContent = def_type_mode
    bar_mode_i.textContent = def_type_mode
    showResult();
  }
}

function inputFieldClass2(e) {
  if (e.key >= 'a' && e.key <= 'z' || (e.key === `'` || e.key === ',' || e.key === '.' || e.key === ';')) {
    let inputWordSlice = inputField.value + e.key;
    let currentWordSlice = wordList[currentWord].slice(0, inputWordSlice.length);
    inputField.className = inputWordSlice === currentWordSlice ? '' : 'wrong';
  } else if (e.key === 'Backspace') {
    let inputWordSlice = e.ctrlKey ? '' : inputField.value.slice(0, inputField.value.length - 1);
    let currentWordSlice = wordList[currentWord].slice(0, inputWordSlice.length);
    inputField.className = inputWordSlice === currentWordSlice ? '' : 'wrong';
  } else if (e.key === ' ') {
    inputField.className = '';
  }
}

// Key is pressed in input field
inputField.addEventListener('keydown', e => {
  // Add wrong class to input field
  switch (typingMode) {
    case 'wordcount':
      if (currentWord < wordList.length) inputFieldClass2(e);
    case 'time':
      if (timerActive) inputFieldClass2(e);
  }


  // If it is the first character entered
  if (currentWord === 0 && inputField.value === '') {
    switch (typingMode) {
      case 'wordcount':
        startDate = Date.now();
        break;

      case 'time':
        if (!timerActive) {
          startTimer(timeCount);
          timerActive = true;
        }        
    }
  }

  // If it is the space key check the word and add correct/wrong class
  if (e.key === ' ') {
    e.preventDefault();

    if (inputField.value !== '') {
      // Scroll down text when reach new line
      if (typingMode === 'time') {
        const currentWordPosition = textDisplay.childNodes[currentWord].getBoundingClientRect();
        const nextWordPosition = textDisplay.childNodes[currentWord + 1].getBoundingClientRect();
        if (currentWordPosition.top < nextWordPosition.top) {
          for (let i = 0; i < currentWord + 1; i++) textDisplay.childNodes[i].style.display = 'none';
        }
      }

      // If it is not the last word increment currentWord,
      if (currentWord < wordList.length - 1) {
        if (inputField.value === wordList[currentWord]) {
          textDisplay.childNodes[currentWord].classList.add('correct');
          correctKeys += wordList[currentWord].length + 1;
        } else {
          textDisplay.childNodes[currentWord].classList.add('wrong');
        }
        textDisplay.childNodes[currentWord + 1].classList.add('highlight');
      } else if (currentWord === wordList.length - 1) {
        textDisplay.childNodes[currentWord].classList.add('wrong');
        showResult();
      }

      inputField.value = '';
      currentWord++;
    }

    // Else if it is the last word and input word is correct show the result
  } else if (currentWord === wordList.length - 1) {
    if (inputField.value + e.key === wordList[currentWord]) {
      textDisplay.childNodes[currentWord].classList.add('correct');
      correctKeys += wordList[currentWord].length;
      currentWord++;
      showResult();
    }
  }
});


document.getElementById('show-themes').addEventListener('click', showThemeCenter);
document.getElementById('redo-button').addEventListener('click',setText);
document.getElementById('left-back').addEventListener('click',()=>{
  hideThemeCenter();
  inputField.focus();
});

bar_time_span.forEach(span=>{span.addEventListener('click',()=>{   
    setTimeCount(span.textContent)
  })
})
bar_words_span.forEach(span=>{span.addEventListener('click',()=>{    
    setWordCount(span.textContent)
  })
})

showAllThemes();

