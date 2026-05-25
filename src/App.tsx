import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Star, ChevronRight } from 'lucide-react';
import MemoryCard from './components/MemoryCard';
import ScoreBoard from './components/ScoreBoard';
import { CATEGORIES, CANDIDATES, type CategoryKey } from './gameData';

// ── Types ────────────────────────────────────────────────────
interface CardData {
  id: string;         // unique instance id
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
type Phase = 'intro' | 'playing' | 'result';

export default function App() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [deck, setDeck] = useState<CardData[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lastMatchId, setLastMatchId] = useState<number | null>(null);

  const startGame = useCallback(() => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setScores({});
    setMoves(0);
    setLocked(false);
    setLastMatchId(null);
    setPhase('playing');
  }, []);

  // Flip logic
  const handleCardClick = (cardId: string) => {
    if (locked) return;
    if (flipped.includes(cardId)) return;
    if (matched.includes(cardId)) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);

      const [a, b] = newFlipped.map((id) => deck.find((c) => c.id === id)!);

      // Match: same category, different candidates
      if (a.categoryKey === b.categoryKey && a.candidateId !== b.candidateId) {
        // For a 3-candidate game, a "set" is complete when all 3 cards of a category are matched
        const alreadyMatchedForCategory = matched.filter(
          (id) => deck.find((c) => c.id === id)?.categoryKey === a.categoryKey
        );
        const newMatchedForCat = [...alreadyMatchedForCategory, a.id, b.id];
        const newMatched = [...matched, a.id, b.id];
        setMatched(newMatched);

        // Award points to both matched candidates
        setScores((prev) => ({
          ...prev,
          [a.candidateId]: (prev[a.candidateId] ?? 0) + 1,
          [b.candidateId]: (prev[b.candidateId] ?? 0) + 1,
        }));
        setLastMatchId(a.candidateId);

        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
          setLastMatchId(null);
          if (newMatched.length === deck.length) {
            setPhase('result');
          }
        }, 1200);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 1000);
      }
    }
  };

  // Check win from matched state (for 3-card sets, all 15 = 3*5)
  useEffect(() => {
    if (phase === 'playing' && deck.length > 0 && matched.length === deck.length) {
      setPhase('result');
    }
  }, [matched, deck, phase]);

  const topCandidate = CANDIDATES.reduce(
    (best, c) =>
      (scores[c.id] ?? 0) > (scores[best.id] ?? 0) ? c : best,
    CANDIDATES[0]
  );

  const getCategoryForCard = (card: CardData) =>
    CATEGORIES.find((c) => c.key === card.categoryKey)!;
  const getCandidateForCard = (card: CardData) =>
    CANDIDATES.find((c) => c.id === card.candidateId)!;

  // ── INTRO ─────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen game-bg flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 rounded-full px-4 py-1 text-sm font-medium">
            <Star className="w-4 h-4" />
            Juego Electoral 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Memoria<br />
            <span className="text-yellow-400">Política</span>
          </h1>
          <p className="text-white/70 text-base leading-relaxed">
            Descubre las propuestas de los candidatos y encuentra qué candidato
            comparte tu visión para Colombia.
          </p>

          {/* Candidate preview */}
          <div className="flex justify-center gap-4">
            {CANDIDATES.map((c) => (
              <div key={c.id} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white/30 shadow-lg">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover object-top"
                  />
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

          <p className="text-white/40 text-xs">
            Voltea las cartas para descubrir propuestas y empárejalas con sus candidatos
          </p>
        </div>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────
  if (phase === 'result') {
    return (
      <div className="min-h-screen game-bg flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl mb-2">🏆</div>
          <h2 className="text-3xl font-black text-white">
            ¡Juego completado!
          </h2>
          <p className="text-white/70">
            Completaste el juego en <span className="text-yellow-400 font-bold">{moves} movimientos</span>
          </p>

          {/* Winner highlight */}
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-5">
            <p className="text-yellow-300 text-sm font-medium mb-3">
              Candidato con más propuestas descubiertas
            </p>
            <div className="flex items-center gap-4 justify-center">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl">
                <img
                  src={topCandidate.image}
                  alt={topCandidate.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="text-left">
                <p className="text-white font-black text-lg leading-tight">
                  {topCandidate.name}
                </p>
                <p className="text-yellow-400 text-sm font-bold">
                  {scores[topCandidate.id] ?? 0} propuestas
                </p>
              </div>
            </div>
          </div>

          {/* All scores */}
          <div className="space-y-3">
            {[...CANDIDATES]
              .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
              .map((c, i) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 bg-white/10 rounded-xl p-3"
                >
                  <span className="text-white/40 font-bold w-4 text-sm">
                    {i + 1}
                  </span>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span className="flex-1 text-white text-sm font-medium text-left">
                    {c.name}
                  </span>
                  <span className="text-yellow-400 font-black">
                    {scores[c.id] ?? 0}
                  </span>
                </div>
              ))}
          </div>

          <button
            onClick={startGame}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-lg py-4 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Jugar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // ── PLAYING ───────────────────────────────────────────────
  return (
    <div className="min-h-screen game-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div>
          <h1 className="text-white font-black text-lg leading-none">
            Memoria Política
          </h1>
          <p className="text-white/50 text-xs mt-0.5">Elecciones 2026</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-yellow-400 font-black text-xl leading-none">{moves}</p>
            <p className="text-white/50 text-xs">movimientos</p>
          </div>
          <button
            onClick={startGame}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all"
            aria-label="Reiniciar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 gap-4 p-4 max-w-6xl mx-auto w-full">
        {/* Grid */}
        <main className="flex-1 flex items-start justify-center">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {deck.map((card) => {
              const category = getCategoryForCard(card);
              const candidate = getCandidateForCard(card);
              return (
                <MemoryCard
                  key={card.id}
                  category={category}
                  candidate={candidate}
                  isFlipped={flipped.includes(card.id)}
                  isMatched={matched.includes(card.id)}
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
            <p className="text-white/60 text-xs uppercase tracking-wide font-medium mb-3">
              Categorías
            </p>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <div key={cat.key} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-lg ${cat.color} flex items-center justify-center`}
                  />
                  <span className="text-white/80 text-sm">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <p className="text-white/50 text-xs leading-relaxed">
              Voltea las cartas de la misma categoría para descubrir las propuestas de cada candidato.
            </p>
          </div>
        </aside>
      </div>

      {/* Match flash */}
      {lastMatchId !== null && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 font-black px-6 py-3 rounded-full shadow-xl animate-bounce text-sm">
          ¡Par encontrado!
        </div>
      )}
    </div>
  );
}
