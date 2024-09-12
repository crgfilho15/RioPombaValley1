const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'minha-chave-secreta';

app.use(bodyParser.json());

const usuarios = [
    { usuario: 'carlos', senha: '123456' }
];

app.post('/auth/login', (req, res) => {
    const { usuario, senha } = req.body;
    const user = usuarios.find(u => u.usuario === usuario && u.senha === senha);
    if (user) {
        const token = jwt.sign({ usuario: user.usuario }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ mensagem: 'Usuário ou senha incorretos' });
    }
});

const autenticarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token == null) return res.status(401).json({ mensagem: 'Token não fornecido' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ mensagem: 'Token inválido' });
        req.user = user;
        next();
    });
};

app.get('/produtos', autenticarToken, (req, res) => {
    const produtos = [
        { id: 1, nome: 'escova de dente', preco: '10.00' },
        { id: 2, nome: 'shampoo', preco: '40.00' }
    ];
    res.json({ produtos });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
