const charset = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?/|',
  emojis: '😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮🤐😯😪😫🥱😴😌😛😜😝🤤😒😓😔😕🙃🤑😲☹️🙁😖😞😟😤😢😭😦😧😨😩🤯😬😰😱🥵🥶😳🤪😵😡😠🤬😷🤒🤕'
};

function getSelectedCharset() {
  let chars = '';
  if (document.getElementById('uppercase').checked) chars += charset.uppercase;
  if (document.getElementById('lowercase').checked) chars += charset.lowercase;
  if (document.getElementById('numbers').checked) chars += charset.numbers;
  if (document.getElementById('symbols').checked) chars += charset.symbols;
  if (document.getElementById('emojis').checked) chars += charset.emojis;
  return chars;
}

function generatePassword(length, chars) {
  if (!chars) return '';
  let pwd = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    pwd += chars[idx];
  }
  return pwd;
}

// Criptografia simples para localStorage (não é seguro para produção)
function encrypt(text) {
  return btoa(unescape(encodeURIComponent(text)));
}
function decrypt(text) {
  try {
    return decodeURIComponent(escape(atob(text)));
  } catch {
    return '';
  }
}

function saveHistory(passwords) {
  const encrypted = encrypt(JSON.stringify(passwords));
  localStorage.setItem('passwordHistory', encrypted);
}
function loadHistory() {
  const encrypted = localStorage.getItem('passwordHistory');
  if (!encrypted) return [];
  return JSON.parse(decrypt(encrypted));
}

function renderHistory() {
  const history = loadHistory();
  const ul = document.getElementById('password-history');
  ul.innerHTML = '';
  history.slice(-20).reverse().forEach(pwd => {
    const li = document.createElement('li');
    const pwdSpan = document.createElement('span');
    pwdSpan.textContent = pwd;
    pwdSpan.className = 'generated-pwd';
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.title = 'Copiar';
    copyBtn.innerHTML = '<i class="ri-file-copy-line"></i>';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(pwd);
      copyBtn.innerHTML = '<i class="ri-check-line"></i>';
      setTimeout(() => copyBtn.innerHTML = '<i class="ri-file-copy-line"></i>', 1200);
    };
    li.appendChild(pwdSpan);
    li.appendChild(copyBtn);
    ul.appendChild(li);
  });
}

document.getElementById('generate-btn').addEventListener('click', () => {
  const length = Math.max(12, Math.min(64, parseInt(document.getElementById('length').value)));
  const bulk = Math.max(1, Math.min(20, parseInt(document.getElementById('bulk').value)));
  const chars = getSelectedCharset();
  const output = [];
  for (let i = 0; i < bulk; i++) {
    output.push(generatePassword(length, chars));
  }
  const container = document.getElementById('generated-passwords');
  container.innerHTML = '';
  output.forEach(pwd => {
    const pwdSpan = document.createElement('span');
    pwdSpan.className = 'generated-pwd';
    pwdSpan.textContent = pwd;
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.title = 'Copiar';
    copyBtn.innerHTML = '<i class="ri-file-copy-line"></i>';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(pwd);
      copyBtn.innerHTML = '<i class="ri-check-line"></i>';
      setTimeout(() => copyBtn.innerHTML = '<i class="ri-file-copy-line"></i>', 1200);
    };
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.appendChild(pwdSpan);
    wrapper.appendChild(copyBtn);
    container.appendChild(wrapper);
  });
  // Atualiza histórico
  let history = loadHistory();
  output.forEach(pwd => history.push(pwd));
  saveHistory(history.slice(-50)); // Limita histórico a 50
  renderHistory();
});

document.getElementById('clear-history').addEventListener('click', () => {
  localStorage.removeItem('passwordHistory');
  renderHistory();
});

window.addEventListener('DOMContentLoaded', renderHistory);