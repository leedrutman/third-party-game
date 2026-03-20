import { getEraData } from '../../data/eraData.js';
import CandidatePortrait from '../CandidatePortrait.jsx';

export default function AdvisorSelection({ onSelect, era = 'historical' }) {
  const { ADVISORS } = getEraData(era);
  const ADVISOR_LIST = Object.values(ADVISORS);
  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase">
          Strategic Counsel
        </div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">
          Hire Your Advisor
        </h1>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
        <p className="font-body text-sm text-walnut-light mt-2 max-w-md mx-auto">
          Every campaign needs a strategist. Each advisor sees the board
          differently &mdash; choose the one whose instincts match yours.
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
        {ADVISOR_LIST.map(advisor => (
          <button
            key={advisor.id}
            onClick={() => onSelect(advisor.id)}
            className="btn-option text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 flex-shrink-0 rounded-full overflow-hidden border-2 border-walnut/20">
                <CandidatePortrait id={advisor.id} traits={advisor.portraitTraits} size={56} era={era} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-walnut">
                  {advisor.name}
                </div>
                <div className="font-ticker text-xs text-brass-dark mt-0.5">
                  {advisor.title}
                </div>
                <div className="font-body text-xs text-walnut-light/70 mt-1.5">
                  {advisor.description}
                </div>
                <div className="font-body text-xs text-walnut-light/50 mt-1 italic">
                  &ldquo;{advisor.catchphrase}&rdquo; &mdash; {advisor.hint}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
