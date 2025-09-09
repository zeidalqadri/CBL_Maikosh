#!/usr/bin/env node

/**
 * Firebase Performance Monitoring Setup for CBL-MAIKOSH
 * 
 * This script sets up comprehensive performance monitoring for Firebase/Firestore
 * including custom traces, database performance metrics, and alerting.
 * 
 * Usage:
 *   node scripts/performance-monitoring.js --action=setup
 *   node scripts/performance-monitoring.js --action=monitor
 *   node scripts/performance-monitoring.js --action=report
 */

const admin = require('firebase-admin');
const { Monitoring } = require('@google-cloud/monitoring');
const fs = require('fs').promises;
const path = require('path');
const yargs = require('yargs');

// Configuration
const CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'cbl-maikosh',
  serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './service-account.json',
  monitoringInterval: parseInt(process.env.MONITORING_INTERVAL || '60000'), // 1 minute
  alertThresholds: {
    responseTime: parseInt(process.env.ALERT_RESPONSE_TIME || '2000'), // 2 seconds
    errorRate: parseFloat(process.env.ALERT_ERROR_RATE || '0.05'), // 5%
    connectionCount: parseInt(process.env.ALERT_CONNECTION_COUNT || '1000'),
    queryLatency: parseInt(process.env.ALERT_QUERY_LATENCY || '1000'), // 1 second
    writeLatency: parseInt(process.env.ALERT_WRITE_LATENCY || '2000'), // 2 seconds
    readLatency: parseInt(process.env.ALERT_READ_LATENCY || '500') // 500ms
  },
  educationalMetrics: {
    maxQuizResponseTime: 3000,
    maxProgressUpdateTime: 2000,
    maxModuleLoadTime: 5000,
    maxAnalyticsProcessingTime: 1500
  }
};

class FirebasePerformanceMonitor {
  constructor() {
    this.admin = null;
    this.db = null;
    this.monitoring = new Monitoring.MetricServiceClient({
      projectId: CONFIG.projectId,
      keyFilename: CONFIG.serviceAccountPath
    });
    this.metrics = new Map();
    this.isMonitoring = false;
  }

  async initialize() {
    try {
      // Initialize Firebase Admin SDK
      const serviceAccount = JSON.parse(await fs.readFile(CONFIG.serviceAccountPath, 'utf8'));
      
      this.admin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: CONFIG.projectId
      });

      this.db = this.admin.firestore();
      
      console.log('✅ Firebase Performance Monitor initialized successfully');
      
      // Setup custom metric descriptors
      await this.setupMetricDescriptors();
      
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Performance Monitor:', error.message);
      throw error;
    }
  }

  async setupMetricDescriptors() {
    console.log('🔧 Setting up custom metric descriptors...');
    
    const customMetrics = [
      {
        type: 'custom.googleapis.com/firestore/quiz_submission_latency',
        displayName: 'Quiz Submission Latency',
        description: 'Time taken to process quiz submissions',
        metricKind: 'GAUGE',
        valueType: 'DOUBLE',
        unit: 'ms'
      },
      {
        type: 'custom.googleapis.com/firestore/progress_update_latency',
        displayName: 'Progress Update Latency',
        description: 'Time taken to update user progress',
        metricKind: 'GAUGE',
        valueType: 'DOUBLE',
        unit: 'ms'
      },
      {
        type: 'custom.googleapis.com/firestore/module_load_time',
        displayName: 'Module Load Time',
        description: 'Time taken to load module data',
        metricKind: 'GAUGE',
        valueType: 'DOUBLE',
        unit: 'ms'
      },
      {
        type: 'custom.googleapis.com/firestore/concurrent_users',
        displayName: 'Concurrent Active Users',
        description: 'Number of concurrently active users',
        metricKind: 'GAUGE',
        valueType: 'INT64'
      },
      {
        type: 'custom.googleapis.com/firestore/educational_analytics_processing',
        displayName: 'Educational Analytics Processing Time',
        description: 'Time taken to process educational analytics',
        metricKind: 'GAUGE',
        valueType: 'DOUBLE',
        unit: 'ms'
      },
      {
        type: 'custom.googleapis.com/firestore/database_connection_pool',
        displayName: 'Database Connection Pool Usage',
        description: 'Usage percentage of database connection pool',
        metricKind: 'GAUGE',
        valueType: 'DOUBLE',
        unit: '%'
      },
      {
        type: 'custom.googleapis.com/education/quiz_completion_rate',
        displayName: 'Quiz Completion Rate',
        description: 'Percentage of started quizzes that are completed',
        metricKind: 'GAUGE',
        valueType: 'DOUBLE',
        unit: '%'
      },
      {
        type: 'custom.googleapis.com/education/module_engagement_time',
        displayName: 'Module Engagement Time',
        description: 'Average time users spend on modules',
        metricKind: 'GAUGE',
        valueType: 'DOUBLE',
        unit: 's'
      }
    ];

    for (const metric of customMetrics) {
      try {
        await this.createMetricDescriptor(metric);
      } catch (error) {
        if (error.code === 6) { // ALREADY_EXISTS
          console.log(`ℹ️  Metric descriptor already exists: ${metric.displayName}`);
        } else {
          console.error(`❌ Failed to create metric descriptor ${metric.displayName}:`, error.message);
        }
      }
    }

    console.log('✅ Custom metric descriptors setup completed');
  }

  async createMetricDescriptor(metric) {
    const projectPath = this.monitoring.projectPath(CONFIG.projectId);
    
    const request = {
      name: projectPath,
      metricDescriptor: {
        type: metric.type,
        displayName: metric.displayName,
        description: metric.description,
        metricKind: metric.metricKind,
        valueType: metric.valueType,
        unit: metric.unit,
        labels: [
          {
            key: 'module_id',
            valueType: 'STRING',
            description: 'Module identifier'
          },
          {
            key: 'user_role',
            valueType: 'STRING',
            description: 'User role (student, instructor, admin)'
          },
          {
            key: 'operation_type',
            valueType: 'STRING',
            description: 'Type of database operation'
          }
        ]
      }
    };

    await this.monitoring.createMetricDescriptor(request);
    console.log(`✅ Created metric descriptor: ${metric.displayName}`);
  }

  async startMonitoring() {
    console.log('🚀 Starting performance monitoring...');
    this.isMonitoring = true;

    // Monitor different aspects of the system
    const monitoringTasks = [
      this.monitorDatabasePerformance(),
      this.monitorEducationalMetrics(),
      this.monitorUserActivity(),
      this.monitorSystemResources(),
      this.monitorErrorRates(),
      this.monitorCustomTraces()
    ];

    // Run all monitoring tasks concurrently
    await Promise.allSettled(monitoringTasks);
  }

  async monitorDatabasePerformance() {
    console.log('📊 Starting database performance monitoring...');

    while (this.isMonitoring) {
      try {
        // Monitor query performance
        const queryStartTime = Date.now();
        
        // Test query for quiz submissions (common operation)
        const recentSubmissions = await this.db.collection('quizSubmissions')
          .orderBy('submittedAt', 'desc')
          .limit(10)
          .get();
        
        const queryLatency = Date.now() - queryStartTime;
        
        await this.recordMetric(
          'custom.googleapis.com/firestore/quiz_submission_latency',
          queryLatency,
          { operation_type: 'read' }
        );

        // Monitor write performance
        const writeStartTime = Date.now();
        const testDoc = this.db.collection('system').doc('performance-test');
        await testDoc.set({ timestamp: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
        const writeLatency = Date.now() - writeStartTime;

        await this.recordMetric(
          'custom.googleapis.com/firestore/progress_update_latency',
          writeLatency,
          { operation_type: 'write' }
        );

        // Check for performance alerts
        if (queryLatency > CONFIG.alertThresholds.readLatency) {
          await this.triggerAlert('High Query Latency', `Query latency: ${queryLatency}ms`);
        }

        if (writeLatency > CONFIG.alertThresholds.writeLatency) {
          await this.triggerAlert('High Write Latency', `Write latency: ${writeLatency}ms`);
        }

      } catch (error) {
        console.error('❌ Database performance monitoring error:', error.message);
        await this.recordError('database_performance_monitoring', error);
      }

      await this.sleep(CONFIG.monitoringInterval);
    }
  }

  async monitorEducationalMetrics() {
    console.log('🎓 Starting educational metrics monitoring...');

    while (this.isMonitoring) {
      try {
        // Monitor quiz completion rates
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        // Get quiz attempts in the last hour
        const quizAttempts = await this.db.collection('quizSubmissions')
          .where('submittedAt', '>=', oneHourAgo.toISOString())
          .get();

        const totalAttempts = quizAttempts.size;
        const completedQuizzes = quizAttempts.docs.filter(doc => 
          doc.data().percentage >= 70 // Passing grade
        ).length;

        const completionRate = totalAttempts > 0 ? (completedQuizzes / totalAttempts) * 100 : 100;

        await this.recordMetric(
          'custom.googleapis.com/education/quiz_completion_rate',
          completionRate
        );

        // Monitor module engagement
        const userSessions = await this.db.collection('userSessions')
          .where('startTime', '>=', admin.firestore.Timestamp.fromDate(oneHourAgo))
          .get();

        if (!userSessions.empty) {
          const totalEngagementTime = userSessions.docs.reduce((sum, doc) => {
            const data = doc.data();
            return sum + (data.duration || 0);
          }, 0);

          const avgEngagementTime = totalEngagementTime / userSessions.size / 1000; // Convert to seconds

          await this.recordMetric(
            'custom.googleapis.com/education/module_engagement_time',
            avgEngagementTime
          );
        }

        // Monitor concurrent users
        const activeUsers = await this.db.collection('userSessions')
          .where('startTime', '>=', admin.firestore.Timestamp.fromDate(new Date(now.getTime() - 5 * 60 * 1000)))
          .get();

        await this.recordMetric(
          'custom.googleapis.com/firestore/concurrent_users',
          activeUsers.size
        );

      } catch (error) {
        console.error('❌ Educational metrics monitoring error:', error.message);
        await this.recordError('educational_metrics_monitoring', error);
      }

      await this.sleep(CONFIG.monitoringInterval * 2); // Monitor educational metrics less frequently
    }
  }

  async monitorUserActivity() {
    console.log('👥 Starting user activity monitoring...');

    while (this.isMonitoring) {
      try {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        // Monitor active user sessions
        const activeSessions = await this.db.collection('userSessions')
          .where('startTime', '>=', admin.firestore.Timestamp.fromDate(fiveMinutesAgo))
          .where('endTime', '==', null)
          .get();

        const activeUserCount = activeSessions.size;

        await this.recordMetric(
          'custom.googleapis.com/firestore/concurrent_users',
          activeUserCount
        );

        // Check for unusual activity patterns
        if (activeUserCount > CONFIG.alertThresholds.connectionCount) {
          await this.triggerAlert('High Concurrent Users', `Active users: ${activeUserCount}`);
        }

      } catch (error) {
        console.error('❌ User activity monitoring error:', error.message);
        await this.recordError('user_activity_monitoring', error);
      }

      await this.sleep(CONFIG.monitoringInterval);
    }
  }

  async monitorSystemResources() {
    console.log('💻 Starting system resource monitoring...');

    while (this.isMonitoring) {
      try {
        const memoryUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();

        // Monitor memory usage
        const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

        await this.recordMetric(
          'custom.googleapis.com/firestore/database_connection_pool',
          memoryUsagePercent
        );

        // Alert if memory usage is high
        if (memoryUsagePercent > 90) {
          await this.triggerAlert('High Memory Usage', `Memory usage: ${memoryUsagePercent.toFixed(2)}%`);
        }

      } catch (error) {
        console.error('❌ System resource monitoring error:', error.message);
        await this.recordError('system_resource_monitoring', error);
      }

      await this.sleep(CONFIG.monitoringInterval);
    }
  }

  async monitorErrorRates() {
    console.log('❌ Starting error rate monitoring...');

    while (this.isMonitoring) {
      try {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        // This would typically integrate with your error logging system
        // For now, we'll monitor based on failed operations

        // Check for failed quiz submissions (based on missing required fields)
        const failedOperations = await this.db.collection('auditLogs')
          .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(oneHourAgo))
          .where('level', '==', 'error')
          .get();

        const totalOperations = await this.db.collection('auditLogs')
          .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(oneHourAgo))
          .get();

        const errorRate = totalOperations.size > 0 ? 
          (failedOperations.size / totalOperations.size) : 0;

        if (errorRate > CONFIG.alertThresholds.errorRate) {
          await this.triggerAlert('High Error Rate', `Error rate: ${(errorRate * 100).toFixed(2)}%`);
        }

      } catch (error) {
        console.error('❌ Error rate monitoring error:', error.message);
        await this.recordError('error_rate_monitoring', error);
      }

      await this.sleep(CONFIG.monitoringInterval * 3); // Monitor error rates less frequently
    }
  }

  async monitorCustomTraces() {
    console.log('🔍 Starting custom trace monitoring...');

    while (this.isMonitoring) {
      try {
        // Simulate tracing critical educational operations
        await this.traceOperation('quiz_submission', async () => {
          const testQuery = this.db.collection('quizSubmissions').limit(1);
          await testQuery.get();
        });

        await this.traceOperation('progress_update', async () => {
          const testQuery = this.db.collection('userProgress').limit(1);
          await testQuery.get();
        });

        await this.traceOperation('module_content_load', async () => {
          const testQuery = this.db.collection('modules').limit(1);
          await testQuery.get();
        });

      } catch (error) {
        console.error('❌ Custom trace monitoring error:', error.message);
        await this.recordError('custom_trace_monitoring', error);
      }

      await this.sleep(CONFIG.monitoringInterval * 2);
    }
  }

  async traceOperation(operationName, operation) {
    const startTime = Date.now();
    
    try {
      await operation();
      const duration = Date.now() - startTime;
      
      // Record the trace duration
      const metricType = this.getMetricTypeForOperation(operationName);
      if (metricType) {
        await this.recordMetric(metricType, duration, { operation_type: operationName });
      }
      
      // Check against thresholds
      const threshold = this.getThresholdForOperation(operationName);
      if (duration > threshold) {
        await this.triggerAlert(
          `Slow ${operationName}`,
          `Operation took ${duration}ms (threshold: ${threshold}ms)`
        );
      }
      
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Traced operation ${operationName} failed after ${duration}ms:`, error.message);
      await this.recordError(`traced_${operationName}`, error);
    }
  }

  getMetricTypeForOperation(operationName) {
    const metricMap = {
      'quiz_submission': 'custom.googleapis.com/firestore/quiz_submission_latency',
      'progress_update': 'custom.googleapis.com/firestore/progress_update_latency',
      'module_content_load': 'custom.googleapis.com/firestore/module_load_time',
      'analytics_processing': 'custom.googleapis.com/firestore/educational_analytics_processing'
    };
    
    return metricMap[operationName];
  }

  getThresholdForOperation(operationName) {
    const thresholdMap = {
      'quiz_submission': CONFIG.educationalMetrics.maxQuizResponseTime,
      'progress_update': CONFIG.educationalMetrics.maxProgressUpdateTime,
      'module_content_load': CONFIG.educationalMetrics.maxModuleLoadTime,
      'analytics_processing': CONFIG.educationalMetrics.maxAnalyticsProcessingTime
    };
    
    return thresholdMap[operationName] || 2000;
  }

  async recordMetric(metricType, value, labels = {}) {
    try {
      const projectPath = this.monitoring.projectPath(CONFIG.projectId);
      
      const dataPoint = {
        interval: {
          endTime: {
            seconds: Math.floor(Date.now() / 1000)
          }
        },
        value: {
          doubleValue: typeof value === 'number' ? value : parseFloat(value)
        }
      };

      const timeSeriesData = {
        metric: {
          type: metricType,
          labels: labels
        },
        resource: {
          type: 'global',
          labels: {
            project_id: CONFIG.projectId
          }
        },
        points: [dataPoint]
      };

      const request = {
        name: projectPath,
        timeSeries: [timeSeriesData]
      };

      await this.monitoring.createTimeSeries(request);
      
    } catch (error) {
      console.error(`❌ Failed to record metric ${metricType}:`, error.message);
    }
  }

  async recordError(context, error) {
    try {
      // Record error in audit log for monitoring
      await this.db.collection('auditLogs').add({
        context,
        error: error.message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        level: 'error',
        type: 'performance_monitoring'
      });
    } catch (logError) {
      console.error('❌ Failed to record error:', logError.message);
    }
  }

  async triggerAlert(alertType, message) {
    console.warn(`🚨 ALERT: ${alertType} - ${message}`);
    
    try {
      // Record alert in database
      await this.db.collection('alerts').add({
        type: alertType,
        message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        severity: 'warning',
        resolved: false
      });

      // Here you would integrate with your alerting system
      // (Slack, email, PagerDuty, etc.)
      
    } catch (error) {
      console.error('❌ Failed to record alert:', error.message);
    }
  }

  async generatePerformanceReport() {
    console.log('📊 Generating performance report...');
    
    try {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const report = {
        generatedAt: now.toISOString(),
        period: '24 hours',
        metrics: {}
      };

      // Get performance metrics from the last 24 hours
      const alerts = await this.db.collection('alerts')
        .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(twentyFourHoursAgo))
        .orderBy('timestamp', 'desc')
        .get();

      report.alerts = {
        total: alerts.size,
        byType: {},
        recent: alerts.docs.slice(0, 10).map(doc => ({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().timestamp?.toDate?.()?.toISOString()
        }))
      };

      // Count alerts by type
      alerts.docs.forEach(doc => {
        const alertType = doc.data().type;
        report.alerts.byType[alertType] = (report.alerts.byType[alertType] || 0) + 1;
      });

      // Get error statistics
      const errorLogs = await this.db.collection('auditLogs')
        .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(twentyFourHoursAgo))
        .where('level', '==', 'error')
        .get();

      report.errors = {
        total: errorLogs.size,
        byContext: {}
      };

      errorLogs.docs.forEach(doc => {
        const context = doc.data().context;
        report.errors.byContext[context] = (report.errors.byContext[context] || 0) + 1;
      });

      // Get user activity statistics
      const userSessions = await this.db.collection('userSessions')
        .where('startTime', '>=', admin.firestore.Timestamp.fromDate(twentyFourHoursAgo))
        .get();

      const totalSessions = userSessions.size;
      const uniqueUsers = new Set(userSessions.docs.map(doc => doc.data().userId)).size;
      const totalDuration = userSessions.docs.reduce((sum, doc) => sum + (doc.data().duration || 0), 0);
      const avgSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

      report.userActivity = {
        totalSessions,
        uniqueUsers,
        avgSessionDuration: Math.round(avgSessionDuration / 1000 / 60), // minutes
      };

      // Get educational metrics
      const quizSubmissions = await this.db.collection('quizSubmissions')
        .where('submittedAt', '>=', twentyFourHoursAgo.toISOString())
        .get();

      const totalQuizzes = quizSubmissions.size;
      const passedQuizzes = quizSubmissions.docs.filter(doc => doc.data().percentage >= 70).length;
      const avgQuizScore = totalQuizzes > 0 ? 
        quizSubmissions.docs.reduce((sum, doc) => sum + (doc.data().percentage || 0), 0) / totalQuizzes : 0;

      report.educational = {
        totalQuizzes,
        passedQuizzes,
        passRate: totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0,
        avgQuizScore: Math.round(avgQuizScore)
      };

      // Save report
      const reportPath = path.join(process.cwd(), `performance-report-${Date.now()}.json`);
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      
      console.log(`✅ Performance report generated: ${reportPath}`);
      console.log('📊 Report Summary:');
      console.log(`   • Alerts: ${report.alerts.total}`);
      console.log(`   • Errors: ${report.errors.total}`);
      console.log(`   • Sessions: ${report.userActivity.totalSessions}`);
      console.log(`   • Quiz Pass Rate: ${report.educational.passRate}%`);
      
      return report;
      
    } catch (error) {
      console.error('❌ Failed to generate performance report:', error.message);
      throw error;
    }
  }

  async stopMonitoring() {
    console.log('🛑 Stopping performance monitoring...');
    this.isMonitoring = false;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI Interface
async function main() {
  const argv = yargs(process.argv.slice(2))
    .option('action', {
      alias: 'a',
      type: 'string',
      choices: ['setup', 'monitor', 'report', 'stop'],
      demandOption: true,
      describe: 'Action to perform'
    })
    .option('duration', {
      alias: 'd',
      type: 'number',
      describe: 'Monitoring duration in minutes (for monitor action)',
      default: 0 // 0 means run indefinitely
    })
    .help()
    .argv;

  const monitor = new FirebasePerformanceMonitor();
  
  try {
    await monitor.initialize();
    
    switch (argv.action) {
      case 'setup':
        console.log('✅ Performance monitoring setup completed');
        break;
        
      case 'monitor':
        if (argv.duration > 0) {
          console.log(`🔄 Starting monitoring for ${argv.duration} minutes...`);
          setTimeout(async () => {
            await monitor.stopMonitoring();
            console.log('⏰ Monitoring duration completed');
            process.exit(0);
          }, argv.duration * 60 * 1000);
        }
        
        await monitor.startMonitoring();
        break;
        
      case 'report':
        await monitor.generatePerformanceReport();
        break;
        
      case 'stop':
        await monitor.stopMonitoring();
        break;
        
      default:
        console.error('❌ Unknown action');
        process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Operation failed:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down performance monitoring...');
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { FirebasePerformanceMonitor, CONFIG };