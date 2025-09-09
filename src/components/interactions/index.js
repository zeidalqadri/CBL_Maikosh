/**
 * Interactive Components for Visual-First Basketball Coaching Content
 * 
 * This module exports animated and interactive components that transform
 * text-heavy coaching content into engaging visual presentations.
 */

// Core interactive components
export { default as AnimatedPlayDiagram } from './AnimatedPlayDiagram';
export { 
  default as CoachsCornerTip,
  ProTip,
  CommonMistake,
  DrillSpotlight,
  CoachingQuote
} from './CoachsCornerTip';
export { 
  default as InteractiveAccordion,
  CoachingAccordion,
  FundamentalsAccordion,
  DrillsAccordion
} from './InteractiveAccordion';
export { 
  default as SkillLevelTabs,
  CoachingLevelTabs,
  PlayerDevelopmentTabs
} from './SkillLevelTabs';

/**
 * Usage Examples:
 * 
 * import { 
 *   AnimatedPlayDiagram, 
 *   ProTip, 
 *   CoachingAccordion,
 *   CoachingLevelTabs 
 * } from '@/components/interactions';
 * 
 * // Animated play diagram
 * <AnimatedPlayDiagram playData={pickAndRollPlay} width={600} height={400} />
 * 
 * // Coach's corner tip
 * <ProTip coach="Coach Johnson">
 *   Remember to always emphasize fundamentals over flashy moves.
 * </ProTip>
 * 
 * // Interactive accordion
 * <CoachingAccordion 
 *   items={conceptsList}
 *   theme="coaching"
 *   multipleOpen={false}
 * />
 * 
 * // Skill level tabs
 * <CoachingLevelTabs levels={skillLevels} showProgressionPath={true} />
 */