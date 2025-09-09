import { createContext, useContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { app } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // Create user profile in Firestore
  const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();
      
      try {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: displayName || '',
          email,
          photoURL: photoURL || '',
          createdAt,
          modules_completed: 0,
          current_module: 1,
          userType: 'student',
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user profile:', error);
      }
    }
    
    return userRef;
  };

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Create user profile in Firestore
      await createUserProfile(user, { displayName });
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with email and password
  const signin = async (email, password) => {
    try {
      setError(null);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Ensure user profile exists
      await createUserProfile(user);
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google Sign-In...');
      setError(null);
      
      // Configure Google provider with additional options
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log('Attempting signInWithPopup...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sign-in successful:', result.user.email);
      
      // Create/update user profile
      await createUserProfile(result.user);
      
      return result.user;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Handle specific Firebase Auth errors
      let errorMessage = error.message;
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in was cancelled. Please try again.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign-in request was cancelled. Please try again.';
          break;
        case 'auth/internal-error':
          errorMessage = 'Internal authentication error. Please check your internet connection and try again.';
          break;
        default:
          errorMessage = `Authentication failed: ${error.message}`;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get user profile from Firestore
  const getUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.email === 'admin@maba.org' || user?.customClaims?.admin;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Firestore
        const profile = await getUserProfile(user.uid);
        setUser({ ...user, ...profile });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const value = {
    user,
    loading,
    error,
    signup,
    signin,
    signInWithGoogle,
    logout,
    resetPassword,
    isAdmin,
    getUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};