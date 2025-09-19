const express = require('express');
const { json } = require('stream/consumers');

const app = express();

const PORT = 300;

const filmes = [
    {
        'nome':'Lara Croft',
        'nota': 5.0,
        'Idade': '10+' 
    },
    {
        'nome': 'Tropa de Elite',
        'nota': 5.0,
        'idade': '+18'
    }
];

app.get('/filmes',(req,resp) => {
    resp.send(json(filmes))
});

app.listen(PORT, () =>{
    console.log(`Servidor rodando em http://localhost:${PORT}/sobre`);
    console.log(`Para parar o servidor, pressione cntr + C no terminal`)
}
);
