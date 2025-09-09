import { useState } from 'react';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { AllouiIcon } from '../components/icons';

function Support() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('general');

  const supportCategories = [
    { id: 'general', name: 'General Support', icon: 'user' },
    { id: 'technical', name: 'Technical Issues', icon: 'settings' },
    { id: 'certification', name: 'Certification', icon: 'trophy' },
    { id: 'billing', name: 'Billing', icon: 'billing' }
  ];

  const supportOptions = [
    {
      title: 'Knowledge Base',
      description: 'Browse our comprehensive knowledge base for quick answers to common questions.',
      icon: 'resources',
      action: 'Browse Articles',
      href: '/faq'
    },
    {
      title: 'Contact Support',
      description: 'Get direct help from our support team via email or phone.',
      icon: 'user',
      action: 'Contact Us',
      href: '/contact'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides for using the platform effectively.',
      icon: 'insight',
      action: 'Watch Videos',
      href: '/resources'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other coaches and share experiences in our community forum.',
      icon: 'user',
      action: 'Join Discussion',
      href: '#'
    }
  ];

  const quickLinks = [
    { title: 'Reset Password', href: '#' },
    { title: 'Update Profile', href: '/profile' },
    { title: 'Download Certificate', href: '#' },
    { title: 'Technical Requirements', href: '#' },
    { title: 'Certification Guidelines', href: '#' },
    { title: 'Refund Policy', href: '#' }
  ];

  return (
    <>
      <Head>
        <title>Support | alloui by CBL</title>
        <meta name="description" content="Get help and support for the MABA/NSC Level I Basketball Coaching Certification program." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="Support | alloui by CBL" />
        <meta property="og:description" content="Get help and support for the MABA/NSC Level I Basketball Coaching Certification program." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Support - alloui by CBL Basketball coaching help" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Support | alloui by CBL" />
        <meta name="twitter:description" content="Get help and support for the MABA/NSC Level I Basketball Coaching Certification program." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="support, help, basketball coaching support, MABA certification help, NSC Level I support, coaching help, Malaysia basketball, CBL support" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en-US" />
        <meta name="geo.region" content="MY" />
        <meta name="geo.country" content="Malaysia" />
      </Head>
      
      <div className="container mx-auto px-4 py-16 md:py-24 bg-white dark:bg-black text-gray-900 dark:text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
              06 / SUPPORT CENTER
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Support Center
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're here to help you succeed in your basketball coaching certification journey.
            </p>
          </div>

          {/* Support Categories */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {supportCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedCategory === category.id
                      ? 'bg-alloui-gold text-black border-alloui-gold'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-alloui-gold'
                  }`}
                >
                  <AllouiIcon 
                    name={category.icon} 
                    size="sm" 
                    variant={selectedCategory === category.id ? 'primary' : 'secondary'} 
                    className="mr-2" 
                  />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {supportOptions.map((option, index) => (
              <div key={index} className="brand-card text-center">
                <AllouiIcon name={option.icon} size="xl" variant="gold" className="mb-1rem" />
                <h3 className="text-xl font-semibold mb-3">{option.title}</h3>
                <p className="text-gray-600 mb-4">
                  {option.description}
                </p>
                <a href={option.href} className="btn-alloui w-full inline-block px-4 py-2 text-center">
                  {option.action}
                </a>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <section className="brand-card bg-gray-50 dark:bg-gray-800 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Quick Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-900 dark:text-white hover:text-alloui-gold no-underline"
                >
                  <span className="font-medium">{link.title}</span>
                </a>
              ))}
            </div>
          </section>

          {/* Emergency Support */}
          <section className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">
              🚨 Emergency Support
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-6">
              If you're experiencing urgent technical issues that prevent you from accessing your certification materials, 
              please contact our emergency support line.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+1-555-0123" className="btn bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-lg">
                Call Emergency Support
              </a>
              <a href="mailto:emergency@alloui.com" className="btn btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-lg">
                Emergency Email
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

Support.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export default Support;