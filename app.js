const express = require('express');

const app = express();

const PORT = 3000;

app.get('/',(req,res) => {
    res.send('Bem vindo ao teste!!!!');
});

app.get('/sobre',(req,res) => {
    console.log("Essa Bomba é a evolução dos apps");
});

app.use(express.json());

app.listen(PORT, () =>{
    console.log(`Servidor rodando em http://localhost:${PORT}/sobre`);
    console.log(`Para parar o servidor, pressione Ctrl + C no terminal`)
}
);

const testes  = [
    {
    'id':testes,
    'preco':1200
    },
    {
        'id':testes,
        'preco':7800
    }
];

app.get('/api/produtos',(req,res) => {
    res.json(testes);
});

let produtos = [
  {id: 1, nome: 'Teclado Mecânico', preco: 450.00},
  {id: 2, nome: 'Mouse Gamer', preco: 150.00},
  {id: 3, nome: 'Montior UltraWide', preco: 1200.00}
];

let nextId = 4;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Para parar o servidor, pressione Ctrl + C no terminal');
});

app.post('/api/produtos', (req, res) => { 
  const { nome, preco } = req.body;
  if (!nome || !preco) {
    return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
  }
  const novoProduto = { id: nextId++, nome, preco };
  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});