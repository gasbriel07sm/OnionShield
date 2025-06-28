// Funções utilitárias
function base64ToBytes(str) {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}
function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...bytes));
}
function hexToBytes(hex) {
  return Uint8Array.from(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}
function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Derivação de chave
async function deriveKey(password, salt, kdf, keyLen = 32) {
  if (kdf === 'argon2') {
    const hash = await argon2.hash({ pass: password, salt: salt, hashLen: keyLen, time: 2, mem: 64*1024, parallelism: 1, type: argon2.ArgonType.Argon2id, raw: true });
    return hash.hash;
  }
  if (kdf === 'pbkdf2') {
    const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(bytesToHex(salt)), { keySize: keyLen/4, iterations: 100000, hasher: CryptoJS.algo.SHA256 });
    return hexToBytes(key.toString());
  }
  if (kdf === 'scrypt') {
    const key = CryptoJS.Scrypt(password, CryptoJS.enc.Hex.parse(bytesToHex(salt)), { keySize: keyLen/4, N: 16384, r: 8, p: 1 });
    return hexToBytes(key.toString());
  }
  // raw: espera base64
  return base64ToBytes(password);
}

// Gera IV seguro
function generateIV(len = 12) {
  const iv = new Uint8Array(len);
  window.crypto.getRandomValues(iv);
  return iv;
}

// Envelope seguro
function buildEnvelope(alg, iv, tag, ciphertext, key_id, timestamp) {
  return JSON.stringify({
    alg,
    iv: bytesToBase64(iv),
    tag: tag ? bytesToBase64(tag) : undefined,
    ciphertext: bytesToBase64(ciphertext),
    key_id,
    timestamp
  }, null, 2);
}

// Criptografia AES-GCM
async function encryptAESGCM(plaintext, keyBytes) {
  const iv = generateIV(12);
  const key = await window.crypto.subtle.importKey(
    "raw", keyBytes, { name: "AES-GCM" }, false, ["encrypt"]
  );
  const enc = new TextEncoder();
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv }, key, enc.encode(plaintext)
  );
  // tag = últimos 16 bytes do ciphertext (WebCrypto já separa)
  return { iv, ciphertext: new Uint8Array(ciphertext) };
}

// Descriptografia AES-GCM
async function decryptAESGCM(ciphertext, keyBytes, iv) {
  const key = await window.crypto.subtle.importKey(
    "raw", keyBytes, { name: "AES-GCM" }, false, ["decrypt"]
  );
  const dec = new TextDecoder();
  try {
    const pt = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv }, key, ciphertext
    );
    return dec.decode(pt);
  } catch (e) {
    throw new Error("Falha na autenticação ou dados corrompidos!");
  }
}

// Histórico localStorage (criptografado base64)
function encryptHist(text) { return btoa(unescape(encodeURIComponent(text))); }
function decryptHist(text) { try { return decodeURIComponent(escape(atob(text))); } catch { return ''; } }
function saveCryptoHistory(arr) {
  localStorage.setItem('cryptoHistory', encryptHist(JSON.stringify(arr)));
}
function loadCryptoHistory() {
  const enc = localStorage.getItem('cryptoHistory');
  if (!enc) return [];
  return JSON.parse(decryptHist(enc));
}
function renderCryptoHistory() {
  const history = loadCryptoHistory();
  const ul = document.getElementById('crypto-history');
  ul.innerHTML = '';
  history.slice(-10).reverse().forEach(item => {
    const li = document.createElement('li');
    li.style.flexDirection = 'column';
    li.innerHTML = `<span style="color:#4db8ff;font-size:0.98em;">${item.op} (${item.alg})</span>
      <span style="font-size:0.93em;color:#b0bed9;">${item.time}</span>
      <textarea readonly style="width:100%;background:#223a5e;color:#e6f0ff;border-radius:0.4rem;margin-top:0.3em;font-size:0.98em;">${item.data}</textarea>`;
    ul.appendChild(li);
  });
}

document.getElementById('encrypt-btn').onclick = async () => {
  const alg = document.getElementById('algorithm').value;
  const kdf = document.getElementById('kdf').value;
  const keyInput = document.getElementById('key-input').value;
  const plaintext = document.getElementById('plaintext').value;
  if (!keyInput || !plaintext) return alert('Preencha a chave e o texto!');
  const salt = generateIV(16);
  const keyBytes = await deriveKey(keyInput, salt, kdf, 32);
  let result, envelope;
  const key_id = bytesToHex(salt).slice(0, 12);
  const timestamp = new Date().toISOString();
  if (alg === 'AES-GCM') {
    result = await encryptAESGCM(plaintext, keyBytes);
    envelope = buildEnvelope('AES-256-GCM', result.iv, null, result.ciphertext, key_id, timestamp);
  } else {
    alert('ChaCha20-Poly1305 não suportado nativamente no navegador. Use AES-GCM.');
    return;
  }
  document.getElementById('envelope').value = envelope;
  // Salva histórico
  let hist = loadCryptoHistory();
  hist.push({ op: 'Criptografado', alg: alg, time: timestamp, data: envelope });
  saveCryptoHistory(hist.slice(-20));
  renderCryptoHistory();
};

document.getElementById('decrypt-btn').onclick = async () => {
  const alg = document.getElementById('algorithm').value;
  const kdf = document.getElementById('kdf').value;
  const keyInput = document.getElementById('key-input').value;
  const envelope = document.getElementById('envelope').value;
  if (!keyInput || !envelope) return alert('Preencha a chave e o envelope!');
  let parsed;
  try { parsed = JSON.parse(envelope); } catch { return alert('Envelope inválido!'); }
  const salt = parsed.key_id ? hexToBytes(parsed.key_id.padEnd(32, '0')) : generateIV(16);
  const keyBytes = await deriveKey(keyInput, salt, kdf, 32);
  let plaintext;
  if (parsed.alg === 'AES-256-GCM') {
    try {
      plaintext = await decryptAESGCM(base64ToBytes(parsed.ciphertext), keyBytes, base64ToBytes(parsed.iv));
    } catch (e) {
      return alert(e.message);
    }
  } else {
    alert('ChaCha20-Poly1305 não suportado nativamente no navegador. Use AES-GCM.');
    return;
  }
  document.getElementById('plaintext').value = plaintext;
  // Salva histórico
  let hist = loadCryptoHistory();
  hist.push({ op: 'Descriptografado', alg: parsed.alg, time: new Date().toISOString(), data: envelope });
  saveCryptoHistory(hist.slice(-20));
  renderCryptoHistory();
};

document.getElementById('clear-crypto-history').onclick = () => {
  localStorage.removeItem('cryptoHistory');
  renderCryptoHistory();
};

window.addEventListener('DOMContentLoaded', renderCryptoHistory);