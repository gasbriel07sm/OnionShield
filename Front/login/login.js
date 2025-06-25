
  // Alternar entre login e cadastro
  function toggleForm(type) {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const btnLogin = document.getElementById("btnLogin");
    const btnRegister = document.getElementById("btnRegister");

    if (type === "login") {
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
      btnLogin.classList.add("active");
      btnRegister.classList.remove("active");
    } else {
      loginForm.classList.add("hidden");
      registerForm.classList.remove("hidden");
      btnLogin.classList.remove("active");
      btnRegister.classList.add("active");
    }
  }

  // Função para exibir modal customizado
  function exibirMensagemModal(titulo, mensagem) {
    document.getElementById("modal-title").innerText = titulo;
    document.getElementById("modal-message").innerText = mensagem;
    document.getElementById("custom-modal").classList.remove("hidden");
  }

  function fecharModal() {
    document.getElementById("custom-modal").classList.add("hidden");
  }

  // Enviar dados para API no cadastro
  function BuscarAPI() {
    const nome = document.getElementById("caixa-texto-nome").value.trim();
    const idade = document.getElementById("caixa-texto-idade").value.trim();
    const cpf = document.getElementById("caixa-texto").value.trim();
    const email = document.getElementById("caixa-texto-email").value.trim();
    const senha = document.getElementById("caixa-texto-senha").value.trim();

    if (!nome || !idade || !cpf || !email || !senha) {
      exibirMensagemModal("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    fetch("https://localhost:7109/api/pessoa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        idade: parseInt(idade),
        cpf,
        email,
        senha
      })
    })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          try {
            throw JSON.parse(text);
          } catch {
            throw new Error(text || "Erro desconhecido");
          }
        });
      }
      return res.json();
    })
    .then(data => {
      exibirMensagemModal("Cadastro realizado", data.mensagem || "Pessoa cadastrada com sucesso.");
    })
    .catch(err => {
      console.error("Erro:", err);
      exibirMensagemModal("Erro no cadastro", err.erro || err.message || "Erro ao conectar com a API.");
    });
  }

  // Validação de login
  document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const emailLogin = this.querySelector('input[type="email"]').value.trim();
    const senhaLogin = this.querySelector('input[type="password"]').value.trim();

    if (!emailLogin || !senhaLogin) {
      exibirMensagemModal("Atenção", "Por favor, preencha email e senha.");
      return;
    }

    fetch("https://localhost:7109/api/pessoa")
      .then(res => {
        if (!res.ok) throw new Error("Erro ao acessar API");
        return res.json();
      })
      .then(users => {
        const user = users.find(u => u.email === emailLogin && u.senha === senhaLogin);

if (user) {
  localStorage.setItem("usuarioLogado", JSON.stringify(user)); // Salva dados do usuário
  exibirMensagemModal("Sucesso", `Bem-vindo, ${user.nome}! Login efetuado com sucesso.`);
  setTimeout(() => {
    window.location.href = "../../index.html"; // Redireciona para página principal
  }, 2000);
}
else {
          exibirMensagemModal("Erro", "Email ou senha inválidos.");
        }
      })
      .catch(err => {
        console.error(err);
        exibirMensagemModal("Erro", "Erro ao conectar com a API.");
      });
  });

