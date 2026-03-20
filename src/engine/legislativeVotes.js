import { ISSUES } from '../data/issues.js';

// ========================================
// Flagship Bill Pipeline Engine
// ========================================
// The player's bill progresses through 3 stages:
//   0 → 1: Introduction (find a sponsor)
//   1 → 2: Committee Hearing (push through committee)
//   2 → 3: Floor Vote (pass into law)
//
// Each election gives one chance to advance.
// If you fail, you stay at the current stage.

// Get the flagship bill data for the player's chosen issue
export function getFlagshipBill(issueKey) {
  const issue = ISSUES[issueKey];
  return issue?.flagshipBill || null;
}

// Get the current stage data (name, description, etc.)
export function getCurrentStage(issueKey, stageIndex) {
  const bill = getFlagshipBill(issueKey);
  if (!bill || stageIndex < 0 || stageIndex >= bill.stages.length) return null;
  return bill.stages[stageIndex];
}

// Calculate the outcome of a bill advancement attempt
// choice: 'pressAlly' | 'negotiate' | 'threatenStandalone' | 'goPublic'
// currentStage: 0, 1, or 2 (index into stages array)
export function calculateBillOutcome(choice, allyRelationship, seatsHeld, currentStage, rng) {
  const seatCount = typeof seatsHeld === 'number'
    ? seatsHeld
    : Object.values(seatsHeld).filter(Boolean).length;

  // Leverage: seats give institutional power, relationship gives insider access
  const leverage = seatCount * 15 + allyRelationship * 0.3;

  // Stage-based difficulty: Introduction is achievable, Floor Vote is hard
  let baseChance, leverageMultiplier;
  switch (currentStage) {
    case 0: // Introduction
      baseChance = 0.40;
      leverageMultiplier = 0.008;
      break;
    case 1: // Committee
      baseChance = 0.25;
      leverageMultiplier = 0.006;
      break;
    case 2: // Floor Vote
      baseChance = 0.15;
      leverageMultiplier = 0.005;
      break;
    default:
      baseChance = 0.10;
      leverageMultiplier = 0.003;
  }

  // Choice modifiers
  let choiceBonus = 0;
  let relationshipChange = 0;
  let moraleChange = 0;
  let visibilityChange = 0;
  let betrayalChance = 0;

  switch (choice) {
    case 'pressAlly':
      choiceBonus = 0.10;
      relationshipChange = -10 - (currentStage * 3); // pressing harder at later stages costs more
      moraleChange = 5;
      visibilityChange = 5;
      betrayalChance = 0.05 + currentStage * 0.08; // 5%, 13%, 21%
      break;
    case 'negotiate':
      choiceBonus = 0.0;
      relationshipChange = 3;
      moraleChange = 0;
      visibilityChange = -2;
      betrayalChance = 0.05;
      break;
    case 'threatenStandalone':
      choiceBonus = 0.05;
      relationshipChange = -15;
      moraleChange = 3;
      visibilityChange = 3;
      betrayalChance = 0.08 + currentStage * 0.05;
      break;
    case 'goPublic':
      choiceBonus = -0.05;
      relationshipChange = -25;
      moraleChange = 10;
      visibilityChange = 15;
      betrayalChance = 0; // you've already gone scorched earth
      break;
    default:
      choiceBonus = 0;
  }

  // Final pass chance
  let passChance = baseChance + leverage * leverageMultiplier + choiceBonus;
  passChance = Math.max(0.05, Math.min(0.90, passChance));

  // Roll for advancement
  const roll = rng();
  let advanced = roll < passChance;

  // Check for betrayal
  const betrayal = rng() < betrayalChance;
  if (betrayal) {
    advanced = false;
    moraleChange -= 10;
    visibilityChange += 5; // betrayal generates press coverage
  }

  // Outcome-based morale adjustments
  if (advanced) {
    moraleChange += currentStage === 2 ? 20 : 10; // Floor vote passage is euphoric
  } else if (!betrayal) {
    moraleChange -= 5;
  }

  return {
    advanced,
    betrayal,
    passChance: Math.round(passChance * 100), // for debug/display
    resourceChanges: {
      morale: moraleChange,
      visibility: visibilityChange,
    },
    relationshipChange,
  };
}

