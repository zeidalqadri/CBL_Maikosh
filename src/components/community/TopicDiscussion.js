import React, { useState } from 'react';
import { AllouiIcon } from '../icons';
import { useAuth } from '../../contexts/AuthContext';

const PostCard = ({ post, onReply, onLike, isAuthor = false }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(post.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${isAuthor ? 'ring-2 ring-alloui-gold/20' : ''}`}>
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-alloui-primary rounded-full flex items-center justify-center">
            <AllouiIcon name="user" size="sm" className="text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-alloui-primary">{post.author}</span>
              {isAuthor && (
                <span className="bg-alloui-gold text-alloui-primary px-2 py-1 rounded-full text-xs font-bold">
                  Original Poster
                </span>
              )}
              {post.authorBadge && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  post.authorBadge === 'moderator' 
                    ? 'bg-basketball-orange text-white'
                    : 'bg-success-green text-white'
                }`}>
                  {post.authorBadge}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 flex items-center space-x-4">
              <span>{post.createdAt}</span>
              <span>#{post.postNumber}</span>
              {post.edited && (
                <span className="flex items-center">
                  <AllouiIcon name="edit" size="xs" className="mr-1" />
                  edited
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Post Actions */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onLike(post.id)}
            className={`flex items-center px-3 py-1 rounded-lg transition-colors ${
              post.isLiked 
                ? 'bg-success-green/20 text-success-green' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            <AllouiIcon name="heart" size="xs" className="mr-1" />
            <span className="text-sm font-medium">{post.likeCount}</span>
          </button>
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
          >
            <AllouiIcon name="reply" size="xs" className="mr-1" />
            <span className="text-sm font-medium">Reply</span>
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="prose prose-sm max-w-none mb-4">
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      {/* Post Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-alloui-gold/20 text-alloui-primary px-2 py-1 rounded text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alloui-gold focus:border-transparent resize-none"
              rows="3"
            />
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Be respectful and constructive in your response
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowReplyForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="px-6 py-2 bg-alloui-primary hover:bg-alloui-court-blue disabled:bg-gray-300 text-white font-bold rounded-lg transition-colors"
                >
                  Post Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TopicDiscussion = ({ topic, posts, onBack, onReply, onLike, onSubscribe }) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(topic.isSubscribed || false);

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    onSubscribe(topic.id, !isSubscribed);
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      pinned: { label: 'Pinned', color: 'bg-alloui-gold text-alloui-primary', icon: 'target' },
      hot: { label: 'Hot Topic', color: 'bg-basketball-orange text-white', icon: 'fire' },
      solved: { label: 'Solved', color: 'bg-success-green text-white', icon: 'check' }
    };
    return badges[priority];
  };

  const priorityBadge = getPriorityBadge(topic.priority);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-alloui-primary hover:text-alloui-gold transition-colors"
          >
            <AllouiIcon name="arrow-left" size="sm" className="mr-2" />
            Back to Topics
          </button>
          
          <div className="flex items-center space-x-3">
            {priorityBadge && (
              <span className={`flex items-center px-3 py-1 rounded-full text-sm font-bold ${priorityBadge.color}`}>
                <AllouiIcon name={priorityBadge.icon} size="xs" className="mr-1" />
                {priorityBadge.label}
              </span>
            )}
            <button
              onClick={handleSubscribe}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                isSubscribed
                  ? 'bg-success-green text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <AllouiIcon name={isSubscribed ? 'notification-on' : 'notification-off'} size="xs" className="mr-2" />
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-alloui-primary mb-2">{topic.title}</h1>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <AllouiIcon name="user" size="xs" className="mr-1" />
              <span>Started by <strong>{topic.author}</strong></span>
            </div>
            <div className="flex items-center">
              <AllouiIcon name="calendar" size="xs" className="mr-1" />
              <span>{topic.createdAt}</span>
            </div>
            <div className="flex items-center">
              <AllouiIcon name="communication" size="xs" className="mr-1" />
              <span>{posts.length} replies</span>
            </div>
            <div className="flex items-center">
              <AllouiIcon name="eye" size="xs" className="mr-1" />
              <span>{topic.viewCount} views</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {topic.tags && topic.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {topic.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-alloui-gold/20 text-alloui-primary px-3 py-1 rounded text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            onReply={onReply}
            onLike={onLike}
            isAuthor={post.author === topic.author}
          />
        ))}
      </div>

      {/* Quick Reply */}
      {user && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="font-bold text-alloui-primary mb-4 flex items-center">
            <AllouiIcon name="reply" size="sm" className="mr-2 text-alloui-gold" />
            Quick Reply
          </h3>
          <QuickReplyForm onReply={(content) => onReply(null, content)} />
        </div>
      )}

      {/* Related Topics */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="font-bold text-alloui-primary mb-4 flex items-center">
          <AllouiIcon name="related" size="sm" className="mr-2 text-alloui-gold" />
          Related Topics
        </h3>
        <div className="space-y-3">
          {topic.relatedTopics?.map((relatedTopic, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <AllouiIcon name="communication" size="xs" className="text-alloui-primary" />
                <span className="text-alloui-primary hover:text-alloui-gold transition-colors">
                  {relatedTopic.title}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {relatedTopic.replyCount} replies
              </div>
            </div>
          )) || (
            <div className="text-gray-500 text-center py-4">
              No related topics found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuickReplyForm = ({ onReply }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(content);
      setContent('');
    } catch (error) {
      console.error('Error posting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts, experiences, or ask questions..."
        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alloui-gold focus:border-transparent resize-none"
        rows="4"
        required
      />
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <AllouiIcon name="info" size="xs" className="mr-1" />
          Be respectful and constructive in your discussion
        </div>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-alloui-primary to-alloui-court-blue hover:from-alloui-court-blue hover:to-alloui-primary disabled:bg-gray-300 text-white font-bold rounded-lg transition-all duration-200"
        >
          {isSubmitting ? 'Posting...' : 'Post Reply'}
        </button>
      </div>
    </form>
  );
};

export default TopicDiscussion;