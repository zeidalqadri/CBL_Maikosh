import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app;

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    // In Cloud Run, use Application Default Credentials (ADC)
    // The service account is automatically provided by Cloud Run
    if (process.env.NODE_ENV === 'production' && !process.env.FIREBASE_PRIVATE_KEY) {
      // Use ADC in production (Cloud Run automatically provides credentials)
      app = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCP_PROJECT_ID,
      });
    } else if (process.env.FIREBASE_PRIVATE_KEY) {
      // Use explicit service account credentials if provided
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
      };

      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    } else {
      // Development or testing environment without credentials
      console.warn('Firebase Admin SDK: No credentials provided, some features may not work');
      app = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'cbl-maikosh',
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
} else {
  app = getApps()[0];
}

// Initialize services
const adminAuth = getAuth(app);
const adminDb = getFirestore(app);

export { adminAuth, adminDb };

// Helper function to verify Firebase ID token
export async function verifyIdToken(idToken) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    throw error;
  }
}

// Helper function to get user by UID
export async function getUser(uid) {
  try {
    const userRecord = await adminAuth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// Helper function to create custom claims
export async function setCustomUserClaims(uid, customClaims) {
  try {
    await adminAuth.setCustomUserClaims(uid, customClaims);
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw error;
  }
}

// Helper function to extract user from request (for API routes)
export async function getUserFromRequest(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No authorization token provided');
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyIdToken(idToken);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      customClaims: decodedToken
    };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}