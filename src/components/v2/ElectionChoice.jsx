import { useState } from 'react';
import CandidatePortrait from '../CandidatePortrait.jsx';
import { getEraData } from '../../data/eraData.js';
import GameStatusBar from './GameStatusBar.jsx';

export default function ElectionChoice({ state, onSubmit }) {
  const [selected, setSelected] = useState(null);
  const { round, roundCandidates, advisor, momentum, tycoonThreat, winsCount, milestonePoints, rejection } = state;
  const { dem, rep, office } = roundCandidates;
  const { ADVISORS, getAdvisorRecommendation, antagonistName } = getEraData(state.era);
  const advisorData = ADVISORS[advisor];
  const recommendation = getAdvisorRecommendation(advisor, round, dem, rep);

  // Track which choices have been rejected this round
  const demRejected = rejection?.choice === 'fuse_dem';
  const repRejected = rejection?.choice === 'fuse_rep';

  // Don't show advisor pick badge when the choice is ambiguous (gap < 0.15)
  const friendlinessGap = Math.abs(dem.friendliness - rep.friendliness);
  const showPickBadge = friendlinessGap >= 0.15 && recommendation.recommended !== 'alone';

  const choices = [
    {
      key: 'fuse_dem',
      label: `Fuse with ${dem.name}`,
      subtitle: `Cross-endorse the Democrat for ${office}`,
      hint: recommendation.fuseDemLine,
      isRecommended: showPickBadge && recommendation.recommended === 'fuse_dem',
      disabled: (dem.boughtByBlackwood || dem.boughtByAntagonist) || demRejected,
      disabledNote: demRejected
        ? 'Declined your endorsement'
        : (dem.boughtByBlackwood || dem.boughtByAntagonist) ? `Bought by ${antagonistName} — fusion impossible` : null,
    },
    {
      key: 'fuse_rep',
      label: `Fuse with ${rep.name}`,
      subtitle: `Cross-endorse the Republican for ${office}`,
      hint: recommendation.fuseRepLine,
      isRecommended: showPickBadge && recommendation.recommended === 'fuse_rep',
      disabled: (rep.boughtByBlackwood || rep.boughtByAntagonist) || repRejected,
      disabledNote: repRejected
        ? 'Declined your endorsement'
        : (rep.boughtByBlackwood || rep.boughtByAntagonist) ? `Bought by ${antagonistName} — fusion impossible` : null,
    },
    {
      key: 'alone',
      label: 'Run Alone',
      subtitle: 'Three-way race — your candidate, your banner',
      hint: recommendation.aloneLine,
      isRecommended: recommendation.recommended === 'alone',
    },
  ];

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <GameStatusBar round={round} momentum={momentum} tycoonThreat={tycoonThreat} winsCount={winsCount} milestonePoints={milestonePoints} />

      {/* Header */}
      <div className="text-center mb-4 mt-2">
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase">
          Election {round} &bull; Your Strategy
        </div>
        <h1 className="font-display text-xl font-bold text-walnut mt-1">
          How Will You Run?
        </h1>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      {/* Rejection banner */}
      {rejection && (
        <div className="card-gilded p-3 mb-4 max-w-md mx-auto w-full border-l-4 border-darkred">
          <div className="font-ticker text-xs text-darkred uppercase tracking-wider mb-1">
            Endorsement Rejected
          </div>
          <div className="font-body text-sm text-walnut italic">
            {rejection.message}
          </div>
          <div className="font-body text-xs text-walnut-light mt-1">
            Choose another strategy.
          </div>
        </div>
      )}

      {/* Fusion teaching moments — different lessons each round */}
      {!rejection && (
        <FusionExplainer round={round} winsCount={state.winsCount} era={state.era} />
      )}

      {/* Advisor recommendation */}
      <div className="card-gilded p-3 mb-5 max-w-md mx-auto w-full">
        <div className="flex items-start gap-2">
          <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border border-brass/30">
            <CandidatePortrait id={advisor} traits={advisorData.portraitTraits} size={40} era={state.era} />
          </div>
          <div className="flex-1">
            <div className="font-ticker text-xs text-brass-dark">
              {advisorData.firstName} {friendlinessGap < 0.15 && recommendation.recommended !== 'alone' ? 'says:' : 'recommends:'}
            </div>
            <div className="font-body text-sm text-walnut mt-1 italic">
              &ldquo;{recommendation.line}&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* Choice buttons */}
      <div className="flex flex-col gap-3 max-w-md mx-auto w-full mb-6">
        {choices.map(choice => (
          <button
            key={choice.key}
            onClick={() => !choice.disabled && setSelected(choice.key)}
            disabled={choice.disabled}
            className={`btn-option relative ${selected === choice.key ? 'selected' : ''} ${choice.disabled ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-walnut text-sm">{choice.label}</span>
                  {choice.isRecommended && (
                    <span className="font-ticker text-xs text-brass bg-brass/10 px-1.5 py-0.5 rounded">
                      {advisorData.firstName}&apos;s pick
                    </span>
                  )}
                </div>
                <div className="font-body text-xs text-walnut-light/70 mt-0.5">
                  {choice.subtitle}
                </div>
                <div className="font-body text-xs text-walnut-light/50 mt-1 italic">
                  {choice.hint}
                </div>
              </div>
            </div>
            {choice.disabledNote && (
              <div className="stamp-banned text-xs">{choice.disabledNote}</div>
            )}
          </button>
        ))}
      </div>

      {/* Confirm button */}
      {selected && (
        <div className="max-w-md mx-auto w-full">
          <button
            onClick={() => onSubmit(selected)}
            className="btn-brass w-full text-base py-3"
          >
            Confirm: {choices.find(c => c.key === selected)?.label}
          </button>
        </div>
      )}
    </div>
  );
}

function FusionExplainer({ round, winsCount, era }) {
  const isModern = era === 'modern';
  const lessons = {
    1: {
      title: 'How Fusion Works',
      body: (
        <>
          <p className="font-body text-xs text-walnut leading-relaxed">
            Your party has 3&ndash;5% of voters. Not enough to win alone &mdash; but
            enough to tip a tight race. <strong>Cross-endorse</strong> a major-party
            candidate: your voters cast ballots on <em>your</em> party line, and those
            votes count toward the shared candidate&apos;s total.
          </p>
          <p className="font-body text-xs text-walnut-light leading-relaxed mt-1">
            Win together, and you&apos;ve earned leverage &mdash; because they
            know they couldn&apos;t have won without you.
          </p>
        </>
      ),
    },
    2: {
      title: 'Why Fusion Matters',
      body: (
        <p className="font-body text-xs text-walnut leading-relaxed">
          Without fusion, your voters face the &ldquo;spoiler dilemma&rdquo; &mdash;
          vote their conscience and split the progressive vote, or hold their nose
          and vote for the lesser evil. Fusion solves this: voters cast ballots on
          <em> your</em> line, their votes still count, and your party gets credit
          for every vote that tips the balance.
        </p>
      ),
    },
    3: {
      title: 'Fusion Under Pressure',
      body: isModern ? (
        <p className="font-body text-xs text-walnut leading-relaxed">
          Vex is fighting back. The power brokers <em>hate</em> fusion because it
          gives small parties real leverage. They&apos;ll fund opposition research,
          buy off your allies, and lobby to repeal fusion before you can prove it works.
          Your job: win enough to make fusion undeniable before they kill it.
        </p>
      ) : (
        <p className="font-body text-xs text-walnut leading-relaxed">
          Blackwood is fighting back. The tycoons <em>hate</em> fusion because it
          gives small parties real power. Historically, this is exactly what happened &mdash;
          railroad interests pushed anti-fusion laws in state after state to kill
          third parties. Your job: win enough to prove fusion works before they ban it.
        </p>
      ),
    },
    4: {
      title: 'The Kingmaker\'s Leverage',
      body: (
        <p className="font-body text-xs text-walnut leading-relaxed">
          Every fusion win proves the same point: <strong>your voters decided the
          election</strong>. The winning candidate knows it. That&apos;s leverage.
          That&apos;s how a 5% party gets committee seats, ballot access, and
          legislation. Not by winning outright &mdash; by being the margin of victory.
        </p>
      ),
    },
    5: {
      title: 'The Final Test',
      body: isModern ? (
        <p className="font-body text-xs text-walnut leading-relaxed">
          This is what the anti-fusion forces fear most: a small party that
          can&apos;t be ignored. Historically, they succeeded &mdash; by 1907,
          most states had banned fusion voting. Third parties withered. The two-party
          monopoly locked in. Now fusion is legal again in your state.
          <strong> Can you prove it works before they repeal it?</strong>
        </p>
      ) : (
        <p className="font-body text-xs text-walnut leading-relaxed">
          This is what the anti-fusion forces feared most: a small party that
          couldn&apos;t be ignored. In real history, they succeeded &mdash; by 1907,
          most states had banned fusion voting. Third parties withered. The two-party
          monopoly locked in. <strong>Can you change the ending?</strong>
        </p>
      ),
    },
  };

  const lesson = lessons[round];
  if (!lesson) return null;

  return (
    <div className="card-gilded p-3 mb-4 max-w-md mx-auto w-full border-l-4 border-forest/50">
      <div className="font-ticker text-xs text-forest uppercase tracking-wider mb-1">
        {lesson.title}
      </div>
      {lesson.body}
    </div>
  );
}
