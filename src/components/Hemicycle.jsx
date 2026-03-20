import { useEffect, useState } from 'react';
import { NPC_PARTIES } from '../engine/parties.js';

const PARTY_COLORS = {
  republican: NPC_PARTIES.republican.color,
  democrat: NPC_PARTIES.democrat.color,
  player: '#B8860B',
  agrarian: NPC_PARTIES.agrarian.color,
  traditionalist: NPC_PARTIES.traditionalist.color,
};

export default function Hemicycle({ seatResults, animate = true }) {
  const [revealedSeats, setRevealedSeats] = useState(animate ? 0 : 100);

  useEffect(() => {
    if (!animate) return;
    const total = seatResults
      ? seatResults.republican + seatResults.democrat + seatResults.player + seatResults.agrarian + seatResults.traditionalist
      : 100;

    let count = 0;
    const interval = setInterval(() => {
      count += 2;
      setRevealedSeats(count);
      if (count >= total) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [seatResults, animate]);

  if (!seatResults) return null;

  // Generate seat positions in a hemicycle
  const seats = [];
  const partyOrder = [
    { key: 'traditionalist', count: seatResults.traditionalist },
    { key: 'republican', count: seatResults.republican },
    { key: 'democrat', count: seatResults.democrat },
    { key: 'player', count: seatResults.player },
    { key: 'agrarian', count: seatResults.agrarian },
  ];

  let seatIndex = 0;
  for (const party of partyOrder) {
    for (let i = 0; i < party.count; i++) {
      seats.push({ party: party.key, index: seatIndex });
      seatIndex++;
    }
  }

  const totalSeats = seats.length;
  const rows = 5;
  const cx = 200;
  const cy = 190;

  let globalIndex = 0;
  const seatElements = [];

  for (let row = 0; row < rows; row++) {
    const radius = 80 + row * 25;
    const seatsInRow = Math.round(totalSeats / rows) + (row < totalSeats % rows ? 1 : 0);
    const actualSeats = Math.min(seatsInRow, totalSeats - globalIndex);

    for (let s = 0; s < actualSeats; s++) {
      if (globalIndex >= totalSeats) break;
      const seat = seats[globalIndex];
      const angle = Math.PI * (0.05 + (s / (actualSeats - 1 || 1)) * 0.9);
      const x = cx - radius * Math.cos(angle);
      const y = cy - radius * Math.sin(angle);

      seatElements.push(
        <circle
          key={globalIndex}
          cx={x}
          cy={y}
          r={4.5}
          fill={globalIndex < revealedSeats ? PARTY_COLORS[seat.party] : '#E8E0D0'}
          className={globalIndex < revealedSeats && animate ? 'seat-reveal' : ''}
          style={animate ? { animationDelay: `${globalIndex * 20}ms` } : {}}
          opacity={globalIndex < revealedSeats ? 1 : 0.3}
        />
      );
      globalIndex++;
    }
  }

  const partyLabels = {
    player: 'You',
    republican: 'Rep.',
    democrat: 'Dem.',
    agrarian: 'Agrar.',
    traditionalist: 'Trad.',
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <svg viewBox="0 0 400 210" className="w-full">
        {/* Hemicycle outline */}
        <path
          d="M 30 190 A 170 170 0 0 1 370 190"
          fill="none"
          stroke="rgba(44,24,16,0.1)"
          strokeWidth="1"
        />
        {seatElements}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {partyOrder.map(p => (
          <div key={p.key} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: PARTY_COLORS[p.key] }}
            />
            <span className="text-xs font-body text-walnut-light">
              {partyLabels[p.key]} ({p.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
