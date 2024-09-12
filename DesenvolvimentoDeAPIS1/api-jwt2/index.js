const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

const SECRET_KEY = 'minha-chave-secreta';

// Middleware para parsing de JSON
app.use(express.json());

// Usuários de exemplo
const users = [
  { id: 1, usuario: 'user1', senha: 'senha123' },
  { id: 2, usuario: 'user2', senha: 'senha456' }
];

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Verifica se o token foi enviado no header
  if (!authHeader) {
    return res.status(403).json({ auth: false, message: 'Token não fornecido.' });
  }

  // Verifica se o header tem o prefixo "Bearer"
  const token = authHeader.split(' ')[1]; // Extrai o token do formato "Bearer <token>"

  if (!token) {
    return res.status(403).json({ auth: false, message: 'Token malformado.' });
  }

  // Verifica se o token é válido
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ auth: false, message: 'Token inválido.' });
    }

    // Se o token for válido, salvamos as informações do usuário na requisição
    req.userId = decoded.id;
    next();
  });
};

// Rota 1: Autenticar um usuário e gerar JWT
app.post('/auth/login', (req, res) => {
  const { usuario, senha } = req.body;

  // Verifica se o usuário e a senha são válidos
  const user = users.find(u => u.usuario === usuario && u.senha === senha);

  if (!user) {
    return res.status(401).json({ message: 'Usuário ou senha inválidos' });
  }

  // Gerar o token JWT
  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ auth: true, token });
});

// Rota 2: Listar todas as JWT claims e definições (Protegida)
app.get('/jwt/claims', verifyJWT, (req, res) => {
  const claims = {
    iss: 'Emissor do token (Issuer)',
    sub: 'Assunto do token (Subject)',
    aud: 'Destinatário do token (Audience)',
    exp: 'Data de expiração do token (Expiration)',
    nbf: 'Data em que o token começa a ser válido (Not Before)',
    iat: 'Data de criação do token (Issued At)',
    jti: 'Identificador exclusivo do token (JWT ID)',
    'custom-claim': 'Claims personalizadas podem ser adicionadas conforme a necessidade'
  };

  res.json(claims);
});

// Rota 3: Gerar token com ID do usuário (login)
app.post('/jwt/tokenid', (req, res) => {
  const { usuario, senha } = req.body;

  // Verifica se o usuário e a senha são válidos
  const user = users.find(u => u.usuario === usuario && u.senha === senha);

  if (!user) {
    return res.status(401).json({ message: 'Usuário ou senha inválidos' });
  }

  const token = jwt.sign(
    { id: user.id }, // claim de ID do usuário
    SECRET_KEY,
    { expiresIn: '1h' } // Expira em 1 hora
  );

  res.json({
    token,
    message: 'JWT gerado com sucesso!',
  });
});

// Servidor rodando na porta 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
