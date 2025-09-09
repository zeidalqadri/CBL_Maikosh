/**
 * Interactive API Documentation Page
 * Provides Swagger UI for exploring and testing the API
 */

import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function ApiDocs() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSwaggerUI = async () => {
      try {
        // Import SwaggerUI dynamically to avoid SSR issues
        const SwaggerUI = (await import('swagger-ui-react')).default;
        
        // Configure SwaggerUI
        const ui = SwaggerUI({
          url: '/api/docs/openapi.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUI.presets.apis,
            SwaggerUI.presets.standalone
          ],
          plugins: [
            SwaggerUI.plugins.DownloadUrl
          ],
          layout: "StandaloneLayout",
          defaultModelsExpandDepth: 2,
          defaultModelExpandDepth: 2,
          docExpansion: 'list',
          filter: true,
          showRequestHeaders: true,
          showCommonExtensions: true,
          tryItOutEnabled: true,
          requestInterceptor: (request) => {
            // Add any custom headers or auth
            request.headers['Content-Type'] = 'application/json';
            return request;
          },
          responseInterceptor: (response) => {
            // Handle responses if needed
            return response;
          },
          onComplete: () => {
            setIsLoaded(true);
          },
          onFailure: (error) => {
            console.error('Swagger UI failed to load:', error);
            setError(error);
            setIsLoaded(true);
          }
        });

      } catch (err) {
        console.error('Failed to load Swagger UI:', err);
        setError(err);
        setIsLoaded(true);
      }
    };

    loadSwaggerUI();
  }, []);

  return (
    <>
      <Head>
        <title>API Documentation | alloui by CBL</title>
        <meta name="description" content="Interactive API documentation for the alloui basketball coaching platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* SEO meta */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="author" content="CBL" />
        <meta name="language" content="en-US" />
        <meta name="geo.region" content="MY" />
        <meta name="geo.country" content="Malaysia" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  alloui API Documentation
                </h1>
                <span className="ml-3 px-2 py-1 bg-alloui-gold text-black text-sm font-medium rounded">
                  v1.0.0
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/api/docs/openapi.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download OpenAPI Spec
                </a>
                <a
                  href="/"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to App
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6">
          {/* Loading State */}
          {!isLoaded && !error && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading API documentation...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mx-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Failed to load API documentation
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>There was an error loading the Swagger UI. Please try refreshing the page.</p>
                    {process.env.NODE_ENV === 'development' && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">Error details</summary>
                        <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
                          {error.message || JSON.stringify(error, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Introduction Panel */}
          <div className="mx-4 mb-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Welcome to the alloui API
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Authentication</h3>
                  <p className="text-sm text-blue-700">
                    Uses Firebase Auth with JWT tokens for secure API access.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">Education</h3>
                  <p className="text-sm text-green-700">
                    Quiz submissions, assignments, and progress tracking endpoints.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium text-purple-900 mb-2">Administration</h3>
                  <p className="text-sm text-purple-700">
                    Dashboard metrics, user management, and system monitoring.
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-medium text-orange-900 mb-2">Monitoring</h3>
                  <p className="text-sm text-orange-700">
                    Health checks, performance metrics, and system status.
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  This documentation is generated automatically from the API schemas and provides 
                  interactive testing capabilities. All endpoints use standardized response formats 
                  with comprehensive error handling and validation.
                </p>
              </div>
            </div>
          </div>

          {/* Swagger UI Container */}
          <div className="mx-4">
            <div id="swagger-ui" className="bg-white rounded-lg shadow-sm"></div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                © 2024 alloui by CBL - Basketball Coaching Platform
              </div>
              <div className="flex space-x-6">
                <a href="/api/docs/openapi.json" className="text-sm text-blue-600 hover:text-blue-500">
                  OpenAPI Spec
                </a>
                <a href="/api/health" className="text-sm text-blue-600 hover:text-blue-500">
                  System Health
                </a>
                <a href="/" className="text-sm text-blue-600 hover:text-blue-500">
                  Platform Home
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        /* Custom Swagger UI styles */
        .swagger-ui .info .title {
          color: #1f2937;
        }
        
        .swagger-ui .scheme-container {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
        }
        
        .swagger-ui .opblock-tag {
          border-bottom: 1px solid #e5e7eb;
        }
        
        .swagger-ui .opblock.opblock-post {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }
        
        .swagger-ui .opblock.opblock-get {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }
        
        .swagger-ui .opblock.opblock-put {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }
        
        .swagger-ui .opblock.opblock-delete {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }
      `}</style>
    </>
  );
}

// This page requires authentication in production
export async function getServerSideProps(context) {
  // In development, allow access without auth
  if (process.env.NODE_ENV === 'development') {
    return { props: {} };
  }

  // In production, require authentication
  try {
    const { getUserFromRequest } = await import('../config/firebaseAdmin');
    const user = await getUserFromRequest(context.req);

    if (!user) {
      return {
        redirect: {
          destination: '/auth/login?returnTo=/api-docs',
          permanent: false,
        },
      };
    }

    // Check if user has admin role for API docs access
    // For now, check if user email is admin or has admin custom claims
    const isAdmin = user.email === 'admin@maba.org' || user.customClaims?.admin === true;
    
    if (!isAdmin) {
      return {
        redirect: {
          destination: '/?error=access_denied',
          permanent: false,
        },
      };
    }

    return { props: {} };
  } catch (error) {
    // If authentication fails, redirect to login
    return {
      redirect: {
        destination: '/auth/login?returnTo=/api-docs',
        permanent: false,
      },
    };
  }
}