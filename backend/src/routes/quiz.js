import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Helper para obter o caminho do diretório atual com import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rota para obter os dados do quiz
router.get('/quiz', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'data', 'quiz.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Erro ao ler os dados do quiz:', error);
    res.status(500).json({ error: 'Não foi possível carregar os dados do quiz.' });
  }
});

export default router;
