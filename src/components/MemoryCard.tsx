import { Heart, TrendingUp, Shield, BookOpen, Leaf, HelpCircle } from 'lucide-react';
import type { Category, Candidate } from '../gameData';

const ICON_MAP: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-8 h-8" />,
  TrendingUp: <TrendingUp className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  BookOpen: <BookOpen className="w-8 h-8" />,
  Leaf: <Leaf className="w-8 h-8" />,
};

const ICON_MAP_MINIFIED: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-3 h-3" />,
  TrendingUp: <TrendingUp className="w-3 h-3" />,
  Shield: <Shield className="w-3 h-3" />,
  BookOpen: <BookOpen className="w-3 h-3" />,
  Leaf: <Leaf className="w-3 h-3" />,
};

interface MemoryCardProps {
  category: Category;
  candidate: Candidate;
  isFlipped: boolean;
  onClick: () => void;
}

export default function MemoryCard({ category, candidate, isFlipped, onClick }: MemoryCardProps) {
  return (
    <div
      className="card-container cursor-pointer select-none"
      onClick={onClick}
      role="button"
      aria-label={`Carta de ${category.label}`}
    >
      <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* PROPOSAL face */}
        <div className="card-face card-front">
          <div
            className="absolute inset-0 flex flex-col overflow-hidden"
            style={{
              borderRadius: 6,
              border: '3px solid #111111',
              boxShadow: '4px 4px 0 #111111',
              background: '#FFF9E6',
            }}
          >
            {/* Top colour band */}
            <div className={`${category.color} flex items-center justify-between px-2 py-1.5 shrink-0`}>
              <div className="text-white">
                {ICON_MAP[category.icon] ?? <HelpCircle className="w-8 h-8" />}
              </div>
              <span
                className="font-bangers text-white text-lg leading-none tracking-wide text-stroke-sm"
                style={{ WebkitTextStroke: '1px #11111166' }}
              >
                {category.label}
              </span>
            </div>

            {/* Proposal text */}
            <div className="flex-1 p-2 flex items-center justify-center overflow-hidden">
              <p className="font-oswald text-comic-black text-lg leading-snug text-center line-clamp-5">
                {candidate.proposals[category.key]}
              </p>
            </div>

            {/* Bottom hidden hint */}
            <div className="bg-comic-black/10 border-t-2 border-comic-black/20 px-2 py-1 text-center shrink-0">
              <span className="font-bangers text-comic-black/40 text-xs tracking-wider uppercase">¿Quién lo propone?</span>
            </div>
          </div>
        </div>

        {/* CANDIDATE face */}
        <div className="card-face card-back-proposal">
          <div
            className="absolute inset-0 overflow-hidden bg-comic-black"
            style={{
              borderRadius: 6,
              border: '3px solid #111111',
              boxShadow: '4px 4px 0 #111111',
            }}
          >
            <img
              src={candidate.image}
              alt={candidate.name}
              className="w-full h-full object-cover object-top"
            />
            {/* Name banner */}
            <div
              className={`absolute bottom-0 left-0 right-0 ${candidate.color} px-2 py-2`}
              style={{ borderTop: '3px solid #111111' }}
            >
              <p
                className="font-bangers text-center text-sm leading-tight tracking-wide drop-shadow text-stroke-sm"
                style={{
                  color: candidate.hex === '#F5C800' ? '#111111' : '#ffffff',
                  WebkitTextStroke: candidate.hex === '#F5C800' ? '1px rgba(0,0,0,0.2)' : '1px #11111188',
                }}
              >
                {candidate.name}
              </p>
            </div>
            {/* Category dot */}
            <div
              className={`absolute top-1.5 right-1.5 w-5 h-5 ${category.color} flex items-center justify-center text-white`}
              style={{ border: '2px solid #111111', borderRadius: 3 }}
            >
              <div className="text-white">
                {ICON_MAP_MINIFIED[category.icon] ?? <HelpCircle className="w-3 h-3" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

