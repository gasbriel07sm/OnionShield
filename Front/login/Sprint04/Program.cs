using System;
using System.Collections.Generic;

class Pessoa
{
    public string Nome { get; set; }
    public int Idade { get; set; }
    public string CPF { get; set; }

    public void ExibirDados()
    {
        Console.WriteLine($"Nome: {Nome}, Idade: {Idade}, CPF: {CPF}");
    }
}

class Program
{
    static void Main(string[] args)
    {
        List<Pessoa> ListaDePessoa = new List<Pessoa>();

        Console.WriteLine("\n=== CADASTRO DE PESSOA ===\n");

        Pessoa pessoa = new Pessoa();

        Console.Write("Digite seu nome: ");
        pessoa.Nome = Console.ReadLine();

        Console.Write("Digite sua idade: ");
        pessoa.Idade = int.Parse(Console.ReadLine());

        Console.Write("Digite seu CPF: ");
        pessoa.CPF = Console.ReadLine();

        ListaDePessoa.Add(pessoa);

        Console.WriteLine("\n=== Seu cadastro foi concluído! ===\n");

        foreach (var p in ListaDePessoa)
        {
            p.ExibirDados();
        }
    }
}
