import { useState, useCallback } from 'react';
import { RefreshCw, Star, ChevronRight, Home, Heart, TrendingUp, Shield, BookOpen, Leaf, HelpCircle } from 'lucide-react';
import MemoryCard from './components/MemoryCard';
import ScoreBoard from './components/ScoreBoard';
import { CATEGORIES, CANDIDATES, type CategoryKey } from './gameData';

// ── Icon map for category legend ────────────────────────────
const CAT_ICON_MAP: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Leaf: <Leaf className="w-4 h-4" />,
};

// ── Types ────────────────────────────────────────────────────
interface CardData {
  id: string; // unique instance id
  candidateId: number;
  categoryKey: CategoryKey;
}

// ── Helpers ──────────────────────────────────────────────────
function buildDeck(): CardData[] {
  const cards: CardData[] = [];
  CANDIDATES.forEach((candidate) => {
    CATEGORIES.forEach((cat) => {
      cards.push({
        id: `${candidate.id}-${cat.key}`,
        candidateId: candidate.id,
        categoryKey: cat.key,
      });
    });
  });
  // shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

// ── Game states ──────────────────────────────────────────────
type Phase = 'intro' | 'playing';

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [deck, setDeck] = useState<CardData[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]); // selected cards (revealed candidate)
  const [scores, setScores] = useState<Record<number, number>>({});

  const startGame = useCallback(() => {
    setDeck(buildDeck());
    setFlipped([]);
    setScores({});
    setPhase('playing');
  }, []);

  const resetGame = useCallback(() => {
    // keep the same shuffled deck, but flip everything back and reset counters
    setFlipped([]);
    setScores({});
  }, []);

  const handleCardClick = (cardId: string) => {
    if (phase !== 'playing') return;
    const card = deck.find((c) => c.id === cardId);
    if (!card) return;

    const candidateId = card.candidateId;
    const isNowFlipped = flipped.includes(cardId);

    if (isNowFlipped) {
      // unselect: remove flip and decrement score
      setFlipped((prev) => prev.filter((id) => id !== cardId));
      setScores((prev) => ({
        ...prev,
        [candidateId]: Math.max(0, (prev[candidateId] ?? 0) - 1),
      }));
    } else {
      // select: flip and increment score
      setFlipped((prev) => [...prev, cardId]);
      setScores((prev) => ({
        ...prev,
        [candidateId]: (prev[candidateId] ?? 0) + 1,
      }));
    }
  };

  const getCategoryForCard = (card: CardData) => CATEGORIES.find((c) => c.key === card.categoryKey)!;
  const getCandidateForCard = (card: CardData) => CANDIDATES.find((c) => c.id === card.candidateId)!;

  // ── INTRO ─────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen game-bg flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 rounded-full px-4 py-1 text-sm font-medium">
            <Star className="w-4 h-4" />
            Pedagogía Electoral 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            SIN COPIAR Y PEGAR
          </h1>
          <p className="text-white/70 text-base leading-relaxed">
            Descubre con que candidato a la presidencia 2026 coinciden tus ideales para Colombia. 
          </p>

          {/* Candidate preview */}
          <div className="flex justify-center gap-4">
            {CANDIDATES.map((c) => (
              <div key={c.id} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white/30 shadow-lg">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover object-top" />
                </div>
                <span className="text-white/60 text-xs text-center max-w-[80px] leading-tight">
                  {c.name.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={startGame}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-lg py-4 rounded-2xl shadow-lg shadow-yellow-400/20 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
          >
            Jugar ahora
            <ChevronRight className="w-5 h-5" />
          </button>

          <p className="text-white/40 text-xs">Haz clic en las propuestas que más feeling tengan contigo para revelar el candidato.</p>
        </div>
      </div>
    );
  }

  // ── PLAYING ───────────────────────────────────────────────
  return (
    <div className="min-h-screen game-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setPhase('intro');
              resetGame();
            }}
            className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-xl transition-all"
            aria-label="Inicio"
          >
            <Home className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-white font-black text-lg leading-none">SIN COPIAR Y PEGAR</h1>
            <p className="text-white/50 text-xs mt-0.5">Tu voto. Tus razones.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-white/60 text-sm">¿Tu voto sobrevivirá al algoritmo?</p>
          <button
            onClick={resetGame}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all"
            aria-label="Reiniciar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 gap-6 px-8 py-6 mx-auto w-full justify-between">
        {/* Grid */}
        <main className="w-full flex-1 flex items-start justify-center overflow-auto min-w-0">
          <div className="overflow-hidden max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-[1400px] mx-auto">
            {deck.map((card) => {
              const category = getCategoryForCard(card);
              const candidate = getCandidateForCard(card);
              return (
                <MemoryCard
                  key={card.id}
                  category={category}
                  candidate={candidate}
                  isFlipped={flipped.includes(card.id)}
                  onClick={() => handleCardClick(card.id)}
                />
              );
            })}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="lg:w-64 space-y-4">
          <ScoreBoard scores={scores} />

          {/* Category legend */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <p className="text-white/60 text-xs uppercase tracking-wide font-medium mb-3">Categorías</p>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <div key={cat.key} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg ${cat.color} flex items-center justify-center text-white`}>
                    {CAT_ICON_MAP[cat.icon] ?? <HelpCircle className="w-4 h-4" />}
                  </div>
                  <span className="text-white/80 text-sm">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <p className="text-white/50 text-xs leading-relaxed">Selecciona las propuestas que más feeling tengan contigo; el marcador mostrará cuántas seleccionaste por candidato.</p>
          </div>
        </aside>
      </div>

      {/* Reset button (bottom) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <button
          onClick={resetGame}
          className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black px-6 py-3 rounded-full shadow-xl"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
