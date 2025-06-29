// Verifica se o usuário está logado
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    // Redireciona para login se não estiver logado
    window.location.href = "../../login/login.html";
  }

// filepath: c:\Users\gabriel.miranda\Desktop\OnionShield\Front\criptografia\medidor_senha\medidor_senha.html
const passwordInput = document.getElementById('password-input');
const strengthBar = document.getElementById('password-strength-bar');
const strengthText = document.getElementById('password-strength-text');
const feedbackList = document.getElementById('password-feedback-list');
const crackTime = document.getElementById('password-crack-time');
const pwnedAlert = document.getElementById('password-pwned-alert');
const togglePassword = document.getElementById('toggle-password');

// Policy icons
const policyIcons = {
  length: document.getElementById('policy-length'),
  uppercase: document.getElementById('policy-uppercase'),
  lowercase: document.getElementById('policy-lowercase'),
  number: document.getElementById('policy-number'),
  symbol: document.getElementById('policy-symbol'),
  dictionary: document.getElementById('policy-dictionary'),
  pwned: document.getElementById('policy-pwned')
};

// Dicionários personalizados (exemplo)
const customDictionaries = [
  'admin', 'senha', 'password', '123456', 'qwerty', 'onionshield', 'empresa', 'usuario', 'minhasenha', 'brasil'
];

// Função para verificar padrões fracos
function isWeakPattern(pw) {
  const patterns = [
    /qwerty/i, /asdfg/i, /zxcvb/i, /12345/, /senha/i, /password/i, /admin/i, /letmein/i, /welcome/i,
    /onionshield/i, /empresa/i, /usuario/i, /minhasenha/i, /brasil/i
  ];
  return patterns.some(pat => pat.test(pw));
}

// Função para verificar se contém palavra do dicionário customizado
function containsCustomDictionary(pw) {
  return customDictionaries.some(word => pw.toLowerCase().includes(word));
}

// Função para estimar tempo de quebra (usando zxcvbn)
function getCrackTime(result) {
  return result.crack_times_display.offline_fast_hashing_1e10_per_second;
}

// Função para verificar vazamento (Have I Been Pwned)
async function checkPwned(password) {
  const sha1 = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password));
  const hash = Array.from(new Uint8Array(sha1)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);
  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await res.text();
  return text.includes(suffix);
}

// Atualiza o medidor de senha
let lastPassword = '';
passwordInput.addEventListener('input', async function () {
  const pw = passwordInput.value;
  lastPassword = pw;
  feedbackList.innerHTML = '';
  pwnedAlert.textContent = '';
  crackTime.textContent = '';
  // Políticas
  let passed = {
    length: pw.length >= 10,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    number: /\d/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
    dictionary: !isWeakPattern(pw) && !containsCustomDictionary(pw),
    pwned: true // Assume true, muda depois
  };
  // Atualiza ícones de política
  for (const key in policyIcons) {
    policyIcons[key].textContent = passed[key] ? '✅' : '❌';
    policyIcons[key].style.color = passed[key] ? '#2ecc40' : '#ff4136';
  }
  // Análise zxcvbn
  const result = zxcvbn(pw, customDictionaries);
  // Barra de força
  const score = result.score;
  const colors = ['#ff4136', '#ff851b', '#ffdc00', '#2ecc40', '#0074d9'];
  strengthBar.style.width = ((score + 1) * 20) + '%';
  strengthBar.style.background = colors[score];
  // Texto de força
  const strengthLabels = [
    'Muito fraca',
    'Fraca',
    'Razoável',
    'Forte',
    'Excelente'
  ];
  strengthText.textContent = pw.length === 0 ? '' : `Força: ${strengthLabels[score]}`;
  // Feedback educativo
  let feedbackMsgs = [];
  if (result.feedback.suggestions.length) {
    feedbackMsgs = feedbackMsgs.concat(result.feedback.suggestions);
  }
  if (!passed.length) feedbackMsgs.push('Aumente o tamanho da senha para pelo menos 10 caracteres.');
  if (!passed.uppercase) feedbackMsgs.push('Inclua pelo menos uma letra maiúscula.');
  if (!passed.lowercase) feedbackMsgs.push('Inclua pelo menos uma letra minúscula.');
  if (!passed.number) feedbackMsgs.push('Inclua pelo menos um número.');
  if (!passed.symbol) feedbackMsgs.push('Inclua pelo menos um símbolo.');
  if (!passed.dictionary) feedbackMsgs.push('Evite palavras comuns, padrões de teclado ou nomes próprios.');
  if (pw.length > 0 && result.sequence.some(seq => seq.pattern === 'dictionary')) {
    feedbackMsgs.push('Evite palavras do dicionário ou frases populares.');
  }
  if (pw.length > 0 && isWeakPattern(pw)) {
    feedbackMsgs.push('Evite padrões de teclado ou sequências previsíveis.');
  }
  // Exibe feedback
  feedbackMsgs.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = msg;
    feedbackList.appendChild(li);
  });
  // Entropia e tempo de quebra
  if (pw.length > 0) {
    crackTime.textContent = `⏳ Estimativa para quebra: ${getCrackTime(result)}`;
  }
  // Checagem de vazamento (Have I Been Pwned)
  if (pw.length > 0) {
    policyIcons.pwned.textContent = '⏳';
    policyIcons.pwned.style.color = '#ffdc00';
    checkPwned(pw).then(found => {
      if (lastPassword !== pw) return; // Evita race condition
      if (found) {
        pwnedAlert.textContent = '⚠️ Esta senha já foi comprometida em vazamentos públicos!';
        policyIcons.pwned.textContent = '❌';
        policyIcons.pwned.style.color = '#ff4136';
      } else {
        policyIcons.pwned.textContent = '✅';
        policyIcons.pwned.style.color = '#2ecc40';
      }
    });
  }
});

// Mostrar/ocultar senha
togglePassword.addEventListener('click', function () {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  togglePassword.innerHTML = type === 'password'
    ? '<i class="ri-eye-line"></i>'
    : '<i class="ri-eye-off-line"></i>';
});

