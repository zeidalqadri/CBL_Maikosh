// pages/index.js (refactored for alloui brand system)
// Notes:
// • Expects brand assets in /public generated earlier (icons, manifest, SVGs, tokens CSS)
// • Uses brand token CSS variables and utilities from /alloui_brand_tokens.css
// • Keeps existing component structure (MainLayout, HeroText, SectionTitle, CustomCursor, Footer)

import { useState } from 'react'
import Head from 'next/head'
import MainLayout from '../layouts/MainLayout'
import { useAuth } from '../contexts/AuthContext'
import { HeroText, SectionTitle } from '../components/FragmentedText'
import CustomCursor from '../components/CustomCursor'
import Footer from '../components/Footer'
import CoachDashboard from '../components/dashboard/CoachDashboard'

export default function Home() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // If user is logged in, show the Coach's Dashboard
  if (!loading && user) {
    return (
      <MainLayout>
        <Head>
          <title>Coach's Dashboard | alloui by CBL</title>
          <meta name="description" content="Your personalized coaching dashboard with progress tracking, learning modules, and coaching tools." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/icons/favicon.ico" sizes="any" />
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
          <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
          <link rel="manifest" href="/icons/site.webmanifest" />
          <meta name="theme-color" content="#031a39" />
        </Head>
        
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <CoachDashboard />
          </div>
        </div>
        
        <Footer />
      </MainLayout>
    )
  }

  // Show landing page for non-authenticated users
  return (
    <MainLayout>
      <Head>
        {/* Identity / SEO / PWA */}
        <title>alloui by CBL — Basketball Coaching Certification</title>
        <meta name="description" content="Train, certify, and track coaching mastery with alloui, the CBL standard." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Brand tokens */}

        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />

        {/* Social cards with alloui branding */}
        <meta property="og:title" content="alloui by CBL — Basketball Coaching Certification" />
        <meta property="og:description" content="Master basketball coaching excellence in Malaysia with MABA/NSC certified Level I program. Train, certify, and track coaching mastery with alloui." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="alloui by CBL - Basketball coaching certification platform" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="alloui by CBL — Basketball Coaching Certification" />
        <meta name="twitter:description" content="Master basketball coaching excellence in Malaysia with MABA/NSC certified Level I program." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* Additional meta tags for SEO */}
        <meta name="keywords" content="basketball coaching, Malaysia, MABA, NSC, coaching certification, Level I, coaching course, basketball training, sports coaching" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en-US" />
        <meta name="geo.region" content="MY" />
        <meta name="geo.country" content="Malaysia" />

        {/* Minimal helpers so we can reference token variables without Tailwind config changes */}
        <style>{`
          .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
          .chip { display:inline-block; padding:6px 10px; border-radius:999px; background:rgba(255,255,255,0.1); font-size:12px; }
        `}</style>
      </Head>

      {/* Custom Cursor */}
      <CustomCursor />

      {/* HERO */}
      <section className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center py-1 md:py-4 relative overflow-hidden">
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 dark:hidden" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)', backgroundSize:'40px 40px'}} />
          <div className="absolute inset-0 hidden dark:block" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize:'40px 40px'}} />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-12">
          <div className="max-w-6xl mx-auto">

          <div className="-mt-4 md:-mt-8 leading-none tracking-tight tabular-nums text-xs text-gray-500 dark:text-gray-400 mb-8 uppercase">
                  01/ COACHING MASTERY
                </div>

            <div className="mb-8 md:mb-10">
              <HeroText>Basketball Coaching Excellence</HeroText>
            </div>

            {/* Centered feature grid with prominent display */}
            <div className="max-w-4xl mx-auto text-center mb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="brand-card p-6">
                  <div className="text-3xl font-bold text-alloui-gold-light dark:text-alloui-gold-dark mb-2">12</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Interactive Modules</div>
                </div>
                <div className="brand-card p-6">
                  <div className="text-3xl font-bold text-alloui-gold-light dark:text-alloui-gold-dark mb-2">MABA/NSC</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Certified Program</div>
                </div>
                <div className="brand-card p-6">
                  <div className="text-3xl font-bold text-alloui-gold-light dark:text-alloui-gold-dark mb-2">Level I</div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Coaching Certificate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA and Scroll indicator - horizontally aligned */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-12">
            {/* CTA Button */}
            <div>
              {!loading && (
                user ? (
                  <a href="/modules" className="btn-alloui px-8 py-4 text-lg font-medium">Continue Lessons</a>
                ) : (
                  <a href="/auth/login" className="btn-alloui px-8 py-4 text-lg font-medium">Get Certified</a>
                )
              )}
            </div>
            
            {/* Scroll indicator */}
            <div className="text-center">
              <div className="text-[10px] tracking-wider text-gray-400 dark:text-gray-500 mb-3">SCROLL TO EXPLORE</div>
              <div className="w-6 h-10 border border-gray-300 dark:border-gray-600 rounded-full flex justify-center mx-auto">
                <div className="w-px h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REGIONAL AUTHORITY */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-xs text-gray-500 mb-16 tracking-wider uppercase">02 / REGIONAL LEADERSHIP</div>
              <SectionTitle className="text-gray-900 dark:text-white mb-16">Premier Coaching Authority</SectionTitle>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Our curriculum and assessment metrics are developed in alignment with modules and guidelines from the Malaysian Basketball Association (MABA) and the National Sports Council (NSC).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
              {[
                ['1,200+','Certified Coaches','In Malaysia'],
                ['15+','Years Experience','Coaching Development'],
                ['13','Malaysian States','Active Programs'],
              ].map(([num,cap,sub]) => (
                <div key={cap} className="text-center brand-card">
                  <div className="text-4xl md:text-5xl font-bold text-alloui-gold-light dark:text-alloui-gold-dark">{num}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 uppercase tracking-wider">{cap}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-3">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTEXT */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="text-xs text-gray-500 mb-4 tracking-wider uppercase">03 / REGIONAL EXPERTISE</div>
              <SectionTitle className="text-gray-900 dark:text-white mb-6">Bespoke Coaching Solution</SectionTitle>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Basketball coaching in Malaysia faces unique challenges—from climate to multilingual environments—drawing on best practices across Southeast Asia.</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cultural Adaptability</h3>
                  <p className="text-base text-gray-600 dark:text-gray-300">Techniques that work across diverse cultures and languages.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Climate-Smart Training</h3>
                  <p className="text-base text-gray-600 dark:text-gray-300">Conditioning tuned for heat and humidity.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Resource Optimization</h3>
                  <p className="text-base text-gray-600 dark:text-gray-300">Strategies for varied facilities and constraints.</p>
                </div>
              </div>

              <div className="mt-8">
                <a href="/modules" className="btn-alloui inline-block px-8 py-4 text-lg font-medium">View Curriculum</a>
              </div>
            </div>

            <div className="relative lg:col-span-4 lg:col-start-9">
              <div className="aspect-square brand-card flex items-center justify-center" style={{background:'linear-gradient(135deg, rgba(212,178,76,.15), rgba(3,26,57,.15))'}}>
                <img src="/icons/logomark.svg" alt="alloui outline" className="h-24 w-24" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-alloui-primary-light dark:bg-alloui-primary-dark text-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs text-gray-300 mb-4 tracking-wider uppercase">04 / JOIN THE EXCELLENCE</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Make It Official</h2>
            <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">Join over 1,200 certified coaches elevating the game across all 13 states.</p>
            <a href="/auth/login" className="btn-alloui inline-block px-8 py-4 text-lg font-medium">Get Certified</a>
          </div>
        </div>
      </section>

      <Footer />
    </MainLayout>
  )
}
