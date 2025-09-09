import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { HeroText, SectionTitle } from '../components/FragmentedText';
import MagneticButton from '../components/MagneticButton';
import CustomCursor from '../components/CustomCursor';
import SoundToggle from '../components/SoundToggle';
import ThemeToggle from '../components/ThemeToggle';
import BrandLogo from '../components/BrandLogo';
import Footer from '../components/Footer';

export default function Home() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <MainLayout title="Home">
      <Head>
        <title>CBL_alloui | MABA/NSC Basketball Coaching Level I</title>
        <meta name="description" content="Basketball Coaching Level I web application with 12 interactive learning modules" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preload" href="/fonts/Outfit-Bold.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossOrigin="" />
      </Head>

      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Hero Section - Ecrin Style with theme responsiveness */}
      <section className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center py-8 md:py-16 relative overflow-hidden">
        {/* Subtle grid background - theme responsive */}
        <div className="absolute inset-0 opacity-[0.02]">
          {/* Light mode grid */}
          <div className="absolute inset-0 dark:hidden" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
          {/* Dark mode grid */}
          <div className="absolute inset-0 hidden dark:block" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Hero Brand Logo */}
            <div className="flex items-center mb-8">
              <BrandLogo 
                size="hero" 
                variant="responsive"
                showText={true}
                className="mr-6"
              />
            </div>

            {/* Number prefix */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-8 tracking-wider uppercase">
              01 / COACHING MASTERY
            </div>
            
            {/* Main hero text with fragmented layout */}
            <div className="mb-12 md:mb-16">
              <HeroText>
                Master Basketball Coaching Excellence in Malaysia
              </HeroText>
            </div>
            
            {/* Asymmetrical content layout - Golden ratio inspired */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left column - Description - Golden ratio positioning */}
              <div className="lg:col-span-5 lg:col-start-1">
                
                <div className="space-y-4">
                  <div className="text-small text-gray-600 dark:text-gray-400">
                    <span className="text-accent font-medium">12</span> Interactive Modules
                  </div>
                  <div className="text-small text-gray-600 dark:text-gray-400">
                    <span className="text-accent font-medium">MABA/NSC</span> Certified Program  
                  </div>
                  <div className="text-small text-gray-600 dark:text-gray-400">
                    <span className="text-accent font-medium">Level I</span> Coaching Certificate
                  </div>
                </div>
              </div>
              
              {/* Right column - Actions - Golden ratio positioning */}
              <div className="lg:col-span-4 lg:col-start-8">
                <div className="space-y-6">
                  {!loading && (
                    <>
                      {user ? (
                        <MagneticButton 
                          href="/modules" 
                          variant="primary"
                          className="px-8 py-4 text-body-large w-full md:w-auto"
                        >
                          Continue Lessons
                        </MagneticButton>
                      ) : (
                        <MagneticButton 
                          href="/api/auth/login" 
                          variant="primary"
                          external
                          className="px-8 py-4 text-body-large w-full md:w-auto"
                        >
                          Get Certified
                        </MagneticButton>
                      )}
                    </>
                  )}
                </div>
                
                {/* Decorative element */}
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator - repositioned with theme responsiveness */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="text-tiny text-gray-400 dark:text-gray-500 tracking-wider mb-4 text-center">
            SCROLL TO EXPLORE
          </div>
          <div className="w-6 h-10 border border-gray-300 dark:border-gray-600 rounded-full flex justify-center mx-auto">
            <div className="w-px h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 animate-pulse-subtle" />
          </div>
        </div>
      </section>

      {/* Regional Authority Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <div className="text-xs text-gray-500 mb-4 tracking-wider uppercase">
                02 / REGIONAL LEADERSHIP
              </div>
              <SectionTitle className="text-gray-900 dark:text-white mb-6">
                Malaysia's Premier Basketball Coaching Authority
              </SectionTitle>
              <p className="text-body-large text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Recognized by MABA and NSC as the gold standard for coaching development, with regional expertise spanning Southeast Asia.
              </p>
            </div>

            {/* Statistics grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">1,200+</div>
                <div className="text-small text-gray-600 dark:text-gray-400 uppercase tracking-wider">Certified Coaches</div>
                <div className="text-tiny text-gray-500 mt-1">In Malaysia</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">15+</div>
                <div className="text-small text-gray-600 dark:text-gray-400 uppercase tracking-wider">Years Experience</div>
                <div className="text-tiny text-gray-500 mt-1">Coaching Development</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">13</div>
                <div className="text-small text-gray-600 dark:text-gray-400 uppercase tracking-wider">Malaysian States</div>
                <div className="text-tiny text-gray-500 mt-1">Active Programs</div>
              </div>
            </div>

            {/* Authority credentials */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Official Recognition & Partnerships</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-small text-gray-600 dark:text-gray-300">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>MABA Endorsed:</strong> Official curriculum approved by Malaysia Basketball Association for national coaching standards</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>NSC Certified:</strong> Meets National Sports Council requirements for professional coaching certification</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>FIBA Asia Aligned:</strong> Curriculum standards consistent with international basketball federation guidelines</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>ABL Supported:</strong> Endorsed by ASEAN Basketball League for professional development programs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEA Basketball Context Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Content - Golden ratio positioning */}
              <div className="lg:col-span-7">
                <div className="text-xs text-gray-500 mb-4 tracking-wider uppercase">
                  03 / REGIONAL EXPERTISE
                </div>
                <SectionTitle className="text-gray-900 dark:text-white mb-6">
                  Coaching Excellence Tailored for Malaysia
                </SectionTitle>
                <p className="text-body-large text-gray-600 dark:text-gray-300 mb-8">
                  Basketball coaching in Malaysia faces unique challenges - from tropical climate considerations to diverse cultural backgrounds, multilingual team environments, with regional expertise drawn from Southeast Asian best practices.
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-large font-semibold text-gray-900 dark:text-white mb-2">Cultural Adaptability</h3>
                    <p className="text-body text-gray-600 dark:text-gray-300">Master coaching techniques that work across Malaysia's diverse cultures, languages, and basketball traditions, with insights from Southeast Asian practices.</p>
                  </div>
                  <div>
                    <h3 className="text-large font-semibold text-gray-900 dark:text-white mb-2">Climate-Smart Training</h3>
                    <p className="text-body text-gray-600 dark:text-gray-300">Learn specialized conditioning and training methods optimized for tropical weather conditions and high humidity.</p>
                  </div>
                  <div>
                    <h3 className="text-large font-semibold text-gray-900 dark:text-white mb-2">Resource Optimization</h3>
                    <p className="text-body text-gray-600 dark:text-gray-300">Develop effective coaching strategies that maximize limited resources and varying facility standards across the region.</p>
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="mt-8">
                  <MagneticButton 
                    href="/modules" 
                    variant="primary"
                    className="px-8 py-4 text-body-large"
                  >
                    View Curriculum
                  </MagneticButton>
                </div>
              </div>

              {/* Visual element - Golden ratio positioning */}
              <div className="relative lg:col-span-4 lg:col-start-9">
                <div className="aspect-square bg-gradient-to-br from-accent/20 to-court-blue/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏀</div>
                    <div className="text-large font-semibold text-gray-700 dark:text-gray-300">Malaysia</div>
                    <div className="text-small text-gray-500">Basketball Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-xs text-gray-500 mb-4 tracking-wider uppercase">
                04 / SUCCESS STORIES
              </div>
              <SectionTitle className="text-gray-900 dark:text-white mb-6">
                Coaches Achieving Excellence Across Malaysia
              </SectionTitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Testimonial 1 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="text-accent text-2xl mb-4">"</div>
                <p className="text-body text-gray-600 dark:text-gray-300 mb-6">
                  "This program transformed how I approach coaching in Malaysia's diverse basketball environment. The cultural sensitivity modules were game-changers for my school team."
                </p>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="font-semibold text-gray-900 dark:text-white">Coach Ahmad Rahman</div>
                  <div className="text-small text-gray-500">SMK Kuala Lumpur Basketball Program</div>
                  <div className="text-tiny text-gray-400">Certified Level I Coach • Kuala Lumpur</div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="text-accent text-2xl mb-4">"</div>
                <p className="text-body text-gray-600 dark:text-gray-300 mb-6">
                  "The climate-adaptive training techniques have been invaluable for our youth development program in Johor. My players show 40% less fatigue during intense sessions."
                </p>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="font-semibold text-gray-900 dark:text-white">Coach Lim Wei Ming</div>
                  <div className="text-small text-gray-500">Johor Youth Basketball Academy</div>
                  <div className="text-tiny text-gray-400">Certified Level I Coach • Johor Bahru</div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="text-accent text-2xl mb-4">"</div>
                <p className="text-body text-gray-600 dark:text-gray-300 mb-6">
                  "Working with players from diverse Malaysian communities, the multilingual coaching strategies module revolutionized our team communication and performance."
                </p>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="font-semibold text-gray-900 dark:text-white">Coach Siti Aminah</div>
                  <div className="text-small text-gray-500">Selangor Community Basketball Program</div>
                  <div className="text-tiny text-gray-400">Certified Level I Coach • Shah Alam</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <MagneticButton 
                href="/success-stories" 
                variant="secondary"
                className="px-8 py-4 text-body-large"
              >
                Read More
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-court-blue text-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs text-gray-300 mb-4 tracking-wider uppercase">
              05 / JOIN THE EXCELLENCE
            </div>
            <h2 className="text-display font-bold text-white mb-6">
              Become a Certified Basketball Coach in Malaysia
            </h2>
            <p className="text-body-large text-gray-200 mb-8 max-w-2xl mx-auto">
              Join over 1,200 certified coaches who have elevated their careers and transformed basketball development across all 13 Malaysian states, with regional expertise from Southeast Asian best practices.
            </p>
            
            <div className="flex justify-center">
              <MagneticButton 
                href="/api/auth/login" 
                variant="secondary"
                external
                className="px-8 py-4 text-body-large"
              >
                Get Certified
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </MainLayout>
  );
}