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
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("usuarioLogado"));
  const loginArea = document.getElementById("login-area");

  if (user && loginArea) {
    // Usuário logado: mostra dropdown igual aos outros
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
    // Usuário não logado: mostra botão de login
    loginArea.innerHTML = `
      <li>
        <a href="/Front/login/login.html" class="nav__link">
          </i> Login
        </a>
      </li>
    `;
  }
});

function logout() {
  localStorage.removeItem("usuarioLogado");
  location.reload();
}

