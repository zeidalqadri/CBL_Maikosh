import { getUserFromRequest } from '../../../config/firebaseAdmin';
import { db } from '../../../config/firebase';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import formidable from 'formidable';
import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE
});

const bucket = storage.bucket(process.env.GCP_STORAGE_BUCKET);

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = user.uid;

    // Parse form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filter: ({ mimetype }) => {
        // Allow common document formats
        return mimetype && (
          mimetype.includes('pdf') ||
          mimetype.includes('doc') ||
          mimetype.includes('text') ||
          mimetype.includes('image')
        );
      }
    });

    const [fields, files] = await form.parse(req);
    
    const moduleId = fields.moduleId?.[0];
    const assignmentType = fields.assignmentType?.[0];
    const description = fields.description?.[0] || '';

    if (!moduleId || !assignmentType) {
      return res.status(400).json({ 
        error: 'Module ID and assignment type are required' 
      });
    }

    let fileUrl = null;
    let fileName = null;

    // Handle file upload if provided
    if (files.file && files.file[0]) {
      const file = files.file[0];
      fileName = `${userId}/${moduleId}/${assignmentType}/${Date.now()}-${file.originalFilename}`;
      
      try {
        // Upload to Google Cloud Storage
        const blob = bucket.file(fileName);
        const stream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        await new Promise((resolve, reject) => {
          stream.on('error', reject);
          stream.on('finish', resolve);
          
          const fs = require('fs');
          const fileStream = fs.createReadStream(file.filepath);
          fileStream.pipe(stream);
        });

        // Make file publicly accessible (optional, adjust based on requirements)
        await blob.makePublic();
        fileUrl = `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET}/${fileName}`;

      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload file' });
      }
    }

    // Save assignment submission
    const assignmentSubmission = {
      userId,
      moduleId,
      assignmentType,
      description,
      fileUrl,
      fileName,
      submittedAt: new Date().toISOString(),
      status: 'submitted', // submitted, reviewed, graded
      grade: null,
      feedback: null
    };

    const assignmentRef = await addDoc(collection(db, 'assignmentSubmissions'), assignmentSubmission);

    // Update user progress
    const userProgressRef = doc(db, 'userProgress', userId);
    const progressDoc = await getDoc(userProgressRef);
    
    let currentProgress = { modules: {} };
    if (progressDoc.exists()) {
      currentProgress = progressDoc.data();
    }

    const moduleProgress = {
      ...currentProgress.modules?.[moduleId],
      assignments: {
        ...currentProgress.modules?.[moduleId]?.assignments,
        [assignmentType]: {
          submitted: true,
          submittedAt: new Date().toISOString(),
          submissionId: assignmentRef.id,
          status: 'submitted'
        }
      },
      completionPercentage: Math.min(
        (currentProgress.modules?.[moduleId]?.completionPercentage || 0) + 25,
        100
      )
    };

    const updatedProgress = {
      ...currentProgress,
      userId,
      modules: {
        ...currentProgress.modules,
        [moduleId]: moduleProgress
      },
      updatedAt: new Date().toISOString()
    };

    await updateDoc(userProgressRef, updatedProgress);

    res.status(200).json({
      success: true,
      submissionId: assignmentRef.id,
      fileUrl,
      progress: moduleProgress
    });

  } catch (error) {
    console.error('Assignment submission error:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
}