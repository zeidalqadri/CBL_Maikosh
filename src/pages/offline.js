import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../layouts/MainLayout';
import { OfflineState } from '../components/feedback/ErrorState';
import AccessibleButton from '../components/accessibility/AccessibleButton';

/**
 * Offline Page
 * Displayed when user is offline and content is not cached
 */
export default function OfflinePage() {
  const handleRetry = () => {
    if ('serviceWorker' in navigator) {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <MainLayout>
      <Head>
        <title>Offline | alloui by CBL</title>
        <meta name="description" content="You're currently offline. Some features may be limited. Return when you have a connection to continue your basketball coaching certification." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="Offline | alloui by CBL" />
        <meta property="og:description" content="You're currently offline. Some features may be limited. Return when you have a connection to continue your basketball coaching certification." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Offline - alloui by CBL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Offline | alloui by CBL" />
        <meta name="twitter:description" content="You're currently offline. Some features may be limited. Return when you have a connection to continue your basketball coaching certification." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="offline, connection error, alloui by CBL, basketball coaching, Malaysia, MABA, NSC" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="language" content="en-US" />
        <meta name="geo.region" content="MY" />
        <meta name="geo.country" content="Malaysia" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            
            {/* Offline Icon */}
            <div className="text-center mb-8">
              <svg 
                className="mx-auto h-16 w-16 text-neutral-gray mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Z" 
                />
              </svg>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                You're Offline
              </h1>
              
              <p className="text-neutral-gray mb-6">
                It looks like you've lost your internet connection. Some features and content may not be available right now.
              </p>
            </div>

            {/* Available Offline Features */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                What's Available Offline:
              </h2>
              
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-success-green mr-2 mt-0.5 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  Previously viewed modules and content
                </li>
                <li className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-success-green mr-2 mt-0.5 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  Cached educational materials
                </li>
                <li className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-success-green mr-2 mt-0.5 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  Local progress tracking (syncs when reconnected)
                </li>
              </ul>
            </div>

            {/* Limited Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Limited While Offline:
              </h3>
              
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-alloui-gold mr-2 mt-0.5 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  New content downloads
                </li>
                <li className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-alloui-gold mr-2 mt-0.5 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  Live progress syncing
                </li>
                <li className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-alloui-gold mr-2 mt-0.5 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  User authentication
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <AccessibleButton
                onClick={handleRetry}
                variant="primary"
                size="large"
                className="w-full"
                ariaLabel="Check connection and retry loading"
              >
                Check Connection
              </AccessibleButton>
              
              <AccessibleButton
                onClick={handleGoHome}
                variant="secondary"
                className="w-full"
                ariaLabel="Go to homepage"
              >
                Go Home
              </AccessibleButton>
            </div>

            {/* Connection Status */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Your progress will be saved locally and synced when you reconnect.
              </p>
            </div>

          </div>
        </div>

        {/* Tips Section */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8">
          <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tips for Offline Learning:
            </h3>
            
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-alloui-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Visit modules while connected to cache them for offline access
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-alloui-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Your quiz responses and progress are saved locally
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-alloui-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Everything syncs automatically when you reconnect
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}