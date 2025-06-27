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
  } 
});

function logout() {
  localStorage.removeItem("usuarioLogado");
  location.reload();
}