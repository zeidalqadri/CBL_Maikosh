const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Initialize Firebase Admin
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'cbl-maikosh'
});

const db = admin.firestore();

async function seedDatabase() {
  console.log('🌱 Starting Firestore seeding...');

  try {
    // 1. Create test users
    const users = [
      {
        uid: 'aspiring-coach-001',
        email: 'aspiring_coach@test.com',
        displayName: 'Aspiring Coach',
        userType: 'newCoach',
        createdAt: new Date(),
        modules_completed: 0,
        current_module: 1
      },
      {
        uid: 'experienced-coach-001',
        email: 'experienced_coach@test.com',
        displayName: 'Experienced Coach',
        userType: 'experiencedCoach',
        createdAt: new Date(),
        modules_completed: 8,
        current_module: 9
      },
      {
        uid: 'admin-001',
        email: 'admin@maba.org',
        displayName: 'MABA Admin',
        userType: 'admin',
        isAdmin: true,
        createdAt: new Date(),
        modules_completed: 12,
        current_module: 12
      },
      {
        uid: 'mobile-coach-001',
        email: 'mobile_coach@test.com',
        displayName: 'Mobile Coach',
        userType: 'mobileCoach',
        createdAt: new Date(),
        modules_completed: 3,
        current_module: 4
      }
    ];

    // Add users to Firestore
    for (const user of users) {
      await db.collection('users').doc(user.uid).set(user);
      console.log(`✅ Created user: ${user.email}`);
    }

    // 2. Create progress records
    const progressRecords = [
      {
        userId: 'experienced-coach-001',
        moduleProgress: {
          1: { completed: true, score: 95, completedAt: new Date('2025-01-15') },
          2: { completed: true, score: 88, completedAt: new Date('2025-01-20') },
          3: { completed: true, score: 92, completedAt: new Date('2025-01-25') },
          4: { completed: true, score: 85, completedAt: new Date('2025-02-01') },
          5: { completed: true, score: 90, completedAt: new Date('2025-02-10') },
          6: { completed: true, score: 93, completedAt: new Date('2025-02-15') },
          7: { completed: true, score: 87, completedAt: new Date('2025-02-20') },
          8: { completed: true, score: 91, completedAt: new Date('2025-03-01') },
          9: { inProgress: true, score: 0, startedAt: new Date('2025-03-10') }
        },
        overallProgress: 66.67,
        lastUpdated: new Date()
      },
      {
        userId: 'mobile-coach-001',
        moduleProgress: {
          1: { completed: true, score: 82, completedAt: new Date('2025-02-01') },
          2: { completed: true, score: 78, completedAt: new Date('2025-02-15') },
          3: { completed: true, score: 85, completedAt: new Date('2025-03-01') },
          4: { inProgress: true, score: 0, startedAt: new Date('2025-03-15') }
        },
        overallProgress: 25,
        lastUpdated: new Date()
      },
      {
        userId: 'admin-001',
        moduleProgress: {
          1: { completed: true, score: 100, completedAt: new Date('2024-06-01') },
          2: { completed: true, score: 100, completedAt: new Date('2024-06-05') },
          3: { completed: true, score: 98, completedAt: new Date('2024-06-10') },
          4: { completed: true, score: 100, completedAt: new Date('2024-06-15') },
          5: { completed: true, score: 97, completedAt: new Date('2024-06-20') },
          6: { completed: true, score: 100, completedAt: new Date('2024-06-25') },
          7: { completed: true, score: 99, completedAt: new Date('2024-07-01') },
          8: { completed: true, score: 100, completedAt: new Date('2024-07-05') },
          9: { completed: true, score: 98, completedAt: new Date('2024-07-10') },
          10: { completed: true, score: 100, completedAt: new Date('2024-07-15') },
          11: { completed: true, score: 99, completedAt: new Date('2024-07-20') },
          12: { completed: true, score: 100, completedAt: new Date('2024-07-25') }
        },
        overallProgress: 100,
        lastUpdated: new Date()
      }
    ];

    // Add progress records
    for (const progress of progressRecords) {
      await db.collection('progress').doc(progress.userId).set(progress);
      console.log(`✅ Created progress for user: ${progress.userId}`);
    }

    // 3. Create sample certificates
    const certificates = [
      {
        certificateId: uuidv4(),
        userId: 'admin-001',
        userName: 'MABA Admin',
        userEmail: 'admin@maba.org',
        issueDate: new Date('2024-07-25'),
        completionDate: new Date('2024-07-25'),
        score: 99.25,
        status: 'valid',
        verificationUrl: `http://localhost:8080/certificates/verify/${uuidv4()}`,
        modules_completed: 12
      },
      {
        certificateId: uuidv4(),
        userId: 'test-expired',
        userName: 'Test Expired',
        userEmail: 'expired@test.com',
        issueDate: new Date('2023-01-15'),
        completionDate: new Date('2023-01-15'),
        score: 85,
        status: 'expired',
        verificationUrl: `http://localhost:8080/certificates/verify/${uuidv4()}`,
        modules_completed: 12
      }
    ];

    // Add certificates
    for (const cert of certificates) {
      await db.collection('certificates').doc(cert.certificateId).set(cert);
      console.log(`✅ Created certificate: ${cert.certificateId}`);
    }

    // 4. Create sample quiz results
    const quizResults = [
      {
        userId: 'experienced-coach-001',
        moduleId: 1,
        score: 95,
        answers: { q1: 'a', q2: 'b', q3: 'c', q4: 'd', q5: 'a' },
        completedAt: new Date('2025-01-15')
      },
      {
        userId: 'experienced-coach-001',
        moduleId: 2,
        score: 88,
        answers: { q1: 'b', q2: 'c', q3: 'a', q4: 'd', q5: 'b' },
        completedAt: new Date('2025-01-20')
      },
      {
        userId: 'mobile-coach-001',
        moduleId: 1,
        score: 82,
        answers: { q1: 'a', q2: 'b', q3: 'd', q4: 'a', q5: 'c' },
        completedAt: new Date('2025-02-01')
      }
    ];

    // Add quiz results
    for (const quiz of quizResults) {
      const docId = `${quiz.userId}_module${quiz.moduleId}`;
      await db.collection('quiz_results').doc(docId).set(quiz);
      console.log(`✅ Created quiz result: ${docId}`);
    }

    // 5. Create sample assignments
    const assignments = [
      {
        userId: 'experienced-coach-001',
        moduleId: 1,
        assignmentTitle: 'Coaching Philosophy Statement',
        submittedAt: new Date('2025-01-16'),
        fileUrl: '/uploads/philosophy_experienced_coach.pdf',
        status: 'submitted',
        feedback: 'Excellent understanding of coaching principles'
      },
      {
        userId: 'mobile-coach-001',
        moduleId: 1,
        assignmentTitle: 'Coaching Philosophy Statement',
        submittedAt: new Date('2025-02-02'),
        fileUrl: '/uploads/philosophy_mobile_coach.pdf',
        status: 'submitted',
        feedback: 'Good start, consider adding more detail on player development'
      }
    ];

    // Add assignments
    for (const assignment of assignments) {
      const docId = `${assignment.userId}_module${assignment.moduleId}`;
      await db.collection('assignments').doc(docId).set(assignment);
      console.log(`✅ Created assignment: ${docId}`);
    }

    console.log('\n🎉 Firestore seeding completed successfully!');
    console.log('\n📝 Test Users Created:');
    console.log('  - aspiring_coach@test.com (New coach starting Module 1)');
    console.log('  - experienced_coach@test.com (On Module 9, completed 8)');
    console.log('  - admin@maba.org (Completed all modules, has admin access)');
    console.log('  - mobile_coach@test.com (On Module 4, completed 3)');
    console.log('\n🏆 Sample certificates and progress data added');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();