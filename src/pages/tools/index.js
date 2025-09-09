import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import MainLayout from '../../layouts/MainLayout';
import { AllouiIcon } from '../../components/icons';
import Footer from '../../components/Footer';

const ToolCard = ({ title, description, icon, href, badge, comingSoon = false }) => {
  const router = useRouter();
  
  const handleClick = () => {
    if (!comingSoon) {
      router.push(href);
    }
  };

  return (
    <div 
      className={`group relative bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-all duration-200 ${
        comingSoon 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:shadow-lg hover:border-alloui-gold cursor-pointer'
      }`}
      onClick={handleClick}
    >
      {badge && (
        <div className="absolute -top-2 -right-2 bg-alloui-gold text-alloui-primary text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </div>
      )}
      
      {comingSoon && (
        <div className="absolute -top-2 -right-2 bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded-full">
          Coming Soon
        </div>
      )}

      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${comingSoon ? 'bg-gray-100' : 'bg-alloui-gold/10 group-hover:bg-alloui-gold/20'} transition-colors`}>
          <AllouiIcon 
            name={icon} 
            size="lg" 
            className={comingSoon ? 'text-gray-400' : 'text-alloui-primary group-hover:text-alloui-gold'} 
          />
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-bold mb-2 ${comingSoon ? 'text-gray-400' : 'text-alloui-primary group-hover:text-alloui-gold'}`}>
            {title}
          </h3>
          <p className={`text-sm leading-relaxed ${comingSoon ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
          
          {!comingSoon && (
            <div className="flex items-center text-alloui-gold group-hover:text-alloui-primary text-sm font-medium mt-3">
              <span>Open Tool</span>
              <AllouiIcon name="arrow-right" size="xs" className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ToolsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/tools');
    }
  }, [user, loading, router]);

  const categories = [
    { id: 'all', name: 'All Tools', icon: 'settings' },
    { id: 'planning', name: 'Practice Planning', icon: 'calendar' },
    { id: 'analysis', name: 'Player Analysis', icon: 'chart' },
    { id: 'communication', name: 'Team Communication', icon: 'communication' },
    { id: 'development', name: 'Skill Development', icon: 'growth' }
  ];

  const tools = [
    {
      title: 'Interactive Drill Builder',
      description: 'Design custom basketball drills with drag-and-drop simplicity. Create visual drill diagrams, set player movements, and save your custom drills.',
      icon: 'strategy',
      href: '/tools/drill-builder',
      category: 'planning',
      badge: 'NEW'
    },
    {
      title: 'Video Scenario Challenges',
      description: 'Practice real coaching situations through interactive video scenarios. Make decisions and receive feedback on your coaching choices.',
      icon: 'video',
      href: '/scenarios',
      category: 'development',
      badge: 'NEW'
    },
    {
      title: 'Practice Plan Generator',
      description: 'Generate structured practice plans based on your team\'s skill level, available time, and training objectives.',
      icon: 'calendar',
      href: '/tools/practice-planner',
      category: 'planning',
      comingSoon: true
    },
    {
      title: 'Player Progress Tracker',
      description: 'Track individual player development across multiple skills and competencies. Monitor improvement over time.',
      icon: 'chart',
      href: '/tools/player-tracker',
      category: 'analysis',
      comingSoon: true
    },
    {
      title: 'Team Communication Hub',
      description: 'Send announcements, share practice schedules, and communicate with parents and players in one place.',
      icon: 'communication',
      href: '/tools/team-communication',
      category: 'communication',
      comingSoon: true
    },
    {
      title: 'Video Analysis Tool',
      description: 'Upload game footage and add coaching annotations. Create video breakdowns for teaching moments.',
      icon: 'video',
      href: '/tools/video-analysis',
      category: 'analysis',
      comingSoon: true
    },
    {
      title: 'Skill Assessment Generator',
      description: 'Create customized skill assessments and rubrics for evaluating player competencies and progress.',
      icon: 'knowledge-check',
      href: '/tools/skill-assessments',
      category: 'development',
      comingSoon: true
    },
    {
      title: 'Game Strategy Planner',
      description: 'Design game strategies, set plays, and defensive schemes. Share with your coaching staff and players.',
      icon: 'target',
      href: '/tools/game-strategy',
      category: 'planning',
      comingSoon: true
    },
    {
      title: 'Parent Communication Portal',
      description: 'Keep parents informed with practice schedules, player progress updates, and team announcements.',
      icon: 'user',
      href: '/tools/parent-portal',
      category: 'communication',
      comingSoon: true
    }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-alloui-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Loading coaching tools...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <MainLayout>
      <Head>
        <title>Coach's Toolkit | alloui by CBL</title>
        <meta name="description" content="Access powerful coaching tools designed to enhance your basketball coaching experience. Practice planning, drill building, player tracking, and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="Coach's Toolkit | alloui by CBL" />
        <meta property="og:description" content="Access powerful coaching tools for basketball practice planning, drill building, and player development." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Coach's Toolkit - alloui by CBL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Coach's Toolkit | alloui by CBL" />
        <meta name="twitter:description" content="Access powerful coaching tools for basketball practice planning and player development." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="basketball coaching tools, practice planning, drill builder, coaching software, player tracking, team management, Malaysia basketball" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-alloui-primary mb-4 flex items-center justify-center">
              <AllouiIcon name="basketball" size="xl" className="mr-4 text-alloui-gold" />
              Coach's Toolkit
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Professional coaching tools designed to enhance your basketball coaching experience 
              and accelerate player development.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-alloui-gold text-alloui-primary shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <AllouiIcon name={category.icon} size="xs" className="mr-2" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-gradient-to-r from-alloui-primary to-alloui-court-blue text-white rounded-lg p-6 text-center">
            <AllouiIcon name="rocket" size="lg" className="text-alloui-gold mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">More Tools Coming Soon</h3>
            <p className="text-alloui-gold/90 mb-4">
              We're constantly developing new tools to support your coaching journey. 
              Have a suggestion? Let us know what tools would help you most!
            </p>
            <button 
              onClick={() => router.push('/contact')}
              className="inline-flex items-center px-6 py-3 bg-alloui-gold text-alloui-primary font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <AllouiIcon name="communication" size="sm" className="mr-2" />
              Request a Tool
            </button>
          </div>

        </div>
      </div>
      
      <Footer />
    </MainLayout>
  );
}