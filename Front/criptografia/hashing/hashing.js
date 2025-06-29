// Verifica se o usuário está logado
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    // Redireciona para login se não estiver logado
    window.location.href = "../../login/login.html";
  }
// Alternar visibilidade do campo
      const input = document.getElementById('hash-input');
      const toggleBtn = document.getElementById('toggle-visibility');
      toggleBtn.addEventListener('click', function() {
        if (input.type === "password") {
          input.type = "text";
          toggleBtn.innerHTML = '<i class="ri-eye-line"></i>';
        } else {
          input.type = "password";
          toggleBtn.innerHTML = '<i class="ri-eye-off-line"></i>';
        }
      });
    const algMap = {
  "sha-1": "SHA-1",
  "sha-256": "SHA-256",
  "sha-384": "SHA-384",
  "sha-512": "SHA-512"
};
let webCryptoAlg = algMap[algoritmo] || algoritmo;

      function arrayBufferToHex(buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
      }
      function arrayBufferToBase64(buffer) {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      }

      async function gerarHash() {
  const texto = input.value;
  const algoritmo = document.getElementById('algoritmo').value;
  const resultadoDiv = document.getElementById('resultado');
  const formatosDiv = document.getElementById('formatos');
  resultadoDiv.style.display = "block";
  formatosDiv.innerHTML = "";

  if (!texto) {
    resultadoDiv.textContent = "Digite algum valor para gerar o hash.";
    return;
  }

  if (algoritmo === "md5") {
    const hashHex = md5(texto);
    resultadoDiv.textContent = "MD5 (hex): " + hashHex;
    formatosDiv.innerHTML = "Base64: " + btoa(hexToBytes(hashHex));
  } else {
    let hashBuffer;
    // Corrija aqui: algoritmo deve ser em MAIÚSCULO
    let webCryptoAlg = algoritmo.toUpperCase();
    try {
      hashBuffer = await crypto.subtle.digest(webCryptoAlg, new TextEncoder().encode(texto));
    } catch (e) {
      resultadoDiv.textContent = "Erro ao calcular hash: " + e;
      return;
    }
    const hex = arrayBufferToHex(hashBuffer);
    const base64 = arrayBufferToBase64(hashBuffer);
    resultadoDiv.textContent = webCryptoAlg + " (hex): " + hex;
  }
}

      // Função auxiliar para converter hex em bytes para base64 (MD5)
      function hexToBytes(hex) {
        let bytes = [];
        for (let c = 0; c < hex.length; c += 2)
          bytes.push(String.fromCharCode(parseInt(hex.substr(c, 2), 16)));
        return bytes.join('');
      }

      