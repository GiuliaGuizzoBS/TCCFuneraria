Sistema de Gerenciamento Administrativo da Funerária Menino Deus
Sobre o Projeto

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) com o objetivo de propor e implementar um sistema web para auxiliar na gestão administrativa da Funerária Menino Deus. A proposta busca otimizar os processos internos, melhorar a organização e tornar o atendimento aos clientes mais eficiente e ágil.

Objetivos

Digitalizar e organizar os processos de atendimento funerário.

Permitir o cadastro e gerenciamento de falecidos, clientes e serviços contratados.

Disponibilizar um painel administrativo para controle interno da empresa.

Garantir usabilidade e responsividade em diferentes dispositivos.

Tecnologias Utilizadas

Frontend: HTML, CSS e JavaScript

Backend: Node.js com Express

Banco de Dados: MySQL

Template Engine: EJS

Estrutura do Projeto
funeraria-menino-deus
 ┣ config         # Configurações do banco de dados
 ┣ models         # Modelos do banco (usuários, clientes, falecidos, serviços)
 ┣ routes         # Rotas da aplicação
 ┣ controllers    # Regras de negócio e lógica
 ┣ views          # Arquivos EJS para renderização
 ┣ public         # Arquivos estáticos (CSS, JS, imagens)
 ┣ server.js      # Arquivo principal do servidor
 ┣ package.json   # Dependências e scripts do projeto
 ┗ README.md      # Documentação

Como Executar o Projeto

Clonar o repositório:

git clone https://github.com/seu-usuario/funeraria-menino-deus.git


Acessar a pasta do projeto:

cd funeraria-menino-deus


Instalar as dependências:

npm install


Configurar o banco de dados:

Criar um banco de dados no MySQL.

Editar o arquivo config/db.js com as credenciais de acesso.

Iniciar o servidor:

npm start


Acessar no navegador:

http://localhost:3000

Autenticação e Níveis de Acesso

Administrador: possui acesso completo ao sistema, incluindo a gestão de usuários e serviços.

Funcionário: possui acesso restrito às funções de cadastro e atendimento.

Funcionalidades

Sistema de login com autenticação e diferentes níveis de acesso.

Cadastro e gerenciamento de clientes e falecidos.

Registro e acompanhamento de serviços contratados.

Painel administrativo responsivo e de fácil utilização.

Integração com banco de dados MySQL.

Autores
Eloá Brizeis Costa Santana e Giulia Guizzo Baladão Santos
Trabalho de Conclusão de Curso – Instituto Federal Catarinense 
Sombrio – SC, 2025