import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { BackButton } from '../components/BackButton';
import { audioFeedback } from '../utils/audioFeedback';
import { HelpCircle, CheckCircle, XCircle, Award, RotateCcw, Lightbulb } from 'lucide-react';

interface PerguntaQuiz {
  pergunta: string;
  opcoes: string[];
  respostaCorreta: string;
  curiosidade: string;
}

export function QuizPage() {
  const { data: perguntas, loading, error } = useApi<PerguntaQuiz[]>('/api/quiz');
  const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null);
  const [pontuacao, setPontuacao] = useState(0);
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);

  const perguntaAtual = perguntas?.[perguntaAtualIndex];
  const ehRespostaCorreta = respostaSelecionada === perguntaAtual?.respostaCorreta;

  const selecionarResposta = (opcao: string) => {
    if (mostrarFeedback) return;

    setRespostaSelecionada(opcao);
    setMostrarFeedback(true);

    if (opcao === perguntaAtual?.respostaCorreta) {
      setPontuacao(p => p + 10);
      audioFeedback.playMatch();
    } else {
      audioFeedback.playError();
    }
  };

  const proximaPergunta = () => {
    setMostrarFeedback(false);
    setRespostaSelecionada(null);

    if (perguntaAtualIndex < (perguntas?.length || 0) - 1) {
      setPerguntaAtualIndex(i => i + 1);
    } else {
      setQuizFinalizado(true);
      audioFeedback.playVictory();
    }
  };

  const reiniciarQuiz = () => {
    setPerguntaAtualIndex(0);
    setPontuacao(0);
    setRespostaSelecionada(null);
    setQuizFinalizado(false);
    setMostrarFeedback(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!perguntas || perguntas.length === 0) return <ErrorMessage message="Nenhuma pergunta encontrada." />;

  if (quizFinalizado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
          <Award className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz Finalizado!</h1>
          <p className="text-xl text-gray-700 mb-6">
            Sua pontuação final foi:
          </p>
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-8">
            {pontuacao}
          </div>
          <button
            onClick={reiniciarQuiz}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-6 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center text-lg"
          >
            <RotateCcw className="h-6 w-6 mr-2" />
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <BackButton to="/" label="Voltar ao Início" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🧠 Quiz do Manguezal
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Teste seus conhecimentos sobre este ecossistema incrível!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          {/* Header da Pergunta */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center bg-yellow-100 text-yellow-800 font-bold px-4 py-2 rounded-full">
              <HelpCircle className="h-5 w-5 mr-2" />
              <span>Pergunta {perguntaAtualIndex + 1} de {perguntas.length}</span>
            </div>
            <div className="flex items-center bg-green-100 text-green-800 font-bold px-4 py-2 rounded-full">
              <Award className="h-5 w-5 mr-2" />
              <span>Pontuação: {pontuacao}</span>
            </div>
          </div>

          {/* Pergunta */}
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-8">
            {perguntaAtual.pergunta}
          </h2>

          {/* Opções */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {perguntaAtual.opcoes.map((opcao, index) => {
              const isSelected = respostaSelecionada === opcao;
              const isCorrect = perguntaAtual.respostaCorreta === opcao;

              let buttonClass = 'bg-gray-100 hover:bg-gray-200 text-gray-800';
              if (mostrarFeedback && isSelected) {
                buttonClass = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
              } else if (mostrarFeedback && isCorrect) {
                buttonClass = 'bg-green-500 text-white';
              }

              return (
                <button
                  key={index}
                  onClick={() => selecionarResposta(opcao)}
                  disabled={mostrarFeedback}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 w-full font-semibold text-lg ${buttonClass}`}
                >
                  <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                  {opcao}
                </button>
              );
            })}
          </div>

          {/* Feedback e Botão de Próxima */}
          {mostrarFeedback && (
            <div className="text-center">
              <div className={`p-4 rounded-2xl mb-6 ${ehRespostaCorreta ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="flex items-center justify-center mb-2">
                  {ehRespostaCorreta ? (
                    <CheckCircle className="h-8 w-8 text-green-600 mr-2" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600 mr-2" />
                  )}
                  <h3 className="text-2xl font-bold">
                    {ehRespostaCorreta ? 'Resposta Correta!' : 'Resposta Incorreta!'}
                  </h3>
                </div>
                {!ehRespostaCorreta && (
                  <p className="text-lg text-gray-700 mb-4">
                    A resposta correta era: <strong>{perguntaAtual.respostaCorreta}</strong>
                  </p>
                )}
                <div className="flex items-start text-left p-4 bg-yellow-100 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-yellow-800">Você Sabia?</h4>
                    <p className="text-yellow-900">{perguntaAtual.curiosidade}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={proximaPergunta}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-8 rounded-2xl hover:opacity-90 transition-opacity text-xl"
              >
                {perguntaAtualIndex < perguntas.length - 1 ? 'Próxima Pergunta' : 'Ver Resultado'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
