const admin = require('firebase-admin');
const serviceAccount = require('../service-account-key.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'cbl-maikosh'
});

const auth = admin.auth();
const db = admin.firestore();

const testUsers = [
  {
    email: 'aspiring_coach@test.com',
    password: 'TestUser123!',
    displayName: 'Aspiring Coach',
    userType: 'newCoach',
    modules_completed: 0,
    current_module: 1
  },
  {
    email: 'experienced_coach@test.com',
    password: 'TestUser123!',
    displayName: 'Experienced Coach',
    userType: 'experiencedCoach',
    modules_completed: 8,
    current_module: 9
  },
  {
    email: 'admin@maba.org',
    password: 'AdminUser123!',
    displayName: 'MABA Admin',
    userType: 'admin',
    modules_completed: 12,
    current_module: 12,
    isAdmin: true
  },
  {
    email: 'mobile_coach@test.com',
    password: 'TestUser123!',
    displayName: 'Mobile Coach',
    userType: 'mobileCoach',
    modules_completed: 3,
    current_module: 4
  },
  {
    email: 'verifier@school.edu',
    password: 'TestUser123!',
    displayName: 'Certificate Verifier',
    userType: 'verifier',
    modules_completed: 0,
    current_module: 0
  }
];

async function createTestUsers() {
  console.log('🔐 Creating test users in Firebase Auth...\n');

  for (const userData of testUsers) {
    try {
      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        emailVerified: true
      });

      console.log(`✅ Created auth user: ${userData.email}`);

      // Set custom claims for admin
      if (userData.isAdmin) {
        await auth.setCustomUserClaims(userRecord.uid, { admin: true });
        console.log(`   👑 Set admin claims for ${userData.email}`);
      }

      // Create/update user profile in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email: userData.email,
        displayName: userData.displayName,
        userType: userData.userType,
        modules_completed: userData.modules_completed,
        current_module: userData.current_module,
        createdAt: new Date().toISOString(),
        isAdmin: userData.isAdmin || false
      }, { merge: true });

      console.log(`   📝 Created Firestore profile for ${userData.email}`);

    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`⚠️  User ${userData.email} already exists`);
        
        // Get existing user and update Firestore profile
        try {
          const existingUser = await auth.getUserByEmail(userData.email);
          
          // Set admin claims if needed
          if (userData.isAdmin) {
            await auth.setCustomUserClaims(existingUser.uid, { admin: true });
            console.log(`   👑 Updated admin claims for ${userData.email}`);
          }
          
          // Update Firestore profile
          await db.collection('users').doc(existingUser.uid).set({
            uid: existingUser.uid,
            email: userData.email,
            displayName: userData.displayName,
            userType: userData.userType,
            modules_completed: userData.modules_completed,
            current_module: userData.current_module,
            isAdmin: userData.isAdmin || false
          }, { merge: true });
          
          console.log(`   📝 Updated Firestore profile for ${userData.email}`);
        } catch (updateError) {
          console.error(`   ❌ Error updating ${userData.email}:`, updateError.message);
        }
      } else {
        console.error(`❌ Error creating ${userData.email}:`, error.message);
      }
    }
  }

  console.log('\n🎉 Test user creation complete!');
  console.log('\n📋 Test User Credentials:');
  console.log('-------------------------');
  testUsers.forEach(user => {
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${user.password}`);
    console.log(`Role: ${user.userType}${user.isAdmin ? ' (Admin)' : ''}`);
    console.log('-------------------------');
  });

  process.exit(0);
}

createTestUsers().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});