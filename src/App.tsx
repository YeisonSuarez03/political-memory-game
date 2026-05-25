import { useState, useCallback } from 'react';
import { RefreshCw, ChevronRight, Home, Heart, TrendingUp, Shield, BookOpen, Leaf, HelpCircle, Zap } from 'lucide-react';
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
      setFlipped((prev) => prev.filter((id) => id !== cardId));
      setScores((prev) => ({
        ...prev,
        [candidateId]: Math.max(0, (prev[candidateId] ?? 0) - 1),
      }));
    } else {
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
      <div className="min-h-screen game-bg flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Background accent blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-comic-red opacity-30 blur-2xl" />
          <div className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full bg-comic-yellow opacity-20 blur-2xl" />
        </div>

        <div className="relative max-w-lg w-full text-center space-y-6">
          {/* VS badge */}
          <div className="inline-flex items-center gap-2 bg-comic-yellow text-comic-black font-bangers text-sm tracking-widest px-5 py-1.5 comic-panel uppercase">
            <Zap className="w-4 h-4" />
            Pedagogía Electoral 2026
          </div>

          {/* Title */}
          <div>
            <h1 className="font-bangers text-6xl md:text-7xl text-comic-yellow text-stroke leading-none tracking-wide">
              SIN COPIAR
            </h1>
            <h1 className="font-bangers text-6xl md:text-7xl text-white text-stroke leading-none tracking-wide">
              Y PEGAR
            </h1>
            <p className="font-oswald text-comic-yellow/80 text-base mt-2 uppercase tracking-widest">
              Descubre con que candidato a la presidencia 2026 coinciden tus ideales para Colombia. 
            </p>
          </div>

          {/* Candidate preview */}
          <div className="flex justify-center gap-6 py-2">
            {CANDIDATES.map((c, i) => (
              <div key={c.id} className="flex flex-col items-center gap-2">
                {i === 1 && (
                  <span className="font-bangers text-comic-yellow text-2xl text-stroke-sm self-center mb-1 hidden sm:block">VS</span>
                )}
                <div className="w-20 h-20 overflow-hidden comic-panel-lg bg-comic-black"
                  style={{ borderRadius: 4 }}>
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover object-top" />
                </div>
                <span className="font-oswald font-bold text-white text-xs text-center max-w-[80px] leading-tight uppercase">
                  {c.name}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={startGame}
            className="comic-btn w-full bg-comic-yellow hover:bg-comic-yellow-dark text-comic-black font-bangers text-2xl py-4 tracking-widest flex items-center justify-center gap-2 uppercase"
          >
            ¡Jugar ahora!
            <ChevronRight className="w-6 h-6" />
          </button>

          <p className="font-oswald text-white/50 text-xs uppercase tracking-wider">
            Haz clic en las propuestas que más feeling tengan contigo para revelar el candidato.
          </p>
        </div>
      </div>
    );
  }

  // ── PLAYING ───────────────────────────────────────────────
  return (
    <div className="min-h-screen game-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-comic-black border-b-4 border-comic-yellow">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setPhase('intro'); resetGame(); }}
            className="comic-btn bg-comic-blue text-white p-2"
            aria-label="Inicio"
          >
            <Home className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-bangers text-comic-yellow text-xl leading-none tracking-wider">SIN COPIAR Y PEGAR</h1>
            <p className="font-oswald text-white/50 text-xs mt-0.5 uppercase tracking-widest">Tu voto. Tus razones.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="font-oswald text-white/60 text-sm hidden md:block uppercase tracking-wide">¿Tu voto sobrevivirá al algoritmo?</p>
          <button
            onClick={resetGame}
            className="comic-btn bg-comic-red text-white p-2"
            aria-label="Reiniciar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 gap-6 px-6 py-5 mx-auto w-full justify-between">
        {/* Grid */}
        <main className="w-full flex-1 flex items-start justify-center overflow-auto min-w-0">
          <div className="overflow-hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-[1400px] mx-auto">
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
          <div className="comic-panel bg-comic-black p-4" style={{ borderRadius: 4 }}>
            <p className="font-bangers text-comic-yellow text-base tracking-widest uppercase mb-3">Categorías</p>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <div key={cat.key} className="flex items-center gap-2">
                  <div className={`w-7 h-7 ${cat.color} flex items-center justify-center text-white comic-panel shrink-0`}
                    style={{ borderRadius: 3 }}>
                    {CAT_ICON_MAP[cat.icon] ?? <HelpCircle className="w-4 h-4" />}
                  </div>
                  <span className="font-oswald text-white text-sm uppercase tracking-wide">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="comic-panel bg-comic-blue/40 p-3" style={{ borderRadius: 4 }}>
            <p className="font-oswald text-white/70 text-xs leading-relaxed uppercase tracking-wide">
              Selecciona las propuestas que más feeling tengan contigo; el marcador mostrará cuántas seleccionaste por candidato.
            </p>
          </div>
        </aside>
      </div>

      {/* Reset button (bottom) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <button
          onClick={resetGame}
          className="comic-btn bg-comic-yellow text-comic-black font-bangers text-xl px-8 py-3 tracking-widest uppercase"
        >
          ¡Reiniciar!
        </button>
      </div>
    </div>
  );
}

