import { Trophy } from 'lucide-react';
import { CANDIDATES } from '../gameData';

interface ScoreBoardProps {
  scores: Record<number, number>;
}

export default function ScoreBoard({ scores }: ScoreBoardProps) {
  const sorted = [...CANDIDATES].sort(
    (a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0)
  );

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <span className="text-white font-bold text-sm uppercase tracking-wide">
          Propuestas encontradas
        </span>
      </div>
      <div className="space-y-2">
        {sorted.map((c) => (
          <div key={c.id} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{c.name}</p>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      i < (scores[c.id] ?? 0) ? 'bg-yellow-400' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-yellow-400 font-bold text-sm">
              {scores[c.id] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
