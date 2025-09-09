import React, { useState } from 'react';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
import { 
  AllouiIcon, 
  InteractiveAllouiIcon,
  BasketballIcon,
  HomeIcon,
  BasketballIconSimple,
  SuccessIcon,
  ErrorIcon,
  TrophyIcon,
  ModuleIcon,
  InsightIcon,
  TargetIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  MenuIcon,
  CloseIcon,
  UserIcon,
  SettingsIcon,
  LockedIcon,
  UnlockedIcon,
  WhistleIcon,
  LoadingIcon
} from '../components/icons';

export default function IconShowcase() {
  const [selectedSize, setSelectedSize] = useState('md');
  const [selectedVariant, setSelectedVariant] = useState('primary');
  const [showAnimated, setShowAnimated] = useState(false);

  // All available icons for showcase
  const iconList = [
    { name: 'home', description: 'Home/Dashboard navigation' },
    { name: 'basketball', description: 'Basketball sport element' },
    { name: 'basketball-simple', description: 'Simple basketball ball' },
    { name: 'module', description: 'Learning module/course' },
    { name: 'insight', description: 'Key insight/lightbulb moment' },
    { name: 'target', description: 'Goal/target achievement' },
    { name: 'basketball-hoop', description: 'Basketball hoop target' },
    { name: 'success', description: 'Success/completion status' },
    { name: 'swish-success', description: 'Perfect shot success' },
    { name: 'error', description: 'Error/failed status' },
    { name: 'miss-shot', description: 'Missed shot error' },
    { name: 'trophy', description: 'Championship/achievement' },
    { name: 'medal', description: 'Recognition/award' },
    { name: 'locked', description: 'Content locked/restricted' },
    { name: 'unlocked', description: 'Content unlocked/accessible' },
    { name: 'whistle', description: 'Coach/referee whistle' },
    { name: 'loading', description: 'Loading/progress indicator' },
    { name: 'arrow-right', description: 'Navigate forward' },
    { name: 'arrow-left', description: 'Navigate backward' },
    { name: 'arrow-up', description: 'Navigate up' },
    { name: 'arrow-down', description: 'Navigate down' },
    { name: 'menu', description: 'Open menu' },
    { name: 'close', description: 'Close menu' },
    { name: 'user', description: 'User profile' },
    { name: 'settings', description: 'Settings/configuration' },
    { name: 'timeout-pause', description: 'Pause/timeout indicator' }
  ];

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  const variants = [
    'primary', 'secondary', 'gold', 'navy', 'basketball', 
    'success', 'danger', 'warning', 'white', 'court', 'rim'
  ];

  const animations = [
    'bounce', 'spin', 'pulse', 'dribble', 'swish', 
    'courtSlide', 'whistleBlow'
  ];

  return (
    <MainLayout>
      <Head>
        <title>Alloui Icon System Showcase | Basketball Coaching Platform</title>
        <meta name="description" content="Comprehensive showcase of the alloui basketball-themed iconography system that replaces emoticons with branded elements." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <BasketballIcon size="xl" animation="dribble" />
            </div>
            <h1 className="text-4xl font-bold text-alloui-navy dark:text-white mb-4">
              Alloui Icon System
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Basketball-themed iconography system that replaces all emoticons and generic icons 
              with branded, accessible, and animated visual elements inspired by the sport of basketball.
            </p>
          </div>

          {/* Control Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-alloui-navy dark:text-white">
              Interactive Controls
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Size Control */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Size
                </label>
                <select 
                  value={selectedSize} 
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {sizes.map(size => (
                    <option key={size} value={size}>
                      {size.toUpperCase()} {size === 'xs' ? '(12px)' : size === 'sm' ? '(16px)' : size === 'md' ? '(24px)' : size === 'lg' ? '(32px)' : '(48px)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Variant Control */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Color Variant
                </label>
                <select 
                  value={selectedVariant} 
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {variants.map(variant => (
                    <option key={variant} value={variant}>
                      {variant.charAt(0).toUpperCase() + variant.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Animation Toggle */}
              <div className="flex items-center">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={showAnimated}
                    onChange={(e) => setShowAnimated(e.target.checked)}
                    className="w-5 h-5 text-alloui-gold"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Animations
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Icons Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-alloui-navy dark:text-white">
              Complete Icon Library
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {iconList.map((icon) => (
                <div 
                  key={icon.name}
                  className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-alloui-gold hover:shadow-md transition-all duration-200"
                >
                  <div className="w-12 h-12 flex items-center justify-center mb-3">
                    <AllouiIcon
                      name={icon.name}
                      size={selectedSize}
                      variant={selectedVariant}
                      animated={showAnimated ? 'bounce' : false}
                      interactive={true}
                      className="hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                  <h3 className="text-xs font-semibold text-center text-gray-800 dark:text-gray-200 mb-1">
                    {icon.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {icon.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Basketball Animations Showcase */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-alloui-navy dark:text-white">
              Basketball Animations
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {animations.map((animation) => (
                <div 
                  key={animation}
                  className="flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="w-16 h-16 flex items-center justify-center mb-3">
                    <AllouiIcon
                      name="basketball"
                      size="lg"
                      variant="basketball"
                      animated={animation}
                      className="text-orange-600"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-center text-gray-800 dark:text-gray-200">
                    {animation}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Examples */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-alloui-navy dark:text-white">
              Usage Examples
            </h2>

            <div className="space-y-6">
              {/* Basic Usage */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Basic Icon Usage
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <code className="text-sm">
                    {`import { AllouiIcon } from '@/components/icons';

<AllouiIcon name="basketball" size="md" variant="primary" />
<AllouiIcon name="success" size="lg" variant="success" />
<AllouiIcon name="trophy" size="xl" variant="gold" animated="bounce" />`}
                  </code>
                </div>
              </div>

              {/* Interactive Icons */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Interactive Icons
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-3">
                  <code className="text-sm">
                    {`import { InteractiveAllouiIcon } from '@/components/icons';

<InteractiveAllouiIcon 
  name="home" 
  size="md" 
  variant="primary"
  onActivate={() => router.push('/')}
  ariaLabel="Go to home page"
/>`}
                  </code>
                </div>
                <div className="flex space-x-4">
                  <InteractiveAllouiIcon
                    name="home"
                    size="lg"
                    variant="primary"
                    onActivate={() => alert('Home clicked!')}
                    ariaLabel="Go to home page"
                  />
                  <InteractiveAllouiIcon
                    name="settings"
                    size="lg"
                    variant="secondary"
                    onActivate={() => alert('Settings clicked!')}
                    ariaLabel="Open settings"
                  />
                  <InteractiveAllouiIcon
                    name="trophy"
                    size="lg"
                    variant="gold"
                    animated="bounce"
                    onActivate={() => alert('Trophy clicked!')}
                    ariaLabel="View achievements"
                  />
                </div>
              </div>

              {/* Convenience Components */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  Convenience Components
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-3">
                  <code className="text-sm">
                    {`import { 
  HomeIcon, 
  TrophyIcon, 
  LoadingIcon,
  BasketballIcon 
} from '@/components/icons';

<HomeIcon size="md" />
<TrophyIcon size="lg" />  
<LoadingIcon size="sm" />
<BasketballIcon animation="dribble" />`}
                  </code>
                </div>
                <div className="flex space-x-4 items-center">
                  <HomeIcon size="md" />
                  <TrophyIcon size="lg" />
                  <LoadingIcon size="sm" />
                  <BasketballIcon animation="dribble" />
                </div>
              </div>
            </div>
          </div>

          {/* Design Principles */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-alloui-navy dark:text-white">
              Design Principles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                  <AllouiIcon name="basketball" size="sm" variant="basketball" className="mr-2" />
                  Basketball-Inspired
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Every icon draws inspiration from basketball elements - courts, balls, hoops, 
                  player movements, and coaching strategies.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                  <AllouiIcon name="success" size="sm" variant="success" className="mr-2" />
                  Accessibility First
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  WCAG 2.1 AA compliant with proper ARIA labels, keyboard navigation, 
                  and reduced motion support.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                  <AllouiIcon name="target" size="sm" variant="primary" className="mr-2" />
                  Brand Consistency
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Uses alloui's color palette (Navy #031a39, Gold #d4b24c) and maintains 
                  consistent styling across all icons.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                  <AllouiIcon name="whistle" size="sm" variant="navy" className="mr-2" />
                  Performance Optimized
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  SVG-based icons with minimal file sizes, tree-shaking support, 
                  and efficient rendering across all screen densities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}