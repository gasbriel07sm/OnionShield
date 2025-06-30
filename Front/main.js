/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('show-menu');
      toggle.classList.toggle('show-icon');
    });
  }
};

showMenu('nav-toggle', 'nav-menu');

document.addEventListener("DOMContentLoaded", function () {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    // Seleciona os links que você quer bloquear
    const linksProtegidos = document.querySelectorAll(".protegido");

    linksProtegidos.forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault(); // Impede o acesso

        // Detecta se está em subpasta e ajusta o caminho do login
        let loginPath = "login/login.html";
        // Conta quantos níveis acima precisa subir
        let path = window.location.pathname;
        let up = 0;
        if (path.includes("/info/") || path.includes("/criptografia/")) {
          // Exemplo: /Front/info/quiz/quiz1/quiz1.html → precisa de ../../
          up = path.split('/').filter(p => p === "info" || p === "criptografia").length;
        }
        if (up > 0) {
          loginPath = "../".repeat(up) + "login/login.html";
        }
        window.location.href = loginPath;
      });
    });
  }
});

function logout() {
  localStorage.removeItem("usuarioLogado");
  location.reload();
}

  document.addEventListener("DOMContentLoaded", function () {
    const usuarioLogado = localStorage.getItem("usuarioLogado");

    if (!usuarioLogado) {
      // Seleciona os links que você quer bloquear
      const linksProtegidos = document.querySelectorAll(".protegido");

      linksProtegidos.forEach(link => {
        link.addEventListener("click", function (e) {
          e.preventDefault(); // Impede o acesso
          window.location.href = "login/login.html"; // Redireciona para login
        });
      });
    }
  });

  function showTeamDesc(idx) {
  const descs = document.querySelectorAll('.team-desc');
  descs.forEach((desc, i) => {
    desc.style.display = (i === idx && desc.style.display !== 'block') ? 'block' : 'none';
  });
}