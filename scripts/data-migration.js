#!/usr/bin/env node

/**
 * Data Migration and Seeding Utilities for CBL-MAIKOSH Firebase/Firestore
 * 
 * This script provides comprehensive data migration, validation, and seeding
 * capabilities for the basketball coaching education platform.
 * 
 * Usage:
 *   node scripts/data-migration.js --action=migrate --from=v1 --to=v2
 *   node scripts/data-migration.js --action=seed --environment=development
 *   node scripts/data-migration.js --action=validate
 *   node scripts/data-migration.js --action=export --collection=users
 *   node scripts/data-migration.js --action=import --file=data-export.json
 */

const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');
const yargs = require('yargs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Configuration
const CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'cbl-maikosh',
  serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './service-account.json',
  batchSize: parseInt(process.env.MIGRATION_BATCH_SIZE || '500'),
  maxRetries: parseInt(process.env.MIGRATION_MAX_RETRIES || '3'),
  retryDelay: parseInt(process.env.MIGRATION_RETRY_DELAY || '1000'),
  backupPath: './data-backups',
  seedDataPath: './seed-data',
  exportPath: './exports'
};

// Educational data schemas for validation
const SCHEMAS = {
  users: {
    required: ['email', 'name', 'role', 'createdAt'],
    optional: ['profileImage', 'bio', 'preferences', 'lastLoginAt', 'isActive'],
    types: {
      email: 'string',
      name: 'string',
      role: 'string',
      createdAt: 'timestamp',
      isActive: 'boolean'
    }
  },
  modules: {
    required: ['id', 'title', 'description', 'order', 'isActive'],
    optional: ['category', 'difficulty', 'estimatedTime', 'prerequisites', 'resources'],
    types: {
      id: 'string',
      title: 'string',
      description: 'string',
      order: 'number',
      isActive: 'boolean',
      difficulty: 'string',
      estimatedTime: 'number'
    }
  },
  userProgress: {
    required: ['userId', 'modules', 'updatedAt'],
    optional: ['overallProgress', 'achievements', 'createdAt'],
    types: {
      userId: 'string',
      modules: 'object',
      updatedAt: 'string',
      overallProgress: 'number'
    }
  },
  quizSubmissions: {
    required: ['userId', 'moduleId', 'quizType', 'score', 'totalQuestions', 'percentage', 'submittedAt'],
    optional: ['answers', 'timeSpent', 'requestId'],
    types: {
      userId: 'string',
      moduleId: 'string',
      quizType: 'string',
      score: 'number',
      totalQuestions: 'number',
      percentage: 'number',
      submittedAt: 'string'
    }
  }
};

// Sample seed data for development environment
const SEED_DATA = {
  modules: [
    {
      id: 'm1',
      title: 'Basketball Fundamentals',
      description: 'Learn the basic skills and rules of basketball',
      category: 'fundamentals',
      difficulty: 'beginner',
      order: 1,
      estimatedTime: 120, // minutes
      isActive: true,
      prerequisites: [],
      resources: [
        { type: 'video', title: 'Basic Dribbling', url: 'https://example.com/video1' },
        { type: 'pdf', title: 'Rules Guide', url: 'https://example.com/rules.pdf' }
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      id: 'm2',
      title: 'Shooting Techniques',
      description: 'Master various shooting techniques and form',
      category: 'skills',
      difficulty: 'intermediate',
      order: 2,
      estimatedTime: 90,
      isActive: true,
      prerequisites: ['m1'],
      resources: [
        { type: 'video', title: 'Perfect Shooting Form', url: 'https://example.com/video2' },
        { type: 'interactive', title: 'Shooting Practice', url: 'https://example.com/practice' }
      ],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],
  
  sampleUsers: [
    {
      email: 'coach.smith@example.com',
      name: 'John Smith',
      role: 'instructor',
      bio: 'Experienced basketball coach with 10+ years of experience',
      isActive: true,
      preferences: {
        notifications: true,
        theme: 'light',
        language: 'en'
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      email: 'student.jane@example.com',
      name: 'Jane Doe',
      role: 'student',
      bio: 'Aspiring basketball coach',
      isActive: true,
      preferences: {
        notifications: true,
        theme: 'light',
        language: 'en'
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],
  
  achievements: [
    {
      id: 'first_quiz_completed',
      title: 'Quiz Rookie',
      description: 'Completed your first quiz',
      category: 'education',
      icon: 'quiz',
      points: 10,
      isActive: true
    },
    {
      id: 'first_module_completed',
      title: 'Module Master',
      description: 'Completed your first module',
      category: 'education',
      icon: 'module',
      points: 25,
      isActive: true
    },
    {
      id: 'high_achiever',
      title: 'High Achiever',
      description: 'Maintained 90%+ average across multiple quizzes',
      category: 'performance',
      icon: 'star',
      points: 100,
      isActive: true
    }
  ]
};

class DataMigrationManager {
  constructor() {
    this.admin = null;
    this.db = null;
    this.migrationLog = [];
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
      
      // Ensure directories exist
      await this.ensureDirectories();
      
      console.log('✅ Data Migration Manager initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Data Migration Manager:', error.message);
      throw error;
    }
  }

  async ensureDirectories() {
    const dirs = [CONFIG.backupPath, CONFIG.seedDataPath, CONFIG.exportPath];
    
    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch (error) {
        await fs.mkdir(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    }
  }

  async migrateData(fromVersion, toVersion) {
    console.log(`🔄 Starting migration from v${fromVersion} to v${toVersion}...`);
    
    const migrationId = `migration-v${fromVersion}-to-v${toVersion}-${Date.now()}`;
    
    try {
      // Create backup before migration
      console.log('📦 Creating backup before migration...');
      await this.createBackup(`pre-${migrationId}`);
      
      // Execute migration based on version
      const migrationResult = await this.executeMigration(fromVersion, toVersion);
      
      // Validate migration
      console.log('✅ Validating migration...');
      const validationResult = await this.validateData();
      
      if (!validationResult.isValid) {
        throw new Error(`Migration validation failed: ${validationResult.errors.join(', ')}`);
      }
      
      // Log migration
      await this.logMigration(migrationId, fromVersion, toVersion, migrationResult);
      
      console.log(`✅ Migration completed: ${migrationId}`);
      console.log(`📊 Migrated ${migrationResult.totalRecords} records across ${migrationResult.collections.length} collections`);
      
      return migrationResult;
      
    } catch (error) {
      console.error(`❌ Migration failed: ${error.message}`);
      
      // Restore from backup if migration fails
      console.log('🔄 Rolling back migration...');
      await this.restoreFromBackup(`pre-${migrationId}`);
      
      throw error;
    }
  }

  async executeMigration(fromVersion, toVersion) {
    const migrationKey = `v${fromVersion}_to_v${toVersion}`;
    const migrationResult = {
      fromVersion,
      toVersion,
      collections: [],
      totalRecords: 0,
      startTime: new Date(),
      endTime: null
    };
    
    // Define migration strategies
    const migrations = {
      'v1_to_v2': async () => {
        // Example: Add new field to user progress
        console.log('🔄 Migrating user progress to include achievements...');
        
        const progressCollection = this.db.collection('userProgress');
        const progressDocs = await progressCollection.get();
        
        let migratedCount = 0;
        const batch = this.db.batch();
        
        progressDocs.forEach((doc) => {
          const data = doc.data();
          
          // Add achievements field if it doesn't exist
          if (!data.achievements) {
            batch.update(doc.ref, {
              achievements: [],
              migrationVersion: 'v2',
              migratedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            migratedCount++;
          }
        });
        
        if (migratedCount > 0) {
          await batch.commit();
          console.log(`✅ Migrated ${migratedCount} user progress records`);
        }
        
        migrationResult.collections.push('userProgress');
        migrationResult.totalRecords += migratedCount;
      },
      
      'v2_to_v3': async () => {
        // Example: Restructure quiz submissions for better analytics
        console.log('🔄 Restructuring quiz submissions for analytics...');
        
        const quizCollection = this.db.collection('quizSubmissions');
        const quizDocs = await quizCollection.get();
        
        let migratedCount = 0;
        
        for (const doc of quizDocs.docs) {
          const data = doc.data();
          
          // Add analytics fields
          const updatedData = {
            ...data,
            analytics: {
              responseTime: data.timeSpent || 0,
              attemptNumber: data.attemptNumber || 1,
              difficulty: this.calculateQuizDifficulty(data),
              performanceCategory: this.categorizePerformance(data.percentage)
            },
            migrationVersion: 'v3',
            migratedAt: admin.firestore.FieldValue.serverTimestamp()
          };
          
          await doc.ref.update(updatedData);
          migratedCount++;
          
          // Process in batches to avoid overwhelming Firestore
          if (migratedCount % CONFIG.batchSize === 0) {
            console.log(`📊 Processed ${migratedCount} quiz submissions...`);
            await this.sleep(100); // Brief pause between batches
          }
        }
        
        console.log(`✅ Migrated ${migratedCount} quiz submissions`);
        
        migrationResult.collections.push('quizSubmissions');
        migrationResult.totalRecords += migratedCount;
      }
    };
    
    const migrationFunction = migrations[migrationKey];
    if (!migrationFunction) {
      throw new Error(`No migration strategy found for ${migrationKey}`);
    }
    
    await migrationFunction();
    
    migrationResult.endTime = new Date();
    return migrationResult;
  }

  calculateQuizDifficulty(quizData) {
    // Simple difficulty calculation based on average score
    if (quizData.percentage >= 90) return 'easy';
    if (quizData.percentage >= 70) return 'medium';
    return 'hard';
  }

  categorizePerformance(percentage) {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'satisfactory';
    return 'needs_improvement';
  }

  async seedData(environment = 'development') {
    console.log(`🌱 Seeding data for ${environment} environment...`);
    
    if (environment === 'production') {
      throw new Error('Seeding is not allowed in production environment');
    }
    
    const seedResult = {
      environment,
      collections: [],
      totalRecords: 0,
      timestamp: new Date()
    };
    
    try {
      // Seed modules
      console.log('📚 Seeding modules...');
      const modulesCollection = this.db.collection('modules');
      
      for (const moduleData of SEED_DATA.modules) {
        const moduleRef = modulesCollection.doc(moduleData.id);
        await moduleRef.set(moduleData);
        seedResult.totalRecords++;
      }
      
      seedResult.collections.push('modules');
      console.log(`✅ Seeded ${SEED_DATA.modules.length} modules`);
      
      // Seed achievements
      console.log('🏆 Seeding achievements...');
      const achievementsCollection = this.db.collection('achievements');
      
      for (const achievement of SEED_DATA.achievements) {
        const achievementRef = achievementsCollection.doc(achievement.id);
        await achievementRef.set({
          ...achievement,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        seedResult.totalRecords++;
      }
      
      seedResult.collections.push('achievements');
      console.log(`✅ Seeded ${SEED_DATA.achievements.length} achievements`);
      
      // Seed sample users (only in development)
      if (environment === 'development') {
        console.log('👥 Seeding sample users...');
        const usersCollection = this.db.collection('users');
        
        for (const userData of SEED_DATA.sampleUsers) {
          const userRef = usersCollection.doc(); // Auto-generate ID
          await userRef.set(userData);
          seedResult.totalRecords++;
        }
        
        seedResult.collections.push('users');
        console.log(`✅ Seeded ${SEED_DATA.sampleUsers.length} sample users`);
      }
      
      // Create initial user progress for sample users
      if (environment === 'development') {
        console.log('📈 Creating initial user progress...');
        
        const progressCollection = this.db.collection('userProgress');
        const usersSnapshot = await this.db.collection('users').limit(10).get();
        
        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const initialProgress = {
            userId,
            modules: {},
            overallProgress: 0,
            achievements: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          };
          
          await progressCollection.doc(userId).set(initialProgress);
          seedResult.totalRecords++;
        }
        
        console.log(`✅ Created initial progress for ${usersSnapshot.size} users`);
      }
      
      console.log(`✅ Seeding completed: ${seedResult.totalRecords} records across ${seedResult.collections.length} collections`);
      
      return seedResult;
      
    } catch (error) {
      console.error('❌ Seeding failed:', error.message);
      throw error;
    }
  }

  async validateData() {
    console.log('🔍 Validating data integrity...');
    
    const validationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      checkedCollections: [],
      totalDocuments: 0
    };
    
    try {
      // Validate each collection against its schema
      for (const [collectionName, schema] of Object.entries(SCHEMAS)) {
        console.log(`🔍 Validating ${collectionName}...`);
        
        const collection = this.db.collection(collectionName);
        const snapshot = await collection.get();
        
        validationResult.checkedCollections.push(collectionName);
        validationResult.totalDocuments += snapshot.size;
        
        let documentIndex = 0;
        for (const doc of snapshot.docs) {
          const data = doc.data();
          const documentErrors = this.validateDocument(data, schema, `${collectionName}/${doc.id}`);
          
          validationResult.errors.push(...documentErrors);
          
          if (documentErrors.length > 0) {
            validationResult.isValid = false;
          }
          
          documentIndex++;
          
          // Log progress for large collections
          if (documentIndex % 100 === 0) {
            console.log(`📊 Validated ${documentIndex}/${snapshot.size} documents in ${collectionName}`);
          }
        }
        
        console.log(`✅ Validated ${snapshot.size} documents in ${collectionName}`);
      }
      
      // Custom business logic validations
      await this.validateBusinessLogic(validationResult);
      
      console.log(`🔍 Validation completed: ${validationResult.totalDocuments} documents checked`);
      
      if (validationResult.errors.length > 0) {
        console.log(`❌ Found ${validationResult.errors.length} errors`);
        validationResult.errors.slice(0, 10).forEach(error => console.log(`   • ${error}`));
        if (validationResult.errors.length > 10) {
          console.log(`   ... and ${validationResult.errors.length - 10} more errors`);
        }
      }
      
      if (validationResult.warnings.length > 0) {
        console.log(`⚠️  Found ${validationResult.warnings.length} warnings`);
        validationResult.warnings.slice(0, 5).forEach(warning => console.log(`   • ${warning}`));
      }
      
      return validationResult;
      
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      validationResult.isValid = false;
      validationResult.errors.push(`Validation process failed: ${error.message}`);
      return validationResult;
    }
  }

  validateDocument(data, schema, documentPath) {
    const errors = [];
    
    // Check required fields
    for (const field of schema.required) {
      if (!(field in data) || data[field] === null || data[field] === undefined) {
        errors.push(`${documentPath}: Missing required field '${field}'`);
      }
    }
    
    // Check data types
    for (const [field, expectedType] of Object.entries(schema.types)) {
      if (field in data && data[field] !== null && data[field] !== undefined) {
        const actualType = this.getFieldType(data[field]);
        if (actualType !== expectedType) {
          errors.push(`${documentPath}: Field '${field}' has type '${actualType}', expected '${expectedType}'`);
        }
      }
    }
    
    return errors;
  }

  getFieldType(value) {
    if (value instanceof admin.firestore.Timestamp) return 'timestamp';
    if (typeof value === 'object' && value !== null) return 'object';
    return typeof value;
  }

  async validateBusinessLogic(validationResult) {
    // Validate user progress consistency
    const progressSnapshot = await this.db.collection('userProgress').get();
    
    for (const doc of progressSnapshot.docs) {
      const data = doc.data();
      const userId = data.userId;
      
      // Check if user exists
      const userDoc = await this.db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        validationResult.warnings.push(`User progress exists for non-existent user: ${userId}`);
      }
      
      // Validate overall progress calculation
      const modules = data.modules || {};
      const moduleIds = Object.keys(modules);
      
      if (moduleIds.length > 0) {
        const totalProgress = moduleIds.reduce((sum, id) => {
          return sum + (modules[id].completionPercentage || 0);
        }, 0);
        const calculatedOverallProgress = Math.round(totalProgress / moduleIds.length);
        
        if (Math.abs(calculatedOverallProgress - (data.overallProgress || 0)) > 5) {
          validationResult.warnings.push(
            `User ${userId}: Overall progress mismatch (stored: ${data.overallProgress}, calculated: ${calculatedOverallProgress})`
          );
        }
      }
    }
    
    // Validate quiz submissions
    const quizSnapshot = await this.db.collection('quizSubmissions').get();
    
    for (const doc of quizSnapshot.docs) {
      const data = doc.data();
      
      // Validate percentage calculation
      const calculatedPercentage = Math.round((data.score / data.totalQuestions) * 100);
      if (Math.abs(calculatedPercentage - data.percentage) > 1) {
        validationResult.warnings.push(
          `Quiz ${doc.id}: Percentage mismatch (stored: ${data.percentage}, calculated: ${calculatedPercentage})`
        );
      }
    }
  }

  async exportData(collectionName, format = 'json') {
    console.log(`📤 Exporting ${collectionName} collection in ${format} format...`);
    
    try {
      const collection = this.db.collection(collectionName);
      const snapshot = await collection.get();
      
      const exportData = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        
        // Convert Firestore timestamps to ISO strings
        const serializedData = this.serializeFirestoreData({ id: doc.id, ...data });
        exportData.push(serializedData);
      });
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${collectionName}-export-${timestamp}`;
      
      if (format === 'json') {
        const filepath = path.join(CONFIG.exportPath, `${filename}.json`);
        await fs.writeFile(filepath, JSON.stringify(exportData, null, 2));
        console.log(`✅ Exported ${exportData.length} documents to ${filepath}`);
      } else if (format === 'csv') {
        const filepath = path.join(CONFIG.exportPath, `${filename}.csv`);
        
        if (exportData.length > 0) {
          // Get all possible columns from the data
          const columns = new Set();
          exportData.forEach(item => {
            Object.keys(this.flattenObject(item)).forEach(key => columns.add(key));
          });
          
          const csvWriter = createCsvWriter({
            path: filepath,
            header: Array.from(columns).map(col => ({ id: col, title: col }))
          });
          
          const flattenedData = exportData.map(item => this.flattenObject(item));
          await csvWriter.writeRecords(flattenedData);
          
          console.log(`✅ Exported ${exportData.length} documents to ${filepath}`);
        }
      }
      
      return {
        collection: collectionName,
        format,
        count: exportData.length,
        filepath: `${filename}.${format}`
      };
      
    } catch (error) {
      console.error(`❌ Export failed: ${error.message}`);
      throw error;
    }
  }

  async importData(filepath) {
    console.log(`📥 Importing data from ${filepath}...`);
    
    try {
      const fileExtension = path.extname(filepath).toLowerCase();
      let importData = [];
      
      if (fileExtension === '.json') {
        const fileContent = await fs.readFile(filepath, 'utf8');
        importData = JSON.parse(fileContent);
      } else if (fileExtension === '.csv') {
        importData = await this.readCsvFile(filepath);
      } else {
        throw new Error(`Unsupported file format: ${fileExtension}`);
      }
      
      if (!Array.isArray(importData)) {
        throw new Error('Import data must be an array of objects');
      }
      
      const collectionName = this.extractCollectionNameFromFilename(filepath);
      const collection = this.db.collection(collectionName);
      
      console.log(`📥 Importing ${importData.length} records to ${collectionName}...`);
      
      let importedCount = 0;
      const batch = this.db.batch();
      
      for (const item of importData) {
        const { id, ...data } = item;
        const docRef = id ? collection.doc(id) : collection.doc();
        
        // Deserialize Firestore data
        const deserializedData = this.deserializeFirestoreData(data);
        
        batch.set(docRef, deserializedData);
        importedCount++;
        
        // Commit batch when it reaches the limit
        if (importedCount % CONFIG.batchSize === 0) {
          await batch.commit();
          console.log(`📊 Imported ${importedCount} records...`);
        }
      }
      
      // Commit remaining records
      if (importedCount % CONFIG.batchSize !== 0) {
        await batch.commit();
      }
      
      console.log(`✅ Import completed: ${importedCount} records imported to ${collectionName}`);
      
      return {
        collection: collectionName,
        importedCount,
        filepath
      };
      
    } catch (error) {
      console.error(`❌ Import failed: ${error.message}`);
      throw error;
    }
  }

  extractCollectionNameFromFilename(filepath) {
    const basename = path.basename(filepath, path.extname(filepath));
    const parts = basename.split('-');
    return parts[0]; // Assume first part is collection name
  }

  async readCsvFile(filepath) {
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(filepath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  serializeFirestoreData(data) {
    if (data instanceof admin.firestore.Timestamp) {
      return { _type: 'timestamp', _value: data.toDate().toISOString() };
    }
    
    if (data && typeof data === 'object') {
      const serialized = {};
      for (const [key, value] of Object.entries(data)) {
        serialized[key] = this.serializeFirestoreData(value);
      }
      return serialized;
    }
    
    return data;
  }

  deserializeFirestoreData(data) {
    if (data && typeof data === 'object' && data._type === 'timestamp') {
      return admin.firestore.Timestamp.fromDate(new Date(data._value));
    }
    
    if (data && typeof data === 'object') {
      const deserialized = {};
      for (const [key, value] of Object.entries(data)) {
        deserialized[key] = this.deserializeFirestoreData(value);
      }
      return deserialized;
    }
    
    return data;
  }

  flattenObject(obj, prefix = '') {
    const flattened = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(flattened, this.flattenObject(value, newKey));
      } else {
        flattened[newKey] = Array.isArray(value) ? JSON.stringify(value) : value;
      }
    }
    
    return flattened;
  }

  async createBackup(backupId) {
    const backupPath = path.join(CONFIG.backupPath, `${backupId}.json`);
    
    console.log(`📦 Creating backup: ${backupId}...`);
    
    const backup = {
      id: backupId,
      timestamp: new Date().toISOString(),
      collections: {}
    };
    
    for (const collectionName of Object.keys(SCHEMAS)) {
      const collection = this.db.collection(collectionName);
      const snapshot = await collection.get();
      
      backup.collections[collectionName] = snapshot.docs.map(doc => ({
        id: doc.id,
        data: this.serializeFirestoreData(doc.data())
      }));
    }
    
    await fs.writeFile(backupPath, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Backup created: ${backupPath}`);
    return backupPath;
  }

  async restoreFromBackup(backupId) {
    const backupPath = path.join(CONFIG.backupPath, `${backupId}.json`);
    
    console.log(`📥 Restoring from backup: ${backupId}...`);
    
    try {
      const backupContent = await fs.readFile(backupPath, 'utf8');
      const backup = JSON.parse(backupContent);
      
      for (const [collectionName, documents] of Object.entries(backup.collections)) {
        console.log(`🔄 Restoring ${collectionName}...`);
        
        const collection = this.db.collection(collectionName);
        
        // Clear existing data
        const snapshot = await collection.get();
        const batch = this.db.batch();
        
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        
        // Restore data
        const restoreBatch = this.db.batch();
        
        documents.forEach(({ id, data }) => {
          const docRef = collection.doc(id);
          const deserializedData = this.deserializeFirestoreData(data);
          restoreBatch.set(docRef, deserializedData);
        });
        
        await restoreBatch.commit();
        
        console.log(`✅ Restored ${documents.length} documents to ${collectionName}`);
      }
      
      console.log(`✅ Restore completed from backup: ${backupId}`);
      
    } catch (error) {
      console.error(`❌ Restore failed: ${error.message}`);
      throw error;
    }
  }

  async logMigration(migrationId, fromVersion, toVersion, result) {
    try {
      const migrationLog = {
        id: migrationId,
        fromVersion,
        toVersion,
        result,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await this.db.collection('migrationLogs').doc(migrationId).set(migrationLog);
      
    } catch (error) {
      console.error('❌ Failed to log migration:', error.message);
    }
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
      choices: ['migrate', 'seed', 'validate', 'export', 'import', 'backup', 'restore'],
      demandOption: true,
      describe: 'Action to perform'
    })
    .option('from', {
      type: 'string',
      describe: 'Source version for migration'
    })
    .option('to', {
      type: 'string',
      describe: 'Target version for migration'
    })
    .option('environment', {
      alias: 'env',
      type: 'string',
      default: 'development',
      choices: ['development', 'staging'],
      describe: 'Environment for seeding'
    })
    .option('collection', {
      alias: 'c',
      type: 'string',
      describe: 'Collection name for export/import'
    })
    .option('file', {
      alias: 'f',
      type: 'string',
      describe: 'File path for import/export operations'
    })
    .option('format', {
      type: 'string',
      choices: ['json', 'csv'],
      default: 'json',
      describe: 'Export format'
    })
    .option('backup-id', {
      type: 'string',
      describe: 'Backup ID for restore operation'
    })
    .help()
    .argv;

  const migrationManager = new DataMigrationManager();
  
  try {
    await migrationManager.initialize();
    
    switch (argv.action) {
      case 'migrate':
        if (!argv.from || !argv.to) {
          console.error('❌ Migration requires --from and --to version parameters');
          process.exit(1);
        }
        await migrationManager.migrateData(argv.from, argv.to);
        break;
        
      case 'seed':
        await migrationManager.seedData(argv.environment);
        break;
        
      case 'validate':
        const validation = await migrationManager.validateData();
        if (!validation.isValid) {
          console.error('❌ Data validation failed');
          process.exit(1);
        }
        break;
        
      case 'export':
        if (!argv.collection) {
          console.error('❌ Export requires --collection parameter');
          process.exit(1);
        }
        await migrationManager.exportData(argv.collection, argv.format);
        break;
        
      case 'import':
        if (!argv.file) {
          console.error('❌ Import requires --file parameter');
          process.exit(1);
        }
        await migrationManager.importData(argv.file);
        break;
        
      case 'backup':
        const backupId = `manual-backup-${Date.now()}`;
        await migrationManager.createBackup(backupId);
        break;
        
      case 'restore':
        if (!argv.backupId) {
          console.error('❌ Restore requires --backup-id parameter');
          process.exit(1);
        }
        await migrationManager.restoreFromBackup(argv.backupId);
        break;
        
      default:
        console.error('❌ Unknown action');
        process.exit(1);
    }
    
    console.log('✅ Operation completed successfully');
    
  } catch (error) {
    console.error('❌ Operation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DataMigrationManager, CONFIG, SCHEMAS, SEED_DATA };