// Portrait component — uses AI-generated images when available,
// falls back to composable SVG portraits

import { HISTORICAL_PORTRAITS, MODERN_PORTRAITS } from '../data/portraits.js';

const STROKE = '#3D2B1F';
const SKIN = '#E8D5B5';
const BG = '#F5F0E8';
const COLLAR_WHITE = '#F0EBE0';
const COLLAR_DARK = '#4A3728';

export default function CandidatePortrait({ candidateId, id, traits: traitsProp, size = 48, era = 'historical' }) {
  // Check for AI-generated portrait image — try id prop first, then candidateId
  const portraits = era === 'modern' ? MODERN_PORTRAITS : HISTORICAL_PORTRAITS;
  const lookupId = id || candidateId;
  const imageUrl = lookupId ? portraits[lookupId] : null;

  if (imageUrl) {
    return (
      <div
        className="flex-shrink-0 rounded-full overflow-hidden"
        style={{ width: size, height: size }}
      >
        <img
          src={imageUrl}
          alt={candidateId}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback: SVG portrait from traits
  let traits = candidateId ? TRAITS[candidateId] : null;
  if (!traits && traitsProp) {
    traits = {
      face: traitsProp.faceShape || traitsProp.face || 'oval',
      hair: traitsProp.hairStyle || traitsProp.hair || 'short',
      hairColor: traitsProp.hairColor || '#3D2B1F',
      facialHair: traitsProp.facialHair || 'none',
      hat: traitsProp.hat || 'none',
      collar: traitsProp.collar || 'standard',
      female: traitsProp.female || false,
      glasses: traitsProp.glasses || false,
    };
  }
  if (!traits) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className="flex-shrink-0">
        <circle cx="32" cy="32" r="30" fill={BG} stroke={STROKE} strokeWidth="2" />
        <text x="32" y="38" textAnchor="middle" fill={STROKE} fontSize="20">?</text>
      </svg>
    );
  }

  const clipId = `portrait-${candidateId || (traits.face + traits.hair + traits.collar).replace(/\s/g, '')}`;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="flex-shrink-0" role="img" aria-label={candidateId}>
      <defs>
        <clipPath id={clipId}>
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <circle cx="32" cy="32" r="30" fill={BG} />
        <g opacity="0.06" stroke={STROKE} strokeWidth="0.5">
          {[16, 22, 28, 34, 40, 46, 52].map(y => (
            <line key={y} x1="2" y1={y} x2="62" y2={y - 4} />
          ))}
        </g>
        {renderCollar(traits.collar)}
        <rect x="28" y="46" width="8" height="10" fill={SKIN} stroke={STROKE} strokeWidth="1" />
        {renderHairBack(traits)}
        {renderFace(traits.face)}
        {!traits.female && (
          <>
            <ellipse cx="20" cy="35" rx="2.5" ry="3.5" fill={SKIN} stroke={STROKE} strokeWidth="1" />
            <ellipse cx="44" cy="35" rx="2.5" ry="3.5" fill={SKIN} stroke={STROKE} strokeWidth="1" />
          </>
        )}
        {renderEyes(traits)}
        <path d="M32,33 L30,38 L34,38" fill="none" stroke={STROKE} strokeWidth="1" strokeLinecap="round" />
        <path d={traits.female ? 'M29,41 Q32,43 35,41' : 'M29,42 L35,42'} fill="none" stroke={STROKE} strokeWidth="1" strokeLinecap="round" />
        {renderFacialHair(traits.facialHair, traits.hairColor)}
        {renderHairFront(traits)}
        {renderHat(traits.hat, traits.hairColor)}
        {traits.glasses && renderGlasses()}
      </g>
      <circle cx="32" cy="32" r="30" fill="none" stroke={STROKE} strokeWidth="2" />
    </svg>
  );
}

// v1 trait lookup table (kept for backward compat)
const TRAITS = {
  sullivan:    { face: 'round',   hair: 'short',    hairColor: '#3D2B1F',  facialHair: 'mustache',   hat: 'bowler',  collar: 'standard' },
  ocallaghan:  { face: 'oval',    hair: 'updo',     hairColor: '#3D2B1F',  facialHair: 'none',       hat: 'none',    collar: 'high',     female: true },
  mcginty:     { face: 'angular', hair: 'slick',    hairColor: '#3D2B1F',  facialHair: 'sideburns',  hat: 'derby',   collar: 'standard' },
  whitfield:   { face: 'angular', hair: 'parted',   hairColor: '#8B7D6B',  facialHair: 'none',       hat: 'none',    collar: 'high' },
  hargrove:    { face: 'oval',    hair: 'receding',  hairColor: '#8B7D6B',  facialHair: 'mustache',   hat: 'tophat',  collar: 'high' },
  olmstead:    { face: 'round',   hair: 'wavy',     hairColor: '#8B7D6B',  facialHair: 'beard',      hat: 'none',    collar: 'clerical' },
  jennings:    { face: 'angular', hair: 'short',    hairColor: '#6B4C3B', facialHair: 'mustache',   hat: 'none',    collar: 'standard' },
  rawlings:    { face: 'oval',    hair: 'long',     hairColor: '#3D2B1F',  facialHair: 'none',       hat: 'none',    collar: 'high',     female: true },
  oakes:       { face: 'round',   hair: 'short',    hairColor: '#6B4C3B', facialHair: 'sideburns',  hat: 'none',    collar: 'standard' },
  blackwell:   { face: 'angular', hair: 'slick',    hairColor: '#3D2B1F',  facialHair: 'mustache',   hat: 'tophat',  collar: 'high' },
  sterling:    { face: 'oval',    hair: 'parted',   hairColor: '#6B4C3B', facialHair: 'none',       hat: 'none',    collar: 'standard' },
  vandermeer:  { face: 'round',   hair: 'receding',  hairColor: '#6B4C3B', facialHair: 'sideburns',  hat: 'bowler',  collar: 'high' },
  ashford:     { face: 'oval',    hair: 'wavy',     hairColor: '#3D2B1F',  facialHair: 'none',       hat: 'none',    collar: 'standard', glasses: true },
  fletcher:    { face: 'angular', hair: 'short',    hairColor: '#3D2B1F',  facialHair: 'beard',      hat: 'none',    collar: 'standard' },
  beaumont:    { face: 'round',   hair: 'parted',   hairColor: '#8B7D6B',  facialHair: 'mustache',   hat: 'none',    collar: 'high' },
  crane:       { face: 'angular', hair: 'slick',    hairColor: '#8B7D6B',  facialHair: 'sideburns',  hat: 'tophat',  collar: 'high' },
  thornton:    { face: 'oval',    hair: 'updo',     hairColor: '#8B7D6B',  facialHair: 'none',       hat: 'bonnet',  collar: 'high',     female: true },
  griswold:    { face: 'angular', hair: 'short',    hairColor: '#3D2B1F',  facialHair: 'mustache',   hat: 'none',    collar: 'military' },
};

function renderFace(shape) {
  switch (shape) {
    case 'round': return <ellipse cx="32" cy="35" rx="12" ry="13" fill={SKIN} stroke={STROKE} strokeWidth="1.5" />;
    case 'oval': return <ellipse cx="32" cy="35" rx="10" ry="14" fill={SKIN} stroke={STROKE} strokeWidth="1.5" />;
    case 'angular': return <path d="M22,30 Q23,22 32,20 Q41,22 42,30 L41,40 L38,46 L26,46 L23,40 Z" fill={SKIN} stroke={STROKE} strokeWidth="1.5" />;
    default: return <ellipse cx="32" cy="35" rx="11" ry="13" fill={SKIN} stroke={STROKE} strokeWidth="1.5" />;
  }
}

function renderEyes(traits) {
  const eyeY = traits.face === 'angular' ? 31 : 32;
  return (
    <>
      <ellipse cx="27" cy={eyeY} rx="3" ry="2" fill="#FAFAF5" stroke={STROKE} strokeWidth="0.8" />
      <ellipse cx="37" cy={eyeY} rx="3" ry="2" fill="#FAFAF5" stroke={STROKE} strokeWidth="0.8" />
      <circle cx="27.5" cy={eyeY} r="1.2" fill={STROKE} />
      <circle cx="37.5" cy={eyeY} r="1.2" fill={STROKE} />
      <path d={`M24,${eyeY - 4} Q27,${eyeY - 5.5} 30,${eyeY - 4}`} fill="none" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
      <path d={`M34,${eyeY - 4} Q37,${eyeY - 5.5} 40,${eyeY - 4}`} fill="none" stroke={STROKE} strokeWidth="1.2" strokeLinecap="round" />
    </>
  );
}

function renderGlasses() {
  return (
    <g fill="none" stroke={STROKE} strokeWidth="1">
      <circle cx="27" cy="32" r="4.5" />
      <circle cx="37" cy="32" r="4.5" />
      <line x1="31.5" y1="32" x2="32.5" y2="32" />
      <line x1="22.5" y1="32" x2="20" y2="31" />
      <line x1="41.5" y1="32" x2="44" y2="31" />
    </g>
  );
}

function renderHairBack(traits) {
  const c = traits.hairColor;
  switch (traits.hair) {
    case 'long': return <path d="M18,26 Q20,18 32,16 Q44,18 46,26 L48,50 Q46,56 40,56 L24,56 Q18,56 16,50 Z" fill={c} stroke={STROKE} strokeWidth="1" />;
    case 'updo': return <path d="M20,28 Q22,14 32,10 Q42,14 44,28 L44,32 L20,32 Z" fill={c} stroke={STROKE} strokeWidth="1" />;
    default: return null;
  }
}

function renderHairFront(traits) {
  const c = traits.hairColor;
  switch (traits.hair) {
    case 'short': return <path d="M20,30 Q20,20 28,18 Q32,17 36,18 Q44,20 44,30" fill={c} stroke={STROKE} strokeWidth="1" />;
    case 'parted': return <g><path d="M20,30 Q20,20 28,18 L32,17 Q32,20 30,22 L20,30" fill={c} stroke={STROKE} strokeWidth="1" /><path d="M32,17 Q36,18 44,20 Q44,26 44,30 L36,22 Q34,20 32,17" fill={c} stroke={STROKE} strokeWidth="1" /></g>;
    case 'slick': return <path d="M20,30 Q20,22 26,19 Q32,16 38,19 Q44,22 44,30 Q42,24 32,22 Q22,24 20,30" fill={c} stroke={STROKE} strokeWidth="1" />;
    case 'wavy': return <path d="M18,32 Q18,18 32,15 Q46,18 46,32 Q44,24 40,20 Q36,22 32,19 Q28,22 24,20 Q20,24 18,32" fill={c} stroke={STROKE} strokeWidth="1" />;
    case 'receding': return <g><path d="M24,26 Q24,20 32,18 Q40,20 40,26" fill={c} stroke={STROKE} strokeWidth="1" /><path d="M22,30 Q22,26 24,26 M40,26 Q42,26 42,30" fill="none" stroke={c} strokeWidth="1.5" /></g>;
    case 'updo': return <path d="M22,28 Q24,22 32,20 Q40,22 42,28" fill={c} stroke={STROKE} strokeWidth="1" />;
    case 'long': return <path d="M20,28 Q22,20 32,18 Q42,20 44,28" fill={c} stroke={STROKE} strokeWidth="1" />;
    default: return null;
  }
}

function renderFacialHair(type, color) {
  switch (type) {
    case 'mustache': return <path d="M26,39 Q28,41 32,40 Q36,41 38,39" fill={color} stroke={STROKE} strokeWidth="0.8" />;
    case 'beard': return <g><path d="M26,39 Q28,41 32,40 Q36,41 38,39" fill={color} stroke={STROKE} strokeWidth="0.8" /><path d="M24,42 L24,46 Q28,52 32,52 Q36,52 40,46 L40,42" fill={color} stroke={STROKE} strokeWidth="1" /><g stroke={STROKE} strokeWidth="0.4" opacity="0.5"><line x1="28" y1="44" x2="28" y2="49" /><line x1="32" y1="43" x2="32" y2="51" /><line x1="36" y1="44" x2="36" y2="49" /></g></g>;
    case 'sideburns': return <g fill={color} stroke={STROKE} strokeWidth="0.8"><path d="M20,30 L20,42 Q22,43 23,40 L23,30 Z" /><path d="M44,30 L44,42 Q42,43 41,40 L41,30 Z" /></g>;
    default: return null;
  }
}

function renderHat(type) {
  switch (type) {
    case 'bowler': return <g><path d="M22,22 Q22,10 32,8 Q42,10 42,22" fill={STROKE} /><ellipse cx="32" cy="22" rx="16" ry="3" fill={STROKE} /><rect x="23" y="18" width="18" height="2" fill="#6B4C3B" rx="0.5" /></g>;
    case 'derby': return <g><path d="M23,22 Q23,12 32,10 Q41,12 41,22" fill={STROKE} /><ellipse cx="32" cy="22" rx="17" ry="3.5" fill={STROKE} /><rect x="24" y="18" width="16" height="2" fill="#8B6340" rx="0.5" /></g>;
    case 'tophat': return <g><rect x="24" y="4" width="16" height="18" rx="2" fill={STROKE} /><ellipse cx="32" cy="22" rx="18" ry="3" fill={STROKE} /><rect x="25" y="18" width="14" height="2" fill="#6B4C3B" rx="0.5" /><ellipse cx="32" cy="4" rx="8" ry="2" fill="#4A3728" stroke={STROKE} strokeWidth="1" /></g>;
    case 'bonnet': return <g><path d="M18,26 Q16,14 32,8 Q48,14 46,26" fill={COLLAR_WHITE} stroke={STROKE} strokeWidth="1" /><path d="M16,26 Q16,22 20,22 Q24,24 32,24 Q40,24 44,22 Q48,22 48,26" fill={COLLAR_WHITE} stroke={STROKE} strokeWidth="1" /><path d="M18,26 Q16,34 14,40" fill="none" stroke={STROKE} strokeWidth="1" /><path d="M46,26 Q48,34 50,40" fill="none" stroke={STROKE} strokeWidth="1" /><circle cx="32" cy="12" r="1.5" fill={STROKE} /></g>;
    default: return null;
  }
}

function renderCollar(type) {
  switch (type) {
    case 'high': return <g><path d="M10,64 L10,48 Q18,42 28,44 L28,48 L22,64" fill={COLLAR_DARK} stroke={STROKE} strokeWidth="1" /><path d="M54,64 L54,48 Q46,42 36,44 L36,48 L42,64" fill={COLLAR_DARK} stroke={STROKE} strokeWidth="1" /><path d="M26,44 L26,40 Q32,38 38,40 L38,44" fill={COLLAR_WHITE} stroke={STROKE} strokeWidth="0.8" /></g>;
    case 'clerical': return <g><path d="M10,64 L10,48 Q20,42 32,44 Q44,42 54,48 L54,64" fill={COLLAR_DARK} stroke={STROKE} strokeWidth="1" /><rect x="28" y="44" width="8" height="3" rx="1" fill={COLLAR_WHITE} stroke={STROKE} strokeWidth="0.8" /></g>;
    case 'military': return <g><path d="M10,64 L10,48 Q20,42 32,44 Q44,42 54,48 L54,64" fill={COLLAR_DARK} stroke={STROKE} strokeWidth="1" /><path d="M26,44 L26,40 L38,40 L38,44" fill={COLLAR_DARK} stroke={STROKE} strokeWidth="0.8" /><circle cx="32" cy="50" r="1.5" fill="#B8860B" stroke={STROKE} strokeWidth="0.5" /><circle cx="32" cy="55" r="1.5" fill="#B8860B" stroke={STROKE} strokeWidth="0.5" /><circle cx="32" cy="60" r="1.5" fill="#B8860B" stroke={STROKE} strokeWidth="0.5" /></g>;
    default: return <g><path d="M10,64 L10,50 Q16,44 28,46 L28,52 L22,64" fill={COLLAR_DARK} stroke={STROKE} strokeWidth="1" /><path d="M54,64 L54,50 Q48,44 36,46 L36,52 L42,64" fill={COLLAR_DARK} stroke={STROKE} strokeWidth="1" /><path d="M28,46 L30,50 L32,46" fill={COLLAR_WHITE} stroke={STROKE} strokeWidth="0.8" /><path d="M36,46 L34,50 L32,46" fill={COLLAR_WHITE} stroke={STROKE} strokeWidth="0.8" /></g>;
  }
}
