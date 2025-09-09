import { useState } from 'react';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { AllouiIcon } from '../components/icons';

function Resources() {
  const { user } = useAuth();

  return (
    <>
      <Head>
        <title>Basketball Resources | alloui by CBL</title>
        <meta name="description" content="Comprehensive basketball coaching resources, training materials, and educational content for Level I certification." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="Basketball Resources | alloui by CBL" />
        <meta property="og:description" content="Comprehensive basketball coaching resources, training materials, and educational content for Level I certification." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Basketball Resources - alloui by CBL coaching materials" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Basketball Resources | alloui by CBL" />
        <meta name="twitter:description" content="Comprehensive basketball coaching resources, training materials, and educational content for Level I certification." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="basketball resources, coaching materials, training materials, basketball videos, coaching resources, MABA resources, NSC Level I materials, Malaysia basketball" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en-US" />
        <meta name="geo.region" content="MY" />
        <meta name="geo.country" content="Malaysia" />
      </Head>
      
      <div className="container mx-auto px-4 py-16 md:py-24 bg-white dark:bg-black text-gray-900 dark:text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
            09 / RESOURCES
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-12">
            Basketball Coaching Resources
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Training Materials */}
            <div className="brand-card">
              <AllouiIcon name="resources" size="xl" variant="gold" className="mb-1rem" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Training Materials</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Downloadable PDFs, worksheets, and training guides for basketball coaching fundamentals.
              </p>
              <button className="btn-alloui w-full inline-block px-4 py-2 text-center">
                Browse Materials
              </button>
            </div>

            {/* Video Library */}
            <div className="brand-card">
              <AllouiIcon name="insight" size="xl" variant="gold" className="mb-1rem" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Video Library</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Instructional videos demonstrating coaching techniques, drills, and game strategies.
              </p>
              <button className="btn-alloui w-full inline-block px-4 py-2 text-center">
                Watch Videos
              </button>
            </div>

            {/* Drill Database */}
            <div className="brand-card">
              <AllouiIcon name="basketball" size="xl" variant="gold" className="mb-1rem" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Drill Database</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Comprehensive collection of basketball drills organized by skill level and focus area.
              </p>
              <button className="btn-alloui w-full inline-block px-4 py-2 text-center">
                Explore Drills
              </button>
            </div>

            {/* Rule Books */}
            <div className="brand-card">
              <AllouiIcon name="resources" size="xl" variant="gold" className="mb-1rem" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Official Rules</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Current basketball rules, regulations, and official MABA/NSC guidelines.
              </p>
              <button className="btn-alloui w-full inline-block px-4 py-2 text-center">
                View Rules
              </button>
            </div>

            {/* Forms & Templates */}
            <div className="brand-card">
              <AllouiIcon name="overview" size="xl" variant="gold" className="mb-1rem" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Forms & Templates</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Practice plans, assessment forms, and administrative templates for coaches.
              </p>
              <button className="btn-alloui w-full inline-block px-4 py-2 text-center">
                Download Forms
              </button>
            </div>

            {/* Community Forum */}
            <div className="brand-card">
              <AllouiIcon name="user" size="xl" variant="gold" className="mb-1rem" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Coach Community</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect with other coaches, share experiences, and get advice from the community.
              </p>
              <button className="btn-alloui w-full inline-block px-4 py-2 text-center">
                Join Discussion
              </button>
            </div>
          </div>

          {/* Featured Resources */}
          <section className="bg-alloui-primary text-white rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <AllouiIcon name="trophy" size="sm" variant="gold" className="mr-2" />
                  Championship Playbook
                </h3>
                <p className="text-blue-100 mb-4">
                  Proven strategies and plays from championship-winning coaches. Perfect for developing your team's competitive edge.
                </p>
                <button className="btn-alloui bg-alloui-gold text-black px-6 py-3 rounded-lg">
                  Download Playbook
                </button>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <AllouiIcon name="target" size="sm" variant="gold" className="mr-2" />
                  Quick Start Guide
                </h3>
                <p className="text-blue-100 mb-4">
                  New to coaching? Start here with our comprehensive beginner's guide to basketball coaching fundamentals.
                </p>
                <button className="btn-alloui bg-alloui-gold text-black px-6 py-3 rounded-lg">
                  Get Started
                </button>
              </div>
            </div>
          </section>

          {/* Quick Links */}
          <section className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Need Help Finding Something?
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/guides" className="btn btn-outline">
                Coaching Guides
              </a>
              <a href="/faq" className="btn btn-outline">
                FAQ
              </a>
              <a href="/contact" className="btn btn-outline">
                Contact Support
              </a>
              <a href="/modules" className="btn btn-primary">
                Back to Modules
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

Resources.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export default Resources;