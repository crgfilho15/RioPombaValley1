const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const SECRET_KEY = 'minhaChaveSecreta';

app.use(bodyParser.json());

// Função para gerar o JWT
const generateJWT = (userId) => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' });
};

// Middleware para verificar o JWT
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1]; // Extrai o token do formato "Bearer <token>"

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido.' });
    }

    req.userId = decoded.id; // Salva o id do usuário na requisição
    next(); // Continua para a próxima função
  });
};

// Rota para autenticar e gerar o JWT
app.post('/jwt/auth', (req, res) => {
  const { usuario, senha } = req.body;

  // Autenticação fictícia (apenas para exemplo)
  if (usuario === 'admin' && senha === '1234') {
    const token = generateJWT(usuario);
    return res.json({ token });
  } else {
    return res.status(403).json({ message: 'Usuário ou senha incorretos.' });
  }
});

// Rota protegida para listar os métodos HTTP
app.get('/jwt/metodosHttp', verifyJWT, (req, res) => {
  const metodosHttp = {
    get: {
      objetivo_principal: 'Obter recursos do servidor.',
      limite_caracteres: 'Ilimitado (depende da URL).',
      aceita_https: 'Sim',
      aceita_http: 'Sim',
    },
    post: {
      objetivo_principal: 'Enviar dados para o servidor.',
      limite_caracteres: 'Ilimitado no corpo da requisição.',
      aceita_https: 'Sim',
      aceita_http: 'Sim',
    },
    put: {
      objetivo_principal: 'Atualizar recursos no servidor.',
      limite_caracteres: 'Ilimitado no corpo da requisição.',
      aceita_https: 'Sim',
      aceita_http: 'Sim',
    },
    patch: {
      objetivo_principal: 'Atualizar parcialmente recursos no servidor.',
      limite_caracteres: 'Ilimitado no corpo da requisição.',
      aceita_https: 'Sim',
      aceita_http: 'Sim',
    },
    delete: {
      objetivo_principal: 'Remover recursos do servidor.',
      limite_caracteres: 'Ilimitado (depende da URL).',
      aceita_https: 'Sim',
      aceita_http: 'Sim',
    },
  };

  res.json(metodosHttp);
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
