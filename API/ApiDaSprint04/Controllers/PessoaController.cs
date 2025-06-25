using ApiDaSprint04.Models;
using ApiDaSprint04.Services;
using Microsoft.AspNetCore.Mvc;

namespace ApiDaSprint04.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoaController : ControllerBase
    {
        private readonly PessoaService _service = new PessoaService();

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_service.ObterTodas());
        }

        [HttpGet("logado")]
        public IActionResult VerificarLogin()
        {
            var usuario = _service.ObterUsuarioLogado();
            if (usuario != null)
                return Ok(new { mensagem = "Usuário está logado", usuario = usuario.Email });
            else
                return Unauthorized(new { erro = "Nenhum usuário está logado." });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var resultado = _service.Logout();
            if (resultado == "Logout realizado com sucesso!")
                return Ok(new { mensagem = resultado });
            else
                return BadRequest(new { erro = resultado });
        }

        [HttpPost]
        public IActionResult Post([FromBody] Pessoa pessoa)
        {
            var resultado = _service.Adicionar(pessoa);
            if (resultado == "Pessoa adicionada com sucesso!")
                return Ok(new { mensagem = resultado });
            else
                return BadRequest(new { erro = resultado });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Pessoa pessoa)
        {
            var resultado = _service.Autenticar(pessoa.Email, pessoa.Senha);
            if (resultado == "Login realizado com sucesso!")
                return Ok(new { mensagem = resultado });
            else
                return Unauthorized(new { erro = resultado });
        }
    }
}