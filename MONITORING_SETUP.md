# CBL-MAIKOSH Error Management & Monitoring System

This document provides comprehensive setup and usage instructions for the production-grade error handling, monitoring, and observability systems implemented for the CBL-MAIKOSH basketball coaching platform.

## 🚀 Features Implemented

### 1. React Error Boundary System
- **Global Error Boundary**: Catches all unhandled React errors
- **Module Error Boundary**: Specific error handling for learning modules
- **Quiz Error Boundary**: Specialized error handling for quiz components
- **Graceful fallback UI** with user-friendly error messages
- **Error reporting** with unique error IDs for support tracking

### 2. Production Error Tracking
- **Sentry Integration**: Complete error tracking with context
- **Google Analytics**: Error events and performance metrics
- **LogRocket Integration**: Session replay for debugging
- **Structured Error Reporting**: Consistent error classification and severity levels
- **Real User Monitoring (RUM)**: Performance and user experience tracking

### 3. Health Check Infrastructure
- **Basic Health Check** (`/api/health`): Load balancer compatible endpoint
- **Detailed Health Check** (`/api/health/detailed`): Admin-only comprehensive diagnostics
- **Metrics Endpoint** (`/api/health/metrics`): Prometheus-compatible metrics
- **System Status Monitoring**: Memory, CPU, database, and service health

### 4. Enhanced Error Handling Patterns
- **API Error Middleware**: Consistent error responses across all endpoints
- **React Hooks**: `useErrorHandler` and `useApiError` for component-level error handling
- **Automatic Retry Logic**: Smart retry strategies for transient failures
- **Loading States**: User feedback during operations
- **Error Classification**: Automatic categorization and severity assessment

### 5. Performance Monitoring & Analytics
- **Core Web Vitals**: LCP, FID, CLS tracking
- **User Session Tracking**: Engagement and behavior analytics
- **Educational Progress Tracking**: Learning effectiveness metrics
- **Performance Alerts**: Automatic threshold-based alerting

### 6. Administrative Dashboard & Alerting
- **Real-time Dashboard** (`/api/admin/dashboard`): System metrics and KPIs
- **Alerting System** (`/api/admin/alerts`): Threshold-based alerts with notifications
- **Educational Analytics**: Learning outcomes and effectiveness tracking

## 📦 Required Dependencies

Add these dependencies to your `package.json`:

```json
{
  "dependencies": {
    "@sentry/nextjs": "^7.80.0",
    "@sentry/tracing": "^7.80.0",
    "logrocket": "^7.0.0"
  },
  "devDependencies": {
    "@sentry/webpack-plugin": "^2.7.0"
  }
}
```

## 🔧 Environment Variables Setup

Create or update your `.env.local` file with the following variables:

```bash
# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_google_analytics_id
NEXT_PUBLIC_LOGROCKET_ID=your_logrocket_app_id

# Application
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production

# Admin Access (for monitoring endpoints)
ADMIN_ACCESS_KEY=your_secure_admin_key
```

## 🛠️ Setup Instructions

### 1. Sentry Setup

1. Create a Sentry account at [sentry.io](https://sentry.io)
2. Create a new project for your Next.js application
3. Copy the DSN from your project settings
4. Create a `.sentryclirc` file in your project root:

```ini
[auth]
token=your_sentry_auth_token

[defaults]
org=your_sentry_org
project=your_sentry_project
```

5. Create `sentry.client.config.js`:

```javascript
import { init } from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
});
```

6. Create `sentry.server.config.js`:

```javascript
import { init } from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
});
```

### 2. Google Analytics Setup

1. Create a Google Analytics 4 property
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add the GA script to `_document.js`:

```javascript
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### 3. LogRocket Setup (Optional)

1. Sign up for LogRocket at [logrocket.com](https://logrocket.com)
2. Create a new application
3. Get your App ID
4. LogRocket will be automatically initialized by the error tracking system

### 4. Health Check Setup for Load Balancers

Configure your load balancer to use the health check endpoint:

- **Health Check URL**: `https://yourdomain.com/api/health`
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Healthy Threshold**: 2 consecutive successes
- **Unhealthy Threshold**: 3 consecutive failures

### 5. Monitoring Integration

#### Prometheus Integration
The `/api/health/metrics` endpoint provides Prometheus-compatible metrics:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'cbl-maikosh'
    static_configs:
      - targets: ['yourdomain.com']
    metrics_path: '/api/health/metrics'
    scrape_interval: 30s
```

#### Grafana Dashboard
Import the provided Grafana dashboard template (create `grafana-dashboard.json`).

## 📊 Usage Examples

### Using Error Boundaries in Components

```javascript
import { QuizErrorBoundary } from '../components/ErrorBoundary';
import AssessmentQuiz from './AssessmentQuiz';

function ModulePage({ user, module }) {
  return (
    <div>
      <h1>{module.title}</h1>
      
      <QuizErrorBoundary userId={user.id}>
        <AssessmentQuiz 
          questions={module.quiz}
          userId={user.id}
          moduleId={module.id}
        />
      </QuizErrorBoundary>
    </div>
  );
}
```

### Using API Error Hook

```javascript
import { useQuizSubmission } from '../hooks/useApiError';

function QuizComponent({ quiz, userId, moduleId }) {
  const { submitQuiz, isLoading, error, retry } = useQuizSubmission(userId, moduleId);

  const handleSubmit = async (answers) => {
    try {
      const result = await submitQuiz({
        answers,
        startTime: quiz.startTime,
        endTime: Date.now()
      });
      
      console.log('Quiz submitted successfully:', result);
    } catch (error) {
      // Error is automatically handled and displayed
      console.error('Quiz submission failed:', error);
    }
  };

  return (
    <div>
      {error && (
        <div className="error-banner">
          {error.message}
          {error.retryable && (
            <button onClick={() => retry(handleSubmit)}>
              Try Again
            </button>
          )}
        </div>
      )}
      
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit Quiz'}
      </button>
    </div>
  );
}
```

### Custom Error Tracking

```javascript
import errorTracker from '../utils/errorTracking';

function handleCustomError() {
  try {
    // Your code here
  } catch (error) {
    const errorId = errorTracker.reportError(error, 'Custom Operation', userId, {
      operation: 'data_processing',
      dataSize: data.length
    });
    
    console.log('Error reported with ID:', errorId);
  }
}
```

### Performance Tracking

```javascript
import performanceMonitor from '../utils/performanceMonitoring';

function trackLearningInteraction(moduleId, interactionType) {
  performanceMonitor.trackUserAction('learning_interaction', {
    moduleId,
    interactionType,
    timestamp: Date.now()
  });
}
```

## 🔍 Monitoring Endpoints

### Health Check Endpoints

- **Basic Health**: `GET /api/health`
  - Returns: System status, uptime, basic metrics
  - Use: Load balancer health checks

- **Detailed Health**: `GET /api/health/detailed` (Admin only)
  - Returns: Comprehensive system diagnostics
  - Use: Administrative monitoring

- **Metrics**: `GET /api/health/metrics`
  - Returns: Prometheus-compatible metrics
  - Use: Metrics collection systems

### Administrative Endpoints (Admin Auth Required)

- **Dashboard**: `GET /api/admin/dashboard`
  - Returns: Real-time system metrics and KPIs
  - Query params: `timeframe`, `metrics`

- **Alerts**: `GET /api/admin/alerts`
  - Returns: System alerts and notifications
  - Support: GET, POST, PUT, DELETE operations

## 🚨 Alerting Thresholds

### System Alerts
- **Memory Usage**: Warning >70%, Critical >85%
- **CPU Usage**: Warning >60%, Critical >80%
- **Response Time**: Warning >2s, Critical >5s
- **Error Rate**: Warning >5%, Critical >10%

### Educational Alerts
- **Completion Rate**: Warning <50%, Critical <30%
- **Quiz Performance**: Warning <60%, Critical <50%
- **User Engagement**: Warning <50%, Critical <30%

### Business Alerts
- **Daily Active Users**: Warning -10%, Critical -25%
- **Session Duration**: Warning -20%, Critical -40%
- **Conversion Rate**: Warning -15%, Critical -30%

## 🔐 Security Considerations

1. **Admin Endpoints**: All admin endpoints require authentication and role-based access control
2. **Error Information**: Sensitive information is sanitized before logging
3. **Rate Limiting**: Health check and metrics endpoints have rate limiting
4. **CORS**: Monitoring endpoints have appropriate CORS policies
5. **Data Privacy**: User data is anonymized in error reports

## 📈 Performance Impact

- **Error Boundaries**: Minimal performance impact
- **Error Tracking**: <1% performance overhead
- **Health Checks**: Cached responses reduce database load
- **Monitoring**: Background processing with minimal user-facing impact

## 🛠️ Troubleshooting

### Common Issues

1. **Sentry not receiving errors**: Check DSN configuration and network connectivity
2. **Health check failures**: Verify database connectivity and Firebase configuration
3. **Missing metrics**: Ensure Prometheus scraping configuration is correct
4. **Admin access denied**: Verify user roles in Auth0 configuration

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
LOG_LEVEL=debug
```

## 📚 Additional Resources

- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Prometheus Metrics](https://prometheus.io/docs/concepts/metric_types/)
- [Next.js Error Handling](https://nextjs.org/docs/advanced-features/error-handling)

---

**Note**: This monitoring system is designed for production use and includes comprehensive error handling, performance monitoring, and alerting capabilities. Regular review and updates of thresholds and configurations are recommended based on your specific usage patterns and requirements.