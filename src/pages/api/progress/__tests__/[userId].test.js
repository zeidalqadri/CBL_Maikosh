// Mock dependencies before importing
jest.mock('@auth0/nextjs-auth0', () => ({
  getSession: jest.fn(),
}))

jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(),
}))

// Mock the Firebase config
jest.mock('../../../../config/firebase', () => ({
  db: {},
}))

import { getSession } from '@auth0/nextjs-auth0'
import { getDoc, setDoc } from 'firebase/firestore'
import handler from '../[userId]'
import {
  createMockApiRequest,
  createMockApiResponse,
} from '../../../../__tests__/utils/test-utils'
import {
  createMockDocSnapshot,
  resetFirebaseMocks,
  mockModuleProgress,
} from '../../../../__tests__/__mocks__/firebase'


describe('/api/progress/[userId]', () => {
  let req, res
  const mockUserId = 'test-user-id'
  const mockSession = {
    user: {
      sub: mockUserId,
      email: 'test@example.com',
      name: 'Test User',
    },
  }

  beforeEach(() => {
    req = createMockApiRequest('GET')
    req.query = { userId: mockUserId }
    res = createMockApiResponse()
    resetFirebaseMocks()
    jest.clearAllMocks()
  })

  describe('Authentication and Authorization', () => {
    it('returns 401 when user is not authenticated', async () => {
      getSession.mockResolvedValueOnce(null)

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('returns 401 when user tries to access another user\'s progress', async () => {
      const unauthorizedSession = {
        user: { sub: 'different-user-id' },
      }
      getSession.mockResolvedValueOnce(unauthorizedSession)

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('allows access when user requests own progress', async () => {
      getSession.mockResolvedValueOnce(mockSession)
      getDoc.mockResolvedValueOnce(createMockDocSnapshot({}, false))
      setDoc.mockResolvedValueOnce()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('GET Method - Fetch Progress', () => {
    beforeEach(() => {
      getSession.mockResolvedValueOnce(mockSession)
      req.method = 'GET'
    })

    it('returns existing progress when it exists', async () => {
      const existingProgress = {
        userId: mockUserId,
        modules: mockModuleProgress,
        overallProgress: 75,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      }

      getDoc.mockResolvedValueOnce(createMockDocSnapshot(existingProgress, true))

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(existingProgress)
    })

    it('creates and returns initial progress when none exists', async () => {
      getDoc.mockResolvedValueOnce(createMockDocSnapshot(null, false))
      setDoc.mockResolvedValueOnce()

      const beforeTime = new Date().toISOString()
      await handler(req, res)
      const afterTime = new Date().toISOString()

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userId: mockUserId,
          modules: {},
          overallProgress: 0,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      )

      const setDocCall = setDoc.mock.calls[0][1]
      expect(setDocCall.createdAt >= beforeTime).toBeTruthy()
      expect(setDocCall.createdAt <= afterTime).toBeTruthy()
      expect(setDocCall.updatedAt >= beforeTime).toBeTruthy()
      expect(setDocCall.updatedAt <= afterTime).toBeTruthy()

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          modules: {},
          overallProgress: 0,
        })
      )
    })

    it('handles Firestore fetch errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      getDoc.mockRejectedValueOnce(new Error('Firestore get error'))

      await handler(req, res)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching progress:',
        expect.any(Error)
      )
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to fetch progress',
      })

      consoleErrorSpy.mockRestore()
    })

    it('handles Firestore initialization errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      getDoc.mockResolvedValueOnce(createMockDocSnapshot(null, false))
      setDoc.mockRejectedValueOnce(new Error('Firestore set error'))

      await handler(req, res)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching progress:',
        expect.any(Error)
      )
      expect(res.status).toHaveBeenCalledWith(500)

      consoleErrorSpy.mockRestore()
    })
  })

  describe('POST/PUT Method - Update Progress', () => {
    beforeEach(() => {
      getSession.mockResolvedValueOnce(mockSession)
      req.method = 'POST'
    })

    it('validates required fields', async () => {
      req.body = { moduleId: '1' } // Missing progressData

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Module ID and progress data required',
      })
    })

    it('validates moduleId field', async () => {
      req.body = { progressData: { completionPercentage: 50 } } // Missing moduleId

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Module ID and progress data required',
      })
    })

    it('creates new progress when none exists', async () => {
      req.body = {
        moduleId: '1',
        progressData: { completionPercentage: 25 },
      }

      getDoc.mockResolvedValueOnce(createMockDocSnapshot(null, false))
      setDoc.mockResolvedValueOnce()

      const beforeTime = new Date().toISOString()
      await handler(req, res)
      const afterTime = new Date().toISOString()

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userId: mockUserId,
          modules: {
            '1': {
              completionPercentage: 25,
              lastAccessed: expect.any(String),
            },
          },
          overallProgress: 25,
          updatedAt: expect.any(String),
        })
      )

      const setDocCall = setDoc.mock.calls[0][1]
      expect(setDocCall.updatedAt >= beforeTime).toBeTruthy()
      expect(setDocCall.updatedAt <= afterTime).toBeTruthy()
      expect(setDocCall.modules['1'].lastAccessed >= beforeTime).toBeTruthy()
      expect(setDocCall.modules['1'].lastAccessed <= afterTime).toBeTruthy()
    })

    it('updates existing progress', async () => {
      req.body = {
        moduleId: '1',
        progressData: { completionPercentage: 75 },
      }

      const existingProgress = {
        userId: mockUserId,
        modules: {
          '1': { completionPercentage: 50 },
          '2': { completionPercentage: 25 },
        },
        overallProgress: 37.5,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      }

      getDoc.mockResolvedValueOnce(createMockDocSnapshot(existingProgress, true))
      setDoc.mockResolvedValueOnce()

      await handler(req, res)

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          userId: mockUserId,
          modules: {
            '1': {
              completionPercentage: 75,
              lastAccessed: expect.any(String),
            },
            '2': { completionPercentage: 25 },
          },
          overallProgress: 50, // (75 + 25) / 2
          updatedAt: expect.any(String),
        })
      )
    })

    it('preserves existing module data while updating', async () => {
      req.body = {
        moduleId: '1',
        progressData: { completionPercentage: 100 },
      }

      const existingProgress = {
        userId: mockUserId,
        modules: {
          '1': {
            completionPercentage: 50,
            quizzes: { knowledge: { score: 80 } },
            assignments: { practical: { score: 90 } },
          },
        },
      }

      getDoc.mockResolvedValueOnce(createMockDocSnapshot(existingProgress, true))
      setDoc.mockResolvedValueOnce()

      await handler(req, res)

      const setDocCall = setDoc.mock.calls[0][1]
      expect(setDocCall.modules['1']).toEqual(
        expect.objectContaining({
          completionPercentage: 100,
          quizzes: { knowledge: { score: 80 } },
          assignments: { practical: { score: 90 } },
          lastAccessed: expect.any(String),
        })
      )
    })

    it('calculates overall progress correctly with multiple modules', async () => {
      req.body = {
        moduleId: '3',
        progressData: { completionPercentage: 60 },
      }

      const existingProgress = {
        userId: mockUserId,
        modules: {
          '1': { completionPercentage: 100 },
          '2': { completionPercentage: 80 },
        },
      }

      getDoc.mockResolvedValueOnce(createMockDocSnapshot(existingProgress, true))
      setDoc.mockResolvedValueOnce()

      await handler(req, res)

      const setDocCall = setDoc.mock.calls[0][1]
      expect(setDocCall.overallProgress).toBe(80) // (100 + 80 + 60) / 3
    })

    it('handles empty modules object when calculating progress', async () => {
      req.body = {
        moduleId: '1',
        progressData: { completionPercentage: 50 },
      }

      const existingProgress = {
        userId: mockUserId,
        modules: {},
      }

      getDoc.mockResolvedValueOnce(createMockDocSnapshot(existingProgress, true))
      setDoc.mockResolvedValueOnce()

      await handler(req, res)

      const setDocCall = setDoc.mock.calls[0][1]
      expect(setDocCall.overallProgress).toBe(50) // First module
    })

    it('handles modules with missing completionPercentage', async () => {
      req.body = {
        moduleId: '2',
        progressData: { completionPercentage: 75 },
      }

      const existingProgress = {
        userId: mockUserId,
        modules: {
          '1': { quizzes: {} }, // No completionPercentage
        },
      }

      getDoc.mockResolvedValueOnce(createMockDocSnapshot(existingProgress, true))
      setDoc.mockResolvedValueOnce()

      await handler(req, res)

      const setDocCall = setDoc.mock.calls[0][1]
      expect(setDocCall.overallProgress).toBe(37.5) // (0 + 75) / 2
    })

    it('accepts PUT method', async () => {
      req.method = 'PUT'
      req.body = {
        moduleId: '1',
        progressData: { completionPercentage: 25 },
      }

      getDoc.mockResolvedValueOnce(createMockDocSnapshot({}, false))
      setDoc.mockResolvedValueOnce()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('returns updated progress data', async () => {
      req.body = {
        moduleId: '1',
        progressData: { completionPercentage: 25 },
      }

      getDoc.mockResolvedValueOnce(createMockDocSnapshot({}, false))
      setDoc.mockResolvedValueOnce()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          modules: {
            '1': expect.objectContaining({
              completionPercentage: 25,
            }),
          },
          overallProgress: 25,
        })
      )
    })

    it('handles Firestore update errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      req.body = {
        moduleId: '1',
        progressData: { completionPercentage: 25 },
      }

      getDoc.mockResolvedValueOnce(createMockDocSnapshot({}, false))
      setDoc.mockRejectedValueOnce(new Error('Firestore set error'))

      await handler(req, res)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error updating progress:',
        expect.any(Error)
      )
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to update progress',
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('HTTP Method Validation', () => {
    beforeEach(() => {
      getSession.mockResolvedValueOnce(mockSession)
    })

    it('returns 405 for unsupported methods', async () => {
      req.method = 'DELETE'

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(405)
      expect(res.setHeader).toHaveBeenCalledWith('Allow', ['GET', 'POST', 'PUT'])
      expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' })
    })

    it('accepts GET method', async () => {
      req.method = 'GET'
      getDoc.mockResolvedValueOnce(createMockDocSnapshot({}, false))
      setDoc.mockResolvedValueOnce()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('accepts POST method', async () => {
      req.method = 'POST'
      req.body = {
        moduleId: '1',
        progressData: { completionPercentage: 25 },
      }

      getDoc.mockResolvedValueOnce(createMockDocSnapshot({}, false))
      setDoc.mockResolvedValueOnce()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })

    it('accepts PUT method', async () => {
      req.method = 'PUT'
      req.body = {
        moduleId: '1',
        progressData: { completionPercentage: 25 },
      }

      getDoc.mockResolvedValueOnce(createMockDocSnapshot({}, false))
      setDoc.mockResolvedValueOnce()

      await handler(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      getSession.mockResolvedValueOnce(mockSession)
    })

    it('handles top-level errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      getSession.mockRejectedValueOnce(new Error('Session error'))

      await handler(req, res)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'API route error:',
        expect.any(Error)
      )
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      })

      consoleErrorSpy.mockRestore()
    })
  })
})