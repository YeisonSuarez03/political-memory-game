import { Zap } from 'lucide-react';
import { CANDIDATES } from '../gameData';

interface ScoreBoardProps {
  scores: Record<number, number>;
}

export default function ScoreBoard({ scores }: ScoreBoardProps) {
  const sorted = [...CANDIDATES].sort(
    (a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0)
  );

  return (
    <div className="comic-panel bg-comic-black p-4" style={{ borderRadius: 4 }}>
      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-comic-yellow" />
        <span className="font-bangers text-comic-yellow text-lg tracking-widest uppercase">
          Tu marcador
        </span>
      </div>

      <div className="space-y-3">
        {sorted.map((c, rank) => {
          const count = scores[c.id] ?? 0;
          const isLeading = rank === 0 && count > 0;
          const hex = c.hex;
          return (
            <div
              key={c.id}
              className="flex items-center gap-3 p-2 border-2"
              style={{
                borderRadius: 3,
                borderColor: isLeading ? hex : 'rgba(255,255,255,0.1)',
                backgroundColor: isLeading ? `${hex}33` : 'transparent',
              }}
            >
              <div
                className="w-10 h-10 overflow-hidden shrink-0"
                style={{ border: `3px solid ${isLeading ? hex : '#444'}`, borderRadius: 3 }}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-oswald text-white text-xs font-bold truncate uppercase tracking-wide">{c.name}</p>
                {/* Progress bar */}
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2 flex-1 transition-all duration-300"
                      style={{
                        borderRadius: 1,
                        backgroundColor: i < count ? hex : 'rgba(255,255,255,0.15)',
                      }}
                    />
                  ))}
                </div>
              </div>
              <span
                className="font-bangers text-2xl leading-none tabular-nums tracking-wider"
                style={{ color: count > 0 ? hex : 'rgba(255,255,255,0.4)' }}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

