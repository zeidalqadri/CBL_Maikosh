import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useProgress(userId, moduleId) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch progress data when component mounts
  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId || !moduleId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const progressRef = doc(db, 'users', userId, 'progress', `module${moduleId}`);
        const progressSnap = await getDoc(progressRef);

        if (progressSnap.exists()) {
          setProgress(progressSnap.data());
        } else {
          // Initialize progress document if it doesn't exist
          const initialProgress = {
            moduleId: `module${moduleId}`,
            status: 'in_progress',
            startedAt: new Date().toISOString(),
            lastAccessedAt: new Date().toISOString(),
            completedSections: [],
            quizScores: {},
            assessmentSubmissions: [],
          };
          
          await setDoc(progressRef, initialProgress);
          setProgress(initialProgress);
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId, moduleId]);

  // Update progress for a section
  const updateProgress = async (moduleId, sectionId) => {
    if (!userId || !moduleId) return;

    try {
      const progressRef = doc(db, 'users', userId, 'progress', `module${moduleId}`);
      
      // Update the progress document
      await updateDoc(progressRef, {
        lastAccessedAt: new Date().toISOString(),
        completedSections: arrayUnion(sectionId),
      });
      
      // Update local state
      setProgress(prev => ({
        ...prev,
        lastAccessedAt: new Date().toISOString(),
        completedSections: [...new Set([...(prev?.completedSections || []), sectionId])],
      }));
      
      return true;
    } catch (err) {
      console.error('Error updating progress:', err);
      setError(err);
      return false;
    }
  };

  // Save quiz score
  const saveQuizScore = async (moduleId, quizId, score) => {
    if (!userId || !moduleId) return;

    try {
      const progressRef = doc(db, 'users', userId, 'progress', `module${moduleId}`);
      
      // Update the progress document
      await updateDoc(progressRef, {
        [`quizScores.${quizId}`]: {
          score,
          completedAt: new Date().toISOString(),
        },
      });
      
      // Update local state
      setProgress(prev => ({
        ...prev,
        quizScores: {
          ...(prev?.quizScores || {}),
          [quizId]: {
            score,
            completedAt: new Date().toISOString(),
          },
        },
      }));
      
      return true;
    } catch (err) {
      console.error('Error saving quiz score:', err);
      setError(err);
      return false;
    }
  };

  // Save assessment submission
  const saveAssessmentSubmission = async (moduleId, assessmentId, fileUrl, notes) => {
    if (!userId || !moduleId) return;

    try {
      const progressRef = doc(db, 'users', userId, 'progress', `module${moduleId}`);
      const submission = {
        assessmentId,
        fileUrl,
        notes,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      };
      
      // Update the progress document
      await updateDoc(progressRef, {
        assessmentSubmissions: arrayUnion(submission),
      });
      
      // Update local state
      setProgress(prev => ({
        ...prev,
        assessmentSubmissions: [...(prev?.assessmentSubmissions || []), submission],
      }));
      
      return true;
    } catch (err) {
      console.error('Error saving assessment submission:', err);
      setError(err);
      return false;
    }
  };

  // Mark module as completed
  const completeModule = async (moduleId) => {
    if (!userId || !moduleId) return;

    try {
      const progressRef = doc(db, 'users', userId, 'progress', `module${moduleId}`);
      
      // Update the progress document
      await updateDoc(progressRef, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      
      // Update local state
      setProgress(prev => ({
        ...prev,
        status: 'completed',
        completedAt: new Date().toISOString(),
      }));
      
      return true;
    } catch (err) {
      console.error('Error completing module:', err);
      setError(err);
      return false;
    }
  };

  return {
    progress,
    loading,
    error,
    updateProgress,
    saveQuizScore,
    saveAssessmentSubmission,
    completeModule,
  };
}