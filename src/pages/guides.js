import { useState } from 'react';
import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
import Link from 'next/link';
import { AllouiIcon } from '../components/icons';

function Guides() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Guides', icon: 'resources' },
    { id: 'fundamentals', name: 'Fundamentals', icon: 'basketball' },
    { id: 'offense', name: 'Offense', icon: 'target' },
    { id: 'defense', name: 'Defense', icon: 'whistle' },
    { id: 'conditioning', name: 'Conditioning', icon: 'strength' },
    { id: 'psychology', name: 'Psychology', icon: 'psychology' }
  ];

  const guides = [
    {
      id: 1,
      title: 'Basketball Fundamentals for New Coaches',
      category: 'fundamentals',
      description: 'Essential basics every basketball coach needs to know before stepping onto the court.',
      readTime: '15 min read',
      difficulty: 'Beginner',
      featured: true
    },
    {
      id: 2,
      title: 'Building Effective Offensive Systems',
      category: 'offense',
      description: 'Strategic approaches to developing a successful offensive game plan for your team.',
      readTime: '20 min read',
      difficulty: 'Intermediate'
    },
    {
      id: 3,
      title: 'Defensive Principles and Strategies',
      category: 'defense',
      description: 'Comprehensive guide to teaching and implementing defensive concepts.',
      readTime: '18 min read',
      difficulty: 'Intermediate'
    },
    {
      id: 4,
      title: 'Player Conditioning and Fitness',
      category: 'conditioning',
      description: 'Science-based approach to improving your players\' physical fitness and endurance.',
      readTime: '12 min read',
      difficulty: 'Beginner'
    },
    {
      id: 5,
      title: 'Sports Psychology for Coaches',
      category: 'psychology',
      description: 'Understanding and applying psychological principles to enhance team performance.',
      readTime: '25 min read',
      difficulty: 'Advanced'
    },
    {
      id: 6,
      title: 'Advanced Offensive Sets',
      category: 'offense',
      description: 'Complex offensive plays and systems for experienced teams and coaches.',
      readTime: '30 min read',
      difficulty: 'Advanced'
    }
  ];

  const filteredGuides = selectedCategory === 'all' 
    ? guides 
    : guides.filter(guide => guide.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Head>
        <title>Coaching Guides | alloui by CBL</title>
        <meta name="description" content="Comprehensive basketball coaching guides covering fundamentals, strategy, and advanced techniques for Level I certification." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="Coaching Guides | alloui by CBL" />
        <meta property="og:description" content="Comprehensive basketball coaching guides covering fundamentals, strategy, and advanced techniques for Level I certification." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Coaching Guides - alloui by CBL basketball coaching resources" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Coaching Guides | alloui by CBL" />
        <meta name="twitter:description" content="Comprehensive basketball coaching guides covering fundamentals, strategy, and advanced techniques for Level I certification." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="coaching guides, basketball guides, coaching strategies, basketball fundamentals, offensive strategies, defensive strategies, coaching tips, Malaysia basketball, MABA, NSC" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en-US" />
        <meta name="geo.region" content="MY" />
        <meta name="geo.country" content="Malaysia" />
      </Head>
      
      <div className="container mx-auto px-4 py-16 md:py-24 bg-white dark:bg-black text-gray-900 dark:text-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
              08 / COACHING GUIDES
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Basketball Coaching Guides
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive guides to help you master basketball coaching fundamentals 
              and advanced techniques. Perfect for MABA/NSC Level I certification preparation.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {categories.map((category) => (
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

          {/* Featured Guide */}
          {selectedCategory === 'all' && (
            <div className="mb-12">
              {guides.filter(guide => guide.featured).map((guide) => (
                <div key={guide.id} className="bg-gradient-to-r from-alloui-primary to-alloui-gold text-white rounded-lg p-8">
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center bg-white/20 rounded-full px-3 py-1 text-sm mb-4">
                      <AllouiIcon name="target" size="xs" variant="white" className="mr-1" />
                      Featured Guide
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{guide.title}</h2>
                    <p className="text-blue-100 text-lg mb-6">{guide.description}</p>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        {guide.readTime}
                      </span>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        {guide.difficulty}
                      </span>
                    </div>
                    <button className="btn-alloui bg-white text-alloui-primary px-6 py-3 rounded-lg">
                      <span className="flex items-center">
                        Read Guide
                        <AllouiIcon name="arrow-right" size="xs" variant="primary" className="ml-2" />
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredGuides.filter(guide => !guide.featured || selectedCategory !== 'all').map((guide) => (
              <div key={guide.id} className="brand-card hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">{guide.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {guide.description}
                  </p>
                </div>
                <button className="btn btn-outline w-full border-alloui-gold text-alloui-gold hover:bg-alloui-gold hover:text-black">
                  Read Guide
                </button>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <section className="brand-card bg-gray-50 dark:bg-gray-800 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Apply What You've Learned?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Put your knowledge to the test with our interactive learning modules. 
              Each module includes practical exercises and assessments to reinforce your coaching skills.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/modules" className="btn-alloui px-6 py-3 inline-block">
                Start Learning Modules
              </Link>
              <Link href="/resources" className="btn btn-outline border-alloui-gold text-alloui-gold hover:bg-alloui-gold hover:text-black px-6 py-3 inline-block">
                Browse Resources
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

Guides.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      {page}
    </MainLayout>
  );
};

export default Guides;