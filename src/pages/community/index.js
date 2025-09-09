import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import MainLayout from '../../layouts/MainLayout';
import ForumCategories from '../../components/community/ForumCategories';
import ForumTopics from '../../components/community/ForumTopics';
import TopicDiscussion from '../../components/community/TopicDiscussion';
import Footer from '../../components/Footer';
import { forumCategories, sampleTopics, getCategoryById, getTopicWithPosts } from '../../data/forumData';

export default function CommunityPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentView, setCurrentView] = useState('categories'); // categories | topics | discussion
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicPosts, setTopicPosts] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/community');
    }
  }, [user, loading, router]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentView('topics');
  };

  const handleTopicSelect = (topic) => {
    const topicData = getTopicWithPosts(topic.id);
    if (topicData) {
      setSelectedTopic(topicData.topic);
      setTopicPosts(topicData.posts);
      setCurrentView('discussion');
    }
  };

  const handleNewTopic = () => {
    // In a real app, this would open a new topic creation form
    alert('New topic creation will be implemented in the next update!');
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
    setSelectedTopic(null);
    setTopicPosts([]);
  };

  const handleBackToTopics = () => {
    setCurrentView('topics');
    setSelectedTopic(null);
    setTopicPosts([]);
  };

  const handleReply = async (postId, content) => {
    // In a real app, this would save to the database
    const newPost = {
      id: `post_${Date.now()}`,
      author: user?.displayName || 'Anonymous',
      authorBadge: null,
      postNumber: topicPosts.length + 1,
      createdAt: 'Just now',
      content: content,
      likeCount: 0,
      isLiked: false,
      tags: [],
      edited: false
    };
    
    setTopicPosts([...topicPosts, newPost]);
  };

  const handleLike = (postId) => {
    setTopicPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1
            }
          : post
      )
    );
  };

  const handleSubscribe = (topicId, subscribe) => {
    // In a real app, this would update the database
    console.log(`${subscribe ? 'Subscribed to' : 'Unsubscribed from'} topic ${topicId}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-alloui-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Loading community forum...</p>
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
        <title>Community Forum | alloui by CBL</title>
        <meta name="description" content="Connect with fellow basketball coaches from Malaysia and Southeast Asia. Share experiences, ask questions, and learn from the community." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="Community Forum | alloui by CBL" />
        <meta property="og:description" content="Connect with fellow basketball coaches and share experiences in our community forum." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Community Forum - alloui by CBL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Community Forum | alloui by CBL" />
        <meta name="twitter:description" content="Connect with fellow basketball coaches and share experiences." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="basketball coaching community, coach forum, Malaysia basketball, coaching discussion, basketball training, coach network" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          
          {currentView === 'categories' && (
            <ForumCategories 
              categories={forumCategories}
              onCategorySelect={handleCategorySelect}
            />
          )}

          {currentView === 'topics' && selectedCategory && (
            <ForumTopics
              category={selectedCategory}
              topics={sampleTopics[selectedCategory.id] || []}
              onTopicSelect={handleTopicSelect}
              onNewTopic={handleNewTopic}
              onBack={handleBackToCategories}
            />
          )}

          {currentView === 'discussion' && selectedTopic && (
            <TopicDiscussion
              topic={selectedTopic}
              posts={topicPosts}
              onBack={handleBackToTopics}
              onReply={handleReply}
              onLike={handleLike}
              onSubscribe={handleSubscribe}
            />
          )}

        </div>
      </div>
      
      <Footer />
    </MainLayout>
  );
}