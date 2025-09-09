import React from 'react';
import AllouiIconComponent, { InteractiveAllouiIcon, BasketballIcon } from './AllouiIcon';

/**
 * Alloui Iconography System
 * Basketball-themed icons replacing emoticons and generic icons
 * 
 * Usage:
 * import { AllouiIcon, BasketballIcon } from '@/components/icons';
 * 
 * <AllouiIcon name="basketball" size="md" variant="primary" />
 * <BasketballIcon animation="dribble" />
 */

export { default as AllouiIcon, InteractiveAllouiIcon, BasketballIcon } from './AllouiIcon';
export { iconDefinitions } from './iconDefinitions';
export { basketballAnimations, getBasketballAnimation } from './basketballAnimations';

// Convenience exports for commonly used icons
export const HomeIcon = (props) => <AllouiIconComponent name="home" {...props} />;
export const BasketballIconSimple = (props) => <AllouiIconComponent name="basketball" variant="basketball" {...props} />;
export const SuccessIcon = (props) => <AllouiIconComponent name="success" variant="success" {...props} />;
export const ErrorIcon = (props) => <AllouiIconComponent name="error" variant="danger" {...props} />;
export const TrophyIcon = (props) => <AllouiIconComponent name="trophy" variant="gold" {...props} />;
export const ModuleIcon = (props) => <AllouiIconComponent name="module" variant="navy" {...props} />;
export const InsightIcon = (props) => <AllouiIconComponent name="insight" variant="gold" {...props} />;
export const TargetIcon = (props) => <AllouiIconComponent name="target" variant="primary" {...props} />;
export const ArrowRightIcon = (props) => <AllouiIconComponent name="arrow-right" variant="primary" {...props} />;
export const ArrowLeftIcon = (props) => <AllouiIconComponent name="arrow-left" variant="primary" {...props} />;
export const MenuIcon = (props) => <AllouiIconComponent name="menu" {...props} />;
export const CloseIcon = (props) => <AllouiIconComponent name="close" {...props} />;
export const UserIcon = (props) => <AllouiIconComponent name="user" {...props} />;
export const SettingsIcon = (props) => <AllouiIconComponent name="settings" {...props} />;
export const LockedIcon = (props) => <AllouiIconComponent name="locked" variant="secondary" {...props} />;
export const UnlockedIcon = (props) => <AllouiIconComponent name="unlocked" variant="success" {...props} />;
export const WhistleIcon = (props) => <AllouiIconComponent name="whistle" variant="navy" {...props} />;
export const LoadingIcon = (props) => <AllouiIconComponent name="loading" animated="spin" {...props} />;