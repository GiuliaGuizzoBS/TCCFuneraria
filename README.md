Claro! Aqui estão vários exemplos de código JavaScript que cobrem assuntos básicos e intermediários que costumam cair em provas, principalmente em cursos de Análise e Desenvolvimento de Sistemas, como o seu. Cada exemplo está comentado para facilitar o entendimento.

1. Declaração de Variáveis e Tipos
javascript
Copiar
Editar
let nome = "Maria";       // String
const idade = 25;         // Number
let ativo = true;         // Boolean
2. Condicional if / else
javascript
Copiar
Editar
let nota = 7;

if (nota >= 6) {
  console.log("Aprovado");
} else {
  console.log("Reprovado");
}
3. Laço for
javascript
Copiar
Editar
for (let i = 1; i <= 5; i++) {
  console.log("Contagem:", i);
}
4. Laço while
javascript
Copiar
Editar
let contador = 0;

while (contador < 3) {
  console.log("Tentativa", contador + 1);
  contador++;
}
5. Função Simples
javascript
Copiar
Editar
function saudacao(nome) {
  return "Olá, " + nome + "!";
}

console.log(saudacao("João"));
6. Arrow Function
javascript
Copiar
Editar
const dobrar = (n) => n * 2;

console.log(dobrar(5)); // 10
7. Array e Percorrer com forEach
javascript
Copiar
Editar
let frutas = ["maçã", "banana", "uva"];

frutas.forEach(function(fruta) {
  console.log(fruta);
});
8. Array com map
javascript
Copiar
Editar
let numeros = [1, 2, 3];

let quadrados = numeros.map(n => n * n);

console.log(quadrados); // [1, 4, 9]
9. Objeto Literal
javascript
Copiar
Editar
let pessoa = {
  nome: "Ana",
  idade: 30,
  falar: function() {
    console.log("Olá, meu nome é " + this.nome);
  }
};

pessoa.falar();
10. Switch Case
javascript
Copiar
Editar
let dia = 3;

switch(dia) {
  case 1:
    console.log("Domingo");
    break;
  case 2:
    console.log("Segunda");
    break;
  case 3:
    console.log("Terça");
    break;
  default:
    console.log("Outro dia");
}
11. Manipulação do DOM (básica)
html
Copiar
Editar
<!-- HTML -->
<button onclick="clicar()">Clique aqui</button>
<p id="mensagem"></p>

<script>
function clicar() {
  document.getElementById("mensagem").textContent = "Você clicou no botão!";
}
</script>
12. Evento de Click com JavaScript
html
Copiar
Editar
<!-- HTML -->
<button id="botao">Clique</button>
<p id="texto"></p>

<script>
document.getElementById("botao").addEventListener("click", function() {
  document.getElementById("texto").textContent = "Clicou!";
});
</script>
13. Função Recursiva (fatorial)
javascript
Copiar
Editar
function fatorial(n) {
  if (n <= 1) return 1;
  return n * fatorial(n - 1);
}

console.log(fatorial(5)); // 120
14. Validação de Formulário Simples
html
Copiar
Editar
<form onsubmit="return validar()">
  <input id="nome" type="text" placeholder="Nome">
  <button type="submit">Enviar</button>
</form>

<script>
function validar() {
  let nome = document.getElementById("nome").value;
  if (nome === "") {
    alert("Nome obrigatório");
    return false;
  }
  return true;
}
</script>
15. JSON - Converter Objeto para String e Voltar
javascript
Copiar
Editar
let pessoa = { nome: "Carlos", idade: 22 };

let json = JSON.stringify(pessoa); // para string
let obj = JSON.parse(json); // para objeto de novo

console.log(json); // {"nome":"Carlos","idade":22}
console.log(obj.nome); // Carlos
Se quiser, posso te mandar um simulado de prova com questões baseadas nesses códigos, ou montar uma lista com possíveis perguntas teóricas.

Quer?





✅ 1. if, else if, else
javascript
Copiar
Editar
let nota = 8;

if (nota >= 9) {
  console.log("Excelente");
} else if (nota >= 6) {
  console.log("Aprovado");
} else {
  console.log("Reprovado");
}
✅ 2. switch
javascript
Copiar
Editar
let dia = "quarta";

switch (dia) {
  case "segunda":
    console.log("Começo da semana");
    break;
  case "quarta":
    console.log("Meio da semana");
    break;
  case "sexta":
    console.log("Final da semana");
    break;
  default:
    console.log("Dia comum");
}
✅ 3. Operador Ternário (? :)
javascript
Copiar
Editar
let idade = 17;
let podeVotar = idade >= 18 ? "Pode votar" : "Não pode votar";

console.log(podeVotar); // Não pode votar
✅ 4. while
javascript
Copiar
Editar
let i = 0;

while (i < 3) {
  console.log("Contando: " + i);
  i++;
}
✅ 5. do...while
javascript
Copiar
Editar
let senha = "";

do {
  senha = prompt("Digite sua senha:");
} while (senha !== "1234");

console.log("Senha correta!");
O bloco será executado ao menos uma vez, mesmo que a condição seja falsa no início.

✅ 6. for
javascript
Copiar
Editar
for (let i = 1; i <= 5; i++) {
  console.log("Número: " + i);
}