import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { initDatabase } from './src/config/database.js';

// Importe as rotas e adicione logs para depuração
import especiesRoutes from './src/routes/especies.js';
import ameacasRoutes from './src/routes/ameacas.js';
import jogoRoutes from './src/routes/jogo.js';
import conexoesRoutes from './src/routes/conexoes.js';
import authRoutes from './src/routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 🛡️ Segurança
app.use(helmet());

// ✅ CORS corrigido para aceitar múltiplas origens
const allowedOrigins = [
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://172.22.16.1:5000',
  'http://192.168.56.1:5000',
  'http://192.168.1.14:5000',
  process.env.REPLIT_DEV_DOMAIN
].filter(Boolean); // Remove valores undefined

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requisições sem origin (Postman, apps mobile, etc)
    if (!origin) return callback(null, true);
    
    // Em desenvolvimento, aceita qualquer IP local (mais flexível)
    if (process.env.NODE_ENV !== 'production') {
      // Aceita localhost, 127.0.0.1 e qualquer IP privado (192.168.x.x, 172.x.x.x, 10.x.x.x)
      if (origin.match(/^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|172\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+):\d+$/)) {
        return callback(null, true);
      }
    }
    
    // Verifica se a origin está na lista de permitidas (produção)
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 🚦 Limite de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// 📦 Parsing de corpo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Montagem de rotas com logs de depuração
console.log('Verificando rotas antes de montá-las...');  // Log para depuração
app.use('/api', especiesRoutes);
app.use('/api', ameacasRoutes);
app.use('/api', jogoRoutes);
app.use('/api', conexoesRoutes);
app.use('/api', authRoutes);

// 🔍 Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ❌ Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);  // Log mais detalhado
  res.status(500).json({ 
    error: 'Algo deu errado no servidor!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno'
  });
});

// 🚫 Rota não encontrada - CORRIGIDO
// Removido o parâmetro '*' que causava o erro
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    path: req.path,
    method: req.method
  });
});

// 🚀 Inicialização
const startServer = async () => {
  try {
    // Inicializar banco de dados
    await initDatabase();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌿 Servidor do Mundo dos Mangues rodando na porta ${PORT}`);
      console.log(`🔗 Acesse: http://localhost:${PORT}`);
      console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Banco de dados PostgreSQL conectado`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;