import { Heart, TrendingUp, Shield, Users, Leaf, HelpCircle } from 'lucide-react';
import type { Category, Candidate } from '../gameData';

const ICON_MAP: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-10 h-10" />,
  TrendingUp: <TrendingUp className="w-10 h-10" />,
  Shield: <Shield className="w-10 h-10" />,
  Users: <Users className="w-10 h-10" />,
  Leaf: <Leaf className="w-10 h-10" />,
};

interface MemoryCardProps {
  category: Category;
  candidate: Candidate;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export default function MemoryCard({
  category,
  candidate,
  isFlipped,
  isMatched,
  onClick,
}: MemoryCardProps) {
  return (
    <div
      className={`card-container cursor-pointer select-none ${isMatched ? 'matched' : ''}`}
      onClick={onClick}
      role="button"
      aria-label={`Carta de ${category.label}`}
    >
      <div className={`card-inner ${isFlipped || isMatched ? 'flipped' : ''}`}>
        {/* ── FRONT: hidden face (?) ─────────────────────── */}
        <div className="card-face card-front">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border-4 border-slate-600 shadow-inner">
            <div className="flex flex-col items-center gap-2">
              <HelpCircle className="w-12 h-12 text-slate-400" />
              <span className="text-slate-500 text-xs font-medium tracking-widest uppercase">
                ¿?
              </span>
            </div>
          </div>
        </div>

        {/* ── BACK A: proposal face ─────────────────────── */}
        <div className="card-face card-back-proposal">
          <div
            className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-3 border-4 ${category.color} border-opacity-80 shadow-lg`}
            style={{ background: 'white' }}
          >
            {/* colored header strip */}
            <div
              className={`absolute top-0 left-0 right-0 h-2 rounded-t-xl ${category.color}`}
            />
            <div
              className={`mt-2 w-14 h-14 rounded-full ${category.color} flex items-center justify-center text-white shadow-md`}
            >
              {ICON_MAP[category.icon] ?? <HelpCircle className="w-10 h-10" />}
            </div>
            <span
              className={`mt-2 text-sm font-bold uppercase tracking-wide ${category.textColor}`}
            >
              {category.label}
            </span>
            <p className="mt-2 text-center text-gray-700 text-xs leading-snug line-clamp-5 px-1">
              {candidate.proposals[category.key]}
            </p>
          </div>
        </div>
      </div>

      {/* ── CANDIDATE face (shown after match reveal) ── */}
      {isMatched && (
        <div className="card-match-reveal absolute inset-0 rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-xl">
          <img
            src={candidate.image}
            alt={candidate.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
            <p className="text-white text-center font-bold text-xs leading-tight drop-shadow">
              {candidate.name}
            </p>
          </div>
          <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${candidate.color} border border-white`} />
        </div>
      )}
    </div>
  );
}
