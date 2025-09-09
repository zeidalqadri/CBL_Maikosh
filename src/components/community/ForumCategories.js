import React from 'react';
import { AllouiIcon } from '../icons';

const CategoryCard = ({ category, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(category)}
      className="group bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-alloui-gold transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Category Header */}
      <div className={`bg-gradient-to-r ${category.gradient} text-white p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-lg mr-4">
              <AllouiIcon name={category.icon} size="lg" className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{category.name}</h3>
              <p className="text-white/90 text-sm">{category.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{category.topicCount}</div>
            <div className="text-xs text-white/80">topics</div>
          </div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-alloui-primary">{category.postCount}</div>
            <div className="text-xs text-gray-600">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-alloui-primary">{category.memberCount}</div>
            <div className="text-xs text-gray-600">Members</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-alloui-primary">{category.activeToday}</div>
            <div className="text-xs text-gray-600">Active Today</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-bold text-alloui-primary mb-2">Recent Activity</h4>
          <div className="space-y-2">
            {category.recentPosts.slice(0, 2).map((post, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center flex-1 min-w-0">
                  <AllouiIcon name="user" size="xs" className="text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-700 truncate">
                    {post.title.length > 40 ? post.title.substring(0, 40) + '...' : post.title}
                  </span>
                </div>
                <span className="text-gray-500 text-xs ml-2 flex-shrink-0">{post.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enter Button */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <AllouiIcon name="communication" size="xs" className="mr-1" />
              <span>{category.moderators.length} moderator{category.moderators.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center text-alloui-gold group-hover:text-alloui-primary transition-colors">
              <span className="text-sm font-medium mr-1">Enter Forum</span>
              <AllouiIcon name="arrow-right" size="xs" className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ForumCategories = ({ categories, onCategorySelect }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-alloui-primary mb-4 flex items-center justify-center">
          <AllouiIcon name="communication" size="lg" className="mr-3 text-alloui-gold" />
          Community Forums
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with fellow basketball coaches from Malaysia and Southeast Asia. Share experiences, 
          ask questions, and learn from the community.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onSelect={onCategorySelect}
          />
        ))}
      </div>

      {/* Community Stats */}
      <div className="bg-gradient-to-r from-alloui-primary/10 to-alloui-court-blue/10 border border-alloui-primary/20 rounded-lg p-6">
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-alloui-primary">
              {categories.reduce((total, cat) => total + cat.memberCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-alloui-primary">
              {categories.reduce((total, cat) => total + cat.topicCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Discussions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-alloui-primary">
              {categories.reduce((total, cat) => total + cat.postCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-alloui-primary">
              {categories.reduce((total, cat) => total + cat.activeToday, 0)}
            </div>
            <div className="text-sm text-gray-600">Active Today</div>
          </div>
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-alloui-primary mb-4 flex items-center">
          <AllouiIcon name="info" size="sm" className="mr-2 text-alloui-gold" />
          Community Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start">
              <AllouiIcon name="check" size="xs" className="text-success-green mt-1 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Be Respectful</div>
                <div className="text-sm text-gray-600">Treat all coaches with respect and professionalism</div>
              </div>
            </div>
            <div className="flex items-start">
              <AllouiIcon name="check" size="xs" className="text-success-green mt-1 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Share Knowledge</div>
                <div className="text-sm text-gray-600">Help others by sharing your coaching experiences</div>
              </div>
            </div>
            <div className="flex items-start">
              <AllouiIcon name="check" size="xs" className="text-success-green mt-1 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Stay On Topic</div>
                <div className="text-sm text-gray-600">Keep discussions relevant to basketball coaching</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <AllouiIcon name="check" size="xs" className="text-success-green mt-1 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Use Search First</div>
                <div className="text-sm text-gray-600">Check if your question has been answered before</div>
              </div>
            </div>
            <div className="flex items-start">
              <AllouiIcon name="check" size="xs" className="text-success-green mt-1 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">No Spam or Self-Promotion</div>
                <div className="text-sm text-gray-600">Focus on genuine discussion and learning</div>
              </div>
            </div>
            <div className="flex items-start">
              <AllouiIcon name="check" size="xs" className="text-success-green mt-1 mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900">Report Issues</div>
                <div className="text-sm text-gray-600">Help moderators by reporting inappropriate content</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumCategories;