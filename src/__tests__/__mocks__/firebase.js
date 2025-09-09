// Mock Firebase SDK
const mockFirestore = {
  doc: jest.fn((collection, id) => ({
    id,
    collection,
    path: `${collection}/${id}`,
  })),
  collection: jest.fn((name) => ({
    name,
    doc: jest.fn((id) => ({
      id,
      collection: name,
      path: `${name}/${id}`,
    })),
  })),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
}

const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  updateProfile: jest.fn(),
}

// Mock Firebase app
const mockApp = {
  name: 'test-app',
  options: {},
}

// Create mock document snapshot
export const createMockDocSnapshot = (data, exists = true) => ({
  id: 'mock-id',
  exists: () => exists,
  data: () => (exists ? data : undefined),
  ref: {
    id: 'mock-id',
    path: 'mock/path',
  },
})

// Create mock collection snapshot  
export const createMockCollectionSnapshot = (docs) => ({
  empty: docs.length === 0,
  size: docs.length,
  docs,
  forEach: (callback) => docs.forEach(callback),
})

// Mock Firebase configuration
export const mockFirebaseConfig = {
  apiKey: 'test-api-key',
  authDomain: 'test-project.firebaseapp.com',
  projectId: 'test-project',
  storageBucket: 'test-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'test-app-id',
}

// Mock Firebase functions
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => mockFirestore),
  doc: jest.fn((...args) => mockFirestore.doc(...args)),
  collection: jest.fn((...args) => mockFirestore.collection(...args)),
  getDoc: jest.fn(() => Promise.resolve(createMockDocSnapshot({}))),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(() => Promise.resolve()),
  addDoc: jest.fn(() => Promise.resolve({ id: 'new-doc-id' })),
  deleteDoc: jest.fn(() => Promise.resolve()),
  getDocs: jest.fn(() => Promise.resolve(createMockCollectionSnapshot([]))),
  query: jest.fn((...args) => ({ type: 'query', args })),
  where: jest.fn((...args) => ({ type: 'where', args })),
  orderBy: jest.fn((...args) => ({ type: 'orderBy', args })),
  limit: jest.fn((num) => ({ type: 'limit', args: [num] })),
  startAfter: jest.fn((doc) => ({ type: 'startAfter', args: [doc] })),
}))

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => mockAuth),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: mockAuth.currentUser })),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: mockAuth.currentUser })),
  signOut: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn((auth, callback) => {
    // Simulate user authentication state
    callback(mockAuth.currentUser)
    return jest.fn() // Return unsubscribe function
  }),
  updateProfile: jest.fn(() => Promise.resolve()),
}))

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => mockApp),
  getApps: jest.fn(() => []),
  getApp: jest.fn(() => mockApp),
}))

// Export mocks for test usage
export { mockFirestore, mockAuth, mockApp }

// Helper functions for tests
export const mockUserData = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'student',
  created_at: '2023-01-01T00:00:00.000Z',
  last_login: '2023-01-01T00:00:00.000Z',
}

export const mockModuleProgress = {
  '1': {
    completionPercentage: 75,
    quizzes: {
      knowledge: {
        score: 85,
        attempts: 1,
        bestScore: 85,
        lastAttempt: '2023-01-01T00:00:00.000Z',
        submissionId: 'quiz-submission-id',
      },
    },
  },
}

export const setMockUser = (user) => {
  mockAuth.currentUser = user
}

export const resetFirebaseMocks = () => {
  mockAuth.currentUser = null
  mockFirestore.getDoc.mockClear()
  mockFirestore.setDoc.mockClear()
  mockFirestore.updateDoc.mockClear()
  mockFirestore.addDoc.mockClear()
}