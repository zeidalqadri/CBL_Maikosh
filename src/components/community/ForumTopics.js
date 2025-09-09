import React, { useState } from 'react';
import { AllouiIcon } from '../icons';

const TopicRow = ({ topic, onTopicSelect }) => {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'pinned': return 'target';
      case 'hot': return 'fire';
      case 'solved': return 'check';
      default: return 'communication';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'pinned': return 'text-alloui-gold';
      case 'hot': return 'text-basketball-orange';
      case 'solved': return 'text-success-green';
      default: return 'text-gray-400';
    }
  };

  return (
    <div 
      onClick={() => onTopicSelect(topic)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-alloui-gold transition-all cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        {/* Priority Icon */}
        <div className="flex-shrink-0 mt-1">
          <AllouiIcon 
            name={getPriorityIcon(topic.priority)} 
            size="sm" 
            className={getPriorityColor(topic.priority)} 
          />
        </div>

        {/* Topic Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-alloui-primary hover:text-alloui-gold transition-colors mb-1">
                {topic.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {topic.excerpt}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <AllouiIcon name="user" size="xs" className="mr-1" />
                  <span>{topic.author}</span>
                </div>
                <div className="flex items-center">
                  <AllouiIcon name="calendar" size="xs" className="mr-1" />
                  <span>{topic.createdAt}</span>
                </div>
                {topic.tags && topic.tags.length > 0 && (
                  <div className="flex items-center space-x-1">
                    {topic.tags.slice(0, 2).map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-alloui-gold/20 text-alloui-primary px-2 py-0.5 rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {topic.tags.length > 2 && (
                      <span className="text-gray-400">+{topic.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 ml-4">
              <div className="text-center">
                <div className="text-lg font-bold text-alloui-primary">{topic.replyCount}</div>
                <div className="text-xs text-gray-500">replies</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-alloui-primary">{topic.viewCount}</div>
                <div className="text-xs text-gray-500">views</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-alloui-primary">{topic.likeCount}</div>
                <div className="text-xs text-gray-500">likes</div>
              </div>
            </div>
          </div>

          {/* Last Activity */}
          {topic.lastActivity && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <AllouiIcon name="communication" size="xs" className="mr-2" />
                <span>Last reply by <strong>{topic.lastActivity.author}</strong></span>
              </div>
              <span className="text-sm text-gray-500">{topic.lastActivity.timeAgo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ForumTopics = ({ category, topics, onTopicSelect, onNewTopic, onBack }) => {
  const [sortBy, setSortBy] = useState('latest');
  const [filterBy, setFilterBy] = useState('all');

  const sortOptions = [
    { id: 'latest', name: 'Latest Activity', icon: 'calendar' },
    { id: 'popular', name: 'Most Popular', icon: 'fire' },
    { id: 'replies', name: 'Most Replies', icon: 'communication' },
    { id: 'views', name: 'Most Views', icon: 'eye' }
  ];

  const filterOptions = [
    { id: 'all', name: 'All Topics', count: topics.length },
    { id: 'unsolved', name: 'Unsolved', count: topics.filter(t => t.priority !== 'solved').length },
    { id: 'hot', name: 'Hot Topics', count: topics.filter(t => t.priority === 'hot').length },
    { id: 'pinned', name: 'Pinned', count: topics.filter(t => t.priority === 'pinned').length }
  ];

  const filteredTopics = topics.filter(topic => {
    if (filterBy === 'all') return true;
    if (filterBy === 'unsolved') return topic.priority !== 'solved';
    return topic.priority === filterBy;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="flex items-center text-alloui-primary hover:text-alloui-gold transition-colors mr-4"
          >
            <AllouiIcon name="arrow-left" size="sm" className="mr-2" />
            Back to Categories
          </button>
          <div>
            <h2 className="text-2xl font-bold text-alloui-primary flex items-center">
              <AllouiIcon name={category.icon} size="lg" className="mr-3 text-alloui-gold" />
              {category.name}
            </h2>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>
        <button
          onClick={onNewTopic}
          className="bg-gradient-to-r from-alloui-primary to-alloui-court-blue hover:from-alloui-court-blue hover:to-alloui-primary text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center"
        >
          <AllouiIcon name="plus" size="sm" className="mr-2" />
          New Topic
        </button>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Sort Options */}
          <div>
            <h3 className="font-bold text-alloui-primary mb-3 flex items-center">
              <AllouiIcon name="settings" size="sm" className="mr-2 text-alloui-gold" />
              Sort By
            </h3>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    sortBy === option.id
                      ? 'bg-alloui-gold text-alloui-primary shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <AllouiIcon name={option.icon} size="xs" className="mr-2" />
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Options */}
          <div>
            <h3 className="font-bold text-alloui-primary mb-3 flex items-center">
              <AllouiIcon name="filter" size="sm" className="mr-2 text-alloui-gold" />
              Filter
            </h3>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setFilterBy(option.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterBy === option.id
                      ? 'bg-alloui-gold text-alloui-primary shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.name}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filterBy === option.id ? 'bg-alloui-primary/20' : 'bg-gray-300'
                  }`}>
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              onTopicSelect={onTopicSelect}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
            <AllouiIcon name="search" size="xl" className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-500 mb-2">No topics found</h3>
            <p className="text-gray-400 mb-6">Be the first to start a discussion in this category!</p>
            <button
              onClick={onNewTopic}
              className="bg-alloui-primary hover:bg-alloui-court-blue text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Start New Topic
            </button>
          </div>
        )}
      </div>

      {/* Category Stats */}
      <div className="bg-gradient-to-r from-alloui-primary/10 to-alloui-court-blue/10 border border-alloui-primary/20 rounded-lg p-6">
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-alloui-primary">{category.topicCount}</div>
            <div className="text-sm text-gray-600">Total Topics</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-alloui-primary">{category.postCount}</div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-alloui-primary">{category.memberCount}</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-alloui-primary">{category.activeToday}</div>
            <div className="text-sm text-gray-600">Active Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumTopics;