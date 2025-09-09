/**
 * Performance Dashboard for Monitoring and Optimization
 * Provides real-time performance metrics and optimization insights
 */

import React, { useState, useEffect, useMemo, memo } from 'react';
import { getPerformanceReport, getOptimizationSuggestions, getWebVitalsScore } from '../../utils/webVitals';
import { cacheMetrics } from '../../lib/cache';
import LoadingSpinner from '../ui/LoadingSpinner';

const PerformanceDashboard = memo(() => {
  const [performanceData, setPerformanceData] = useState(null);
  const [webVitals, setWebVitals] = useState({});
  const [cacheStats, setCacheStats] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Fetch performance data
  const fetchPerformanceData = async () => {
    try {
      const report = getPerformanceReport();
      const vitals = getWebVitalsScore();
      const cache = cacheMetrics.getStats();
      const optimizations = getOptimizationSuggestions();

      setPerformanceData(report);
      setWebVitals(vitals);
      setCacheStats(cache);
      setSuggestions(optimizations);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
      setIsLoading(false);
    }
  };

  // Initialize and set up auto-refresh
  useEffect(() => {
    fetchPerformanceData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPerformanceData, 30000);
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Memoized web vitals score calculation
  const overallScore = useMemo(() => {
    const metrics = Object.values(webVitals);
    if (metrics.length === 0) return { score: 0, rating: 'unknown' };

    const goodCount = metrics.filter(m => m.rating === 'good').length;
    const totalCount = metrics.length;
    const score = Math.round((goodCount / totalCount) * 100);

    let rating = 'poor';
    if (score >= 80) rating = 'good';
    else if (score >= 60) rating = 'needs-improvement';

    return { score, rating };
  }, [webVitals]);

  // Metric card component
  const MetricCard = ({ title, value, unit, rating, target, description }) => {
    const getRatingColor = (rating) => {
      switch (rating) {
        case 'good': return 'text-success-green border-success-green bg-green-50';
        case 'needs-improvement': return 'text-basketball-orange border-basketball-orange bg-orange-50';
        case 'poor': return 'text-team-red border-team-red bg-red-50';
        default: return 'text-gray-500 border-gray-300 bg-gray-50';
      }
    };

    return (
      <div className={`p-4 rounded-lg border-2 ${getRatingColor(rating)}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm uppercase tracking-wide">{title}</h3>
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
            rating === 'good' ? 'bg-success-green text-white' :
            rating === 'needs-improvement' ? 'bg-basketball-orange text-white' :
            rating === 'poor' ? 'bg-team-red text-white' : 'bg-gray-400 text-white'
          }`}>
            {rating || 'N/A'}
          </span>
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">
            {typeof value === 'number' ? value.toFixed(title === 'CLS' ? 3 : 0) : value || 'N/A'}
          </span>
          {unit && <span className="ml-1 text-sm opacity-75">{unit}</span>}
        </div>
        {target && (
          <div className="text-xs mt-1 opacity-75">
            Target: &lt; {target}{unit}
          </div>
        )}
        {description && (
          <div className="text-xs mt-2 opacity-75">
            {description}
          </div>
        )}
      </div>
    );
  };

  // Cache statistics component
  const CacheStats = ({ stats }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-court-blue" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
        Cache Performance
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-xl font-bold text-court-blue">
            {stats.memory?.totalEntries || 0}
          </div>
          <div className="text-sm text-gray-600">Memory Entries</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-xl font-bold text-success-green">
            {stats.memory?.validEntries || 0}
          </div>
          <div className="text-sm text-gray-600">Valid Entries</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-xl font-bold text-basketball-orange">
            {stats.swr || 0}
          </div>
          <div className="text-sm text-gray-600">SWR Entries</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-xl font-bold text-whistle-silver">
            {stats.memory?.memoryUsage ? `${Math.round(stats.memory.memoryUsage / 1024)} KB` : '0 KB'}
          </div>
          <div className="text-sm text-gray-600">Memory Usage</div>
        </div>
      </div>
    </div>
  );

  // Optimization suggestions component
  const OptimizationSuggestions = ({ suggestions }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-basketball-orange" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Performance Suggestions
      </h3>

      {suggestions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-success-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="font-medium">Great job! No major performance issues detected.</p>
          <p className="text-sm">All Core Web Vitals are performing well.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-basketball-orange text-white">
                    {suggestion.metric}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="font-medium text-orange-900">{suggestion.issue}</h4>
                  <ul className="mt-2 text-sm text-orange-800">
                    {suggestion.suggestions.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-basketball-orange rounded-full mt-1.5 mr-2"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner size="large" message="Loading performance data..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor Core Web Vitals and optimization opportunities</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last updated: {performanceData?.timestamp ? 
                new Date(performanceData.timestamp).toLocaleTimeString() : 'Never'}
            </div>
            <button
              onClick={fetchPerformanceData}
              className="px-4 py-2 bg-court-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Overall Score */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Overall Performance Score</h2>
                <p className="text-gray-600">Based on Core Web Vitals metrics</p>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${
                  overallScore.rating === 'good' ? 'text-success-green' :
                  overallScore.rating === 'needs-improvement' ? 'text-basketball-orange' :
                  'text-team-red'
                }`}>
                  {overallScore.score}
                </div>
                <div className="text-lg text-gray-600">/ 100</div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Core Web Vitals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <MetricCard
              title="LCP"
              value={webVitals.LCP?.value}
              unit="ms"
              rating={webVitals.LCP?.rating}
              target="2500"
              description="Largest Contentful Paint"
            />
            <MetricCard
              title="FID"
              value={webVitals.FID?.value}
              unit="ms"
              rating={webVitals.FID?.rating}
              target="100"
              description="First Input Delay"
            />
            <MetricCard
              title="CLS"
              value={webVitals.CLS?.value}
              rating={webVitals.CLS?.rating}
              target="0.1"
              description="Cumulative Layout Shift"
            />
            <MetricCard
              title="FCP"
              value={webVitals.FCP?.value}
              unit="ms"
              rating={webVitals.FCP?.rating}
              target="1800"
              description="First Contentful Paint"
            />
            <MetricCard
              title="TTFB"
              value={webVitals.TTFB?.value}
              unit="ms"
              rating={webVitals.TTFB?.rating}
              target="800"
              description="Time to First Byte"
            />
          </div>
        </div>

        {/* Cache Statistics */}
        <div className="mb-8">
          <CacheStats stats={cacheStats} />
        </div>

        {/* Optimization Suggestions */}
        <div className="mb-8">
          <OptimizationSuggestions suggestions={suggestions} />
        </div>

        {/* Performance Details */}
        {performanceData?.performance && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Detailed Metrics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Navigation Timing */}
              {performanceData.performance.navigation && (
                <div>
                  <h4 className="font-medium mb-3">Navigation Timing</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(performanceData.performance.navigation.value || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-mono">{typeof value === 'number' ? `${value.toFixed(0)}ms` : value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Resources */}
              {performanceData.performance.resources && (
                <div>
                  <h4 className="font-medium mb-3">Recent Resources</h4>
                  <div className="space-y-2">
                    {performanceData.performance.resources.slice(0, 5).map((resource, index) => (
                      <div key={index} className="text-xs border rounded p-2">
                        <div className="font-mono text-gray-600 truncate">{resource.name}</div>
                        <div className="flex justify-between text-gray-500">
                          <span>{resource.type}</span>
                          <span>{resource.duration.toFixed(0)}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

PerformanceDashboard.displayName = 'PerformanceDashboard';

export default PerformanceDashboard;