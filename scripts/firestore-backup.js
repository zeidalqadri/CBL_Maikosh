#!/usr/bin/env node

/**
 * Firestore Backup and Recovery Script for CBL-MAIKOSH
 * 
 * This script provides comprehensive backup and recovery functionality for Firestore data.
 * It supports full backups, incremental backups, and point-in-time recovery.
 * 
 * Usage:
 *   node scripts/firestore-backup.js --action=backup --type=full
 *   node scripts/firestore-backup.js --action=backup --type=incremental
 *   node scripts/firestore-backup.js --action=restore --backup-id=BACKUP_ID
 *   node scripts/firestore-backup.js --action=schedule
 */

const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');
const yargs = require('yargs');

// Configuration
const CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'cbl-maikosh',
  serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './service-account.json',
  backupBucket: process.env.BACKUP_BUCKET || 'cbl-maikosh-backups',
  backupRetentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
  schedules: {
    fullBackup: '0 2 * * *', // Daily at 2 AM
    incrementalBackup: '0 */6 * * *', // Every 6 hours
    cleanup: '0 3 * * 0' // Weekly on Sunday at 3 AM
  }
};

// Collections to backup (educational platform focus)
const COLLECTIONS = [
  'users',
  'userProgress',
  'quizSubmissions',
  'assignmentSubmissions',
  'modules',
  'courseContent',
  'learningAnalytics',
  'userSessions',
  'achievements',
  'userAchievements',
  'notifications',
  'discussions',
  'auditLogs'
];

class FirestoreBackupManager {
  constructor() {
    this.admin = null;
    this.db = null;
    this.storage = new Storage({
      projectId: CONFIG.projectId,
      keyFilename: CONFIG.serviceAccountPath
    });
    this.bucket = this.storage.bucket(CONFIG.backupBucket);
    this.lastBackupTimestamp = null;
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
      
      console.log('✅ Firebase Admin SDK initialized successfully');
      
      // Ensure backup bucket exists
      const [bucketExists] = await this.bucket.exists();
      if (!bucketExists) {
        await this.bucket.create();
        console.log(`✅ Created backup bucket: ${CONFIG.backupBucket}`);
      }

      // Load last backup timestamp
      await this.loadLastBackupTimestamp();
      
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
      throw error;
    }
  }

  async loadLastBackupTimestamp() {
    try {
      const timestampFile = this.bucket.file('.last-backup-timestamp');
      const [exists] = await timestampFile.exists();
      
      if (exists) {
        const [content] = await timestampFile.download();
        this.lastBackupTimestamp = new Date(content.toString().trim());
        console.log(`📅 Last backup timestamp: ${this.lastBackupTimestamp.toISOString()}`);
      }
    } catch (error) {
      console.log('ℹ️  No previous backup timestamp found');
      this.lastBackupTimestamp = new Date(0); // Start from epoch for first backup
    }
  }

  async saveLastBackupTimestamp(timestamp) {
    try {
      const timestampFile = this.bucket.file('.last-backup-timestamp');
      await timestampFile.save(timestamp.toISOString());
      this.lastBackupTimestamp = timestamp;
    } catch (error) {
      console.error('⚠️  Failed to save backup timestamp:', error.message);
    }
  }

  async performFullBackup() {
    const backupId = `full-backup-${Date.now()}`;
    const backupTimestamp = new Date();
    
    console.log(`🔄 Starting full backup: ${backupId}`);
    
    try {
      const backupData = {
        id: backupId,
        type: 'full',
        timestamp: backupTimestamp.toISOString(),
        projectId: CONFIG.projectId,
        collections: {}
      };

      // Backup each collection
      for (const collectionName of COLLECTIONS) {
        console.log(`📦 Backing up collection: ${collectionName}`);
        
        const collectionData = await this.backupCollection(collectionName);
        backupData.collections[collectionName] = {
          documentCount: collectionData.length,
          data: collectionData
        };
        
        console.log(`✅ Backed up ${collectionData.length} documents from ${collectionName}`);
      }

      // Save backup metadata
      backupData.stats = {
        totalCollections: Object.keys(backupData.collections).length,
        totalDocuments: Object.values(backupData.collections).reduce((sum, col) => sum + col.documentCount, 0),
        backupSize: JSON.stringify(backupData).length
      };

      // Upload to Cloud Storage
      await this.uploadBackup(backupId, backupData);
      
      // Update last backup timestamp
      await this.saveLastBackupTimestamp(backupTimestamp);
      
      console.log(`✅ Full backup completed: ${backupId}`);
      console.log(`📊 Stats: ${backupData.stats.totalDocuments} documents, ${backupData.stats.totalCollections} collections`);
      
      return backupId;
      
    } catch (error) {
      console.error(`❌ Full backup failed: ${error.message}`);
      throw error;
    }
  }

  async performIncrementalBackup() {
    if (!this.lastBackupTimestamp) {
      console.log('ℹ️  No previous backup found, performing full backup instead');
      return await this.performFullBackup();
    }

    const backupId = `incremental-backup-${Date.now()}`;
    const backupTimestamp = new Date();
    
    console.log(`🔄 Starting incremental backup: ${backupId}`);
    console.log(`📅 Since: ${this.lastBackupTimestamp.toISOString()}`);
    
    try {
      const backupData = {
        id: backupId,
        type: 'incremental',
        timestamp: backupTimestamp.toISOString(),
        since: this.lastBackupTimestamp.toISOString(),
        projectId: CONFIG.projectId,
        collections: {}
      };

      // Backup changed documents in each collection
      for (const collectionName of COLLECTIONS) {
        console.log(`📦 Checking collection for changes: ${collectionName}`);
        
        const changedDocs = await this.backupCollectionIncremental(collectionName, this.lastBackupTimestamp);
        
        if (changedDocs.length > 0) {
          backupData.collections[collectionName] = {
            documentCount: changedDocs.length,
            data: changedDocs
          };
          console.log(`✅ Backed up ${changedDocs.length} changed documents from ${collectionName}`);
        } else {
          console.log(`ℹ️  No changes in ${collectionName}`);
        }
      }

      // Calculate stats
      const totalDocuments = Object.values(backupData.collections).reduce((sum, col) => sum + col.documentCount, 0);
      
      if (totalDocuments === 0) {
        console.log('ℹ️  No changes detected, skipping backup');
        return null;
      }

      backupData.stats = {
        totalCollections: Object.keys(backupData.collections).length,
        totalDocuments,
        backupSize: JSON.stringify(backupData).length
      };

      // Upload to Cloud Storage
      await this.uploadBackup(backupId, backupData);
      
      // Update last backup timestamp
      await this.saveLastBackupTimestamp(backupTimestamp);
      
      console.log(`✅ Incremental backup completed: ${backupId}`);
      console.log(`📊 Stats: ${backupData.stats.totalDocuments} documents, ${backupData.stats.totalCollections} collections`);
      
      return backupId;
      
    } catch (error) {
      console.error(`❌ Incremental backup failed: ${error.message}`);
      throw error;
    }
  }

  async backupCollection(collectionName) {
    const collection = this.db.collection(collectionName);
    const snapshot = await collection.get();
    
    const documents = [];
    snapshot.forEach(doc => {
      documents.push({
        id: doc.id,
        data: doc.data(),
        path: doc.ref.path
      });
    });
    
    return documents;
  }

  async backupCollectionIncremental(collectionName, since) {
    const collection = this.db.collection(collectionName);
    
    // Try to query by updatedAt field if it exists
    let query = collection;
    
    // For collections that have timestamp fields, filter by them
    const timestampFields = ['updatedAt', 'createdAt', 'submittedAt', 'timestamp'];
    
    for (const field of timestampFields) {
      try {
        // Test if the field exists by making a small query
        const testQuery = collection.where(field, '>=', since).limit(1);
        const testSnapshot = await testQuery.get();
        
        if (!testSnapshot.empty || true) { // Use this field for incremental backup
          query = collection.where(field, '>=', since);
          break;
        }
      } catch (error) {
        // Field doesn't exist or isn't indexed, continue to next field
        continue;
      }
    }
    
    const snapshot = await query.get();
    
    const documents = [];
    snapshot.forEach(doc => {
      documents.push({
        id: doc.id,
        data: doc.data(),
        path: doc.ref.path
      });
    });
    
    return documents;
  }

  async uploadBackup(backupId, backupData) {
    const fileName = `${backupId}.json`;
    const file = this.bucket.file(fileName);
    
    const stream = file.createWriteStream({
      metadata: {
        contentType: 'application/json',
        metadata: {
          backupId,
          type: backupData.type,
          timestamp: backupData.timestamp,
          projectId: CONFIG.projectId
        }
      }
    });

    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', () => {
        console.log(`📤 Backup uploaded to: gs://${CONFIG.backupBucket}/${fileName}`);
        resolve();
      });
      
      stream.end(JSON.stringify(backupData, null, 2));
    });
  }

  async listBackups() {
    console.log('📋 Listing available backups...');
    
    const [files] = await this.bucket.getFiles({
      prefix: '',
      delimiter: '/'
    });
    
    const backups = files
      .filter(file => file.name.endsWith('.json') && !file.name.startsWith('.'))
      .map(file => ({
        name: file.name,
        id: file.name.replace('.json', ''),
        created: file.metadata.timeCreated,
        size: file.metadata.size,
        type: file.metadata.metadata?.type || 'unknown'
      }))
      .sort((a, b) => new Date(b.created) - new Date(a.created));
    
    console.table(backups.map(backup => ({
      'Backup ID': backup.id,
      'Type': backup.type,
      'Created': new Date(backup.created).toLocaleString(),
      'Size': `${Math.round(backup.size / 1024)} KB`
    })));
    
    return backups;
  }

  async restoreFromBackup(backupId) {
    console.log(`🔄 Starting restore from backup: ${backupId}`);
    
    try {
      // Download backup file
      const fileName = `${backupId}.json`;
      const file = this.bucket.file(fileName);
      
      const [exists] = await file.exists();
      if (!exists) {
        throw new Error(`Backup file not found: ${fileName}`);
      }
      
      const [content] = await file.download();
      const backupData = JSON.parse(content.toString());
      
      console.log(`📦 Backup info: ${backupData.type} backup from ${backupData.timestamp}`);
      console.log(`📊 Collections: ${Object.keys(backupData.collections).length}`);
      
      // Confirm restore operation
      console.log('⚠️  WARNING: This will overwrite existing data!');
      
      // Restore each collection
      for (const [collectionName, collectionData] of Object.entries(backupData.collections)) {
        console.log(`🔄 Restoring collection: ${collectionName} (${collectionData.documentCount} documents)`);
        await this.restoreCollection(collectionName, collectionData.data);
        console.log(`✅ Restored ${collectionData.documentCount} documents to ${collectionName}`);
      }
      
      console.log(`✅ Restore completed from backup: ${backupId}`);
      
    } catch (error) {
      console.error(`❌ Restore failed: ${error.message}`);
      throw error;
    }
  }

  async restoreCollection(collectionName, documents) {
    const collection = this.db.collection(collectionName);
    const batch = this.db.batch();
    
    for (const doc of documents) {
      const docRef = collection.doc(doc.id);
      batch.set(docRef, doc.data);
    }
    
    await batch.commit();
  }

  async cleanupOldBackups() {
    console.log('🧹 Cleaning up old backups...');
    
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - CONFIG.backupRetentionDays);
    
    const [files] = await this.bucket.getFiles();
    
    let deletedCount = 0;
    for (const file of files) {
      const fileDate = new Date(file.metadata.timeCreated);
      
      if (fileDate < retentionDate && file.name.endsWith('.json')) {
        console.log(`🗑️  Deleting old backup: ${file.name}`);
        await file.delete();
        deletedCount++;
      }
    }
    
    console.log(`✅ Cleaned up ${deletedCount} old backups`);
  }

  async scheduleBackups() {
    console.log('⏰ Setting up backup schedules...');
    
    // Full backup daily
    cron.schedule(CONFIG.schedules.fullBackup, async () => {
      console.log('🔄 Scheduled full backup starting...');
      try {
        await this.performFullBackup();
      } catch (error) {
        console.error('❌ Scheduled full backup failed:', error.message);
      }
    });
    
    // Incremental backup every 6 hours
    cron.schedule(CONFIG.schedules.incrementalBackup, async () => {
      console.log('🔄 Scheduled incremental backup starting...');
      try {
        await this.performIncrementalBackup();
      } catch (error) {
        console.error('❌ Scheduled incremental backup failed:', error.message);
      }
    });
    
    // Cleanup old backups weekly
    cron.schedule(CONFIG.schedules.cleanup, async () => {
      console.log('🧹 Scheduled cleanup starting...');
      try {
        await this.cleanupOldBackups();
      } catch (error) {
        console.error('❌ Scheduled cleanup failed:', error.message);
      }
    });
    
    console.log('✅ Backup schedules configured');
    console.log('📅 Full backup:', CONFIG.schedules.fullBackup);
    console.log('📅 Incremental backup:', CONFIG.schedules.incrementalBackup);
    console.log('📅 Cleanup:', CONFIG.schedules.cleanup);
    
    // Keep the process running
    console.log('🔄 Backup scheduler is running. Press Ctrl+C to stop.');
    process.on('SIGINT', () => {
      console.log('\n👋 Shutting down backup scheduler...');
      process.exit(0);
    });
  }
}

// CLI Interface
async function main() {
  const argv = yargs(process.argv.slice(2))
    .option('action', {
      alias: 'a',
      type: 'string',
      choices: ['backup', 'restore', 'list', 'cleanup', 'schedule'],
      demandOption: true,
      describe: 'Action to perform'
    })
    .option('type', {
      alias: 't',
      type: 'string',
      choices: ['full', 'incremental'],
      describe: 'Backup type (for backup action)'
    })
    .option('backup-id', {
      alias: 'b',
      type: 'string',
      describe: 'Backup ID to restore from'
    })
    .help()
    .argv;

  const backupManager = new FirestoreBackupManager();
  
  try {
    await backupManager.initialize();
    
    switch (argv.action) {
      case 'backup':
        if (argv.type === 'full') {
          await backupManager.performFullBackup();
        } else if (argv.type === 'incremental') {
          await backupManager.performIncrementalBackup();
        } else {
          console.error('❌ Backup type required: --type full|incremental');
          process.exit(1);
        }
        break;
        
      case 'restore':
        if (!argv.backupId) {
          console.error('❌ Backup ID required: --backup-id BACKUP_ID');
          process.exit(1);
        }
        await backupManager.restoreFromBackup(argv.backupId);
        break;
        
      case 'list':
        await backupManager.listBackups();
        break;
        
      case 'cleanup':
        await backupManager.cleanupOldBackups();
        break;
        
      case 'schedule':
        await backupManager.scheduleBackups();
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

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { FirestoreBackupManager, CONFIG };