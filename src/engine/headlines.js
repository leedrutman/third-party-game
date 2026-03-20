import { HEADLINE_TEMPLATES } from '../data/headlineTemplates.js';
import { ISSUES } from '../data/issues.js';
import { CANDIDATES } from '../data/candidates.js';
import { isFusionChoice } from './electorate.js';

function fillTemplate(template, vars) {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, value);
  }
  return result;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getCandidateNameForResult(districtId, fusionChoice) {
  const distCandidates = CANDIDATES[districtId];
  if (!distCandidates) return '';
  if (fusionChoice === 'fusionDem') return distCandidates.democrat.name;
  if (fusionChoice === 'fusionRep') return distCandidates.republican.name;
  return '';
}

function getAllyPartyLabel(fusionChoice) {
  if (fusionChoice === 'fusionDem') return 'Democrats';
  if (fusionChoice === 'fusionRep') return 'Republicans';
  return 'the major party';
}

export function generateHeadline(category, gameState, extra = {}) {
  const party = gameState.party;
  if (!party) return pickRandom(HEADLINE_TEMPLATES.ambient);

  const issueKey = typeof party.issues === 'string' ? party.issues : party.issues[0];
  const issueKey2 = typeof party.issues === 'string' ? party.issues : (party.issues[1] || party.issues[0]);
  const vars = {
    PARTY: party.name,
    MASCOT: party.mascot.icon,
    MASCOT_NOUN: party.mascot.noun,
    ISSUE: ISSUES[issueKey]?.name || 'Reform',
    ISSUE2: ISSUES[issueKey2]?.name || 'Reform',
    DISTRICT: extra.district || 'the district',
    X: extra.x ?? Math.floor(Math.random() * 20 + 5),
    Y: extra.y ?? Math.floor(Math.random() * 50 + 30),
    CANDIDATE: extra.candidate || '',
    ALLY: extra.ally || 'the major party',
  };

  // Navigate the template tree
  const parts = category.split('.');
  let templates = HEADLINE_TEMPLATES;
  for (const part of parts) {
    templates = templates?.[part];
  }

  if (!templates || !Array.isArray(templates)) {
    return fillTemplate(pickRandom(HEADLINE_TEMPLATES.ambient), vars);
  }

  return fillTemplate(pickRandom(templates), vars);
}

export function generateAmbientHeadline(gameState) {
  const party = gameState.party;
  const ambIssueKey = typeof party?.issues === 'string' ? party.issues : party?.issues?.[0];
  const ambIssueKey2 = typeof party?.issues === 'string' ? party.issues : (party?.issues?.[1] || party?.issues?.[0]);
  const vars = {
    PARTY: party?.name || 'The Third Party',
    MASCOT: party?.mascot?.icon || '\u{1F3DB}\uFE0F',
    MASCOT_NOUN: party?.mascot?.noun || 'Party',
    ISSUE: ISSUES[ambIssueKey]?.name || 'Reform',
    ISSUE2: ISSUES[ambIssueKey2]?.name || 'Reform',
    DISTRICT: '',
    X: Math.floor(Math.random() * 20 + 5),
    Y: Math.floor(Math.random() * 50 + 30),
    CANDIDATE: '',
    ALLY: '',
  };

  return fillTemplate(pickRandom(HEADLINE_TEMPLATES.ambient), vars);
}

// Generate headlines for a specific game result
export function generateResultHeadlines(act, round, gameState, results) {
  const headlines = [];
  const party = gameState.party;

  if (act === 1 && Number.isInteger(round)) {
    // Act I election results (round = election number 1, 2, or 3)
    for (const [districtId, result] of Object.entries(results)) {
      const distName = result.districtName || districtId;
      const candidateName = getCandidateNameForResult(districtId, result.fusionChoice);
      const allyLabel = getAllyPartyLabel(result.fusionChoice);
      const extra = {
        district: distName,
        x: result.yourPercent || 0,
        candidate: candidateName,
        ally: allyLabel,
      };
      if (result.stoodDown) {
        headlines.push(generateHeadline('act1.election_standDown', gameState, extra));
      } else if (result.fusionWin || isFusionChoice(result.fusionChoice)) {
        headlines.push(generateHeadline('act1.election_fusion', gameState, extra));
      } else {
        headlines.push(generateHeadline('act1.election_alone', gameState, extra));
      }
    }
  } else if (act === 1 && !Number.isInteger(round)) {
    // Act I legislative results (round = 1.5, 2.5, or 3.5)
    const outcome = results.legislativeOutcome;
    const betrayal = results.betrayal;
    if (betrayal) {
      headlines.push(generateHeadline('act1.legislative_betrayal', gameState));
    } else if (outcome === 'full') {
      headlines.push(generateHeadline('act1.legislative_pass', gameState));
    } else if (outcome === 'partial') {
      headlines.push(generateHeadline('act1.legislative_partial', gameState));
    } else {
      headlines.push(generateHeadline('act1.legislative_fail', gameState));
    }
  } else if (act === 2 && round === 1) {
    for (const [districtId, result] of Object.entries(results)) {
      const extra = { district: result.districtName || districtId, x: result.yourPercent || 0 };
      if (result.stoodDown) {
        headlines.push(generateHeadline('act2.r1_standDown', gameState, extra));
      } else {
        headlines.push(generateHeadline('act2.r1_alone', gameState, extra));
      }
    }
  } else if (act === 2 && round === 2) {
    headlines.push(generateHeadline(`act2.r2_${results.choice}`, gameState));
  } else if (act === 2 && round === 3) {
    headlines.push(generateHeadline(`act2.r3_${results.choice}`, gameState));
  } else if (act === 3 && round === 1) {
    const extra = { x: results.playerSeats || 15 };
    headlines.push(generateHeadline('act3.r1', gameState, extra));
  } else if (act === 3 && round === 2) {
    const extra = { x: Math.floor(Math.random() * 10 + 8) };
    headlines.push(generateHeadline(`act3.r2_${results.choice}`, gameState, extra));
  } else if (act === 3 && round === 3) {
    const extra = { x: results.votesFor || 52, y: results.votesAgainst || 48 };
    headlines.push(generateHeadline(`act3.r3_${results.choice}`, gameState, extra));
  }

  // Add an ambient headline sometimes
  if (Math.random() > 0.5) {
    headlines.push(generateAmbientHeadline(gameState));
  }

  return headlines;
}
