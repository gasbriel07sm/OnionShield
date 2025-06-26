/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) =>{
   const toggle = document.getElementById(toggleId),
         nav = document.getElementById(navId)

   toggle.addEventListener('click', () =>{
       // adicionar menu da classe
       nav.classList.toggle('show-menu')

       // adicionar ícone de entrar e sair
       toggle.classList.toggle('show-icon')
   })
}

showMenu('nav-toggle','nav-menu')

// ...existing code...
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("usuarioLogado"));
  const loginArea = document.getElementById("login-area");

  // Detecta o nível do diretório para montar o caminho correto
  let loginPath = "login/login.html";
  const path = window.location.pathname;
  if (path.includes("/info/") || path.includes("/contato/") || path.includes("/criptografia/")) {
    loginPath = "../login/login.html";
    // Se estiver em subpasta de subpasta (ex: /criptografia/medidor_senha/)
    if ((path.match(/\//g) || []).length > 3) {
      loginPath = "../../login/login.html";
    }
  }

  if (user && loginArea) {
    loginArea.innerHTML = `
      <li class="dropdown__item">
        <div class="nav__link">
          <i class="ri-user-line"></i> Olá, ${user.nome.split(" ")[0]}
          <i class="ri-arrow-down-s-line dropdown__arrow"></i>
        </div>
        <ul class="dropdown__menu">
          <li>
            <a href="#" class="dropdown__link" onclick="logout()">
              <i class="ri-logout-box-line"></i> Sair
            </a>
          </li>
        </ul>
      </li>
    `;
  } else if (loginArea) {
    loginArea.innerHTML = `
      <li>
        <a href="${loginPath}" class="nav__link">
           Login
        </a>
      </li>
    `;
  }
});
// ...existing code...

function logout() {
  localStorage.removeItem("usuarioLogado");
  location.reload();
}

