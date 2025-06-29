// Verifica se o usuário está logado
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    // Redireciona para login se não estiver logado
    window.location.href = "../../login/login.html";
  }
document.getElementById('url-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const urlInput = document.getElementById('url-input').value.trim();
  const resultDiv = document.getElementById('url-result');
  const tipsDiv = document.getElementById('url-tips');
  resultDiv.style.display = "block";
  tipsDiv.innerHTML = "";

  if (!urlInput) {
    resultDiv.innerHTML = '<span class="url-warning">Digite uma URL para analisar.</span>';
    return;
  }

  let url;
  try {
    url = new URL(urlInput);
  } catch {
    resultDiv.innerHTML = '<span class="url-danger">URL inválida!</span>';
    return;
  }

  let score = 0;
  let messages = [];

  // HTTPS
  if (url.protocol === "https:") {
    score += 2;
    messages.push('<span class="url-safe">✔ Usa HTTPS</span>');
  } else {
    messages.push('<span class="url-warning">⚠ Não usa HTTPS</span>');
  }

  // Porta incomum
  if (url.port && url.port !== "80" && url.port !== "443") {
    score -= 1;
    messages.push('<span class="url-warning">⚠ Porta incomum: ' + url.port + '</span>');
  }

  // IP no lugar do domínio
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname)) {
    score -= 2;
    messages.push('<span class="url-danger">⚠ Domínio é um endereço IP</span>');
  }

  // Palavras suspeitas
  const suspeitas = [
    "login", "secure", "update", "bank", "free", "bonus", "verify", "account", "paypal", "bradesco", "itau", "santander",
    "premio", "premiação", "premiacoes", "premios", "cartao", "senha", "pix", "gov", "receita", "federal"
  ];
  if (suspeitas.some(word => url.hostname.toLowerCase().includes(word) || url.pathname.toLowerCase().includes(word))) {
    score -= 1;
    messages.push('<span class="url-warning">⚠ Contém palavras suspeitas</span>');
  }

  // Muitos subdomínios
  if (url.hostname.split('.').length > 4) {
    score -= 1;
    messages.push('<span class="url-warning">⚠ Muitos subdomínios</span>');
  }

  // URL longa
  if (urlInput.length > 100) {
    score -= 1;
    messages.push('<span class="url-warning">⚠ URL muito longa</span>');
  }

  // Caracteres suspeitos
  if (/[^\w\-\.\/:?#=&%]/.test(urlInput)) {
    score -= 1;
    messages.push('<span class="url-warning">⚠ Caracteres incomuns na URL</span>');
  }

  // Encurtadores de URL
  const encurtadores = [
    "bit.ly", "tinyurl.com", "goo.gl", "ow.ly", "is.gd", "buff.ly", "t.co", "cutt.ly", "shorte.st", "adf.ly"
  ];
  if (encurtadores.some(short => url.hostname.includes(short))) {
    score -= 1;
    messages.push('<span class="url-warning">⚠ Possível encurtador de URL</span>');
  }

  // Símbolo @ (phishing)
  if (urlInput.includes('@')) {
    score -= 2;
    messages.push('<span class="url-danger">⚠ URL contém "@" (pode ocultar destino real)</span>');
  }

  // Homógrafos (Unicode parecido com letras comuns)
  if (/[^\x00-\x7F]/.test(url.hostname)) {
    score -= 2;
    messages.push('<span class="url-danger">⚠ Domínio contém caracteres especiais (homógrafos)</span>');
  }

  // Dominio parecido com marcas conhecidas (phishing visual simples)
  const marcas = [
    "g00gle", "goggle", "faceb00k", "paypa1", "micros0ft", "y0utube", "whatsapp", "netfIix", "instaqram", "tw1tter"
  ];
  if (marcas.some(marca => url.hostname.toLowerCase().includes(marca))) {
    score -= 2;
    messages.push('<span class="url-danger">⚠ Domínio imita marca conhecida</span>');
  }

  // Resultado final
  if (score >= 2) {
    resultDiv.innerHTML = '<span class="url-safe"><i class="ri-shield-check-line"></i> URL provavelmente segura.</span>';
  } else if (score >= 0) {
    resultDiv.innerHTML = '<span class="url-warning"><i class="ri-alert-line"></i> Atenção: verifique a URL com cuidado.</span>';
  } else {
    resultDiv.innerHTML = '<span class="url-danger"><i class="ri-error-warning-line"></i> URL suspeita! Não clique se não tiver certeza.</span>';
  }

  tipsDiv.innerHTML = messages.join('<br>');
});