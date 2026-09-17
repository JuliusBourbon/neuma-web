import { api } from './apiClient';

/**
 * Start a question attempt session.
 * Backend creates a QuestionAttempt with status 'pending'.
 * @param {string} levelId
 * @param {string} questionId
 * @returns {Promise<{ attemptId: string, timeLimitSeconds: number|null, startedAt: string }>}
 */
export async function startQuestion(levelId, questionId) {
    const result = await api.post(`/learning/${levelId}/questions/${questionId}/start`);
    return result.data;
}

/**
 * Submit an answer for a question.
 * @param {string} levelId
 * @param {string} questionId
 * @param {object} payload
 * @param {string} [payload.answerKey] - For multiple_choice / true_false
 * @param {string} [payload.detectedLetter] - For camera_practice
 * @param {number} [payload.confidence] - For camera_practice (0.0 - 1.0)
 * @returns {Promise<{ isCorrect: boolean, isTimeout: boolean, xpEarned: number, correctAnswer?: string }>}
 */
export async function submitQuestion(levelId, questionId, payload) {
    const result = await api.post(`/learning/${levelId}/questions/${questionId}/submit`, payload);
    return result.data;
}

/**
 * Complete a level and calculate final score.
 * @param {string} levelId
 * @returns {Promise<{ scorePercentage: number, isPassed: boolean, correctCount: number, totalQuestions: number, stats: object }>}
 */
export async function completeLevel(levelId) {
    const result = await api.post(`/learning/${levelId}/complete`);
    return result.data;
}
