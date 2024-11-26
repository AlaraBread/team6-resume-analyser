interface SessionData {
	resumeText: string;
	jobDescription: string;
}
/**
 * In-memory storage for the session data
 *
 * Holds a 'string' as the key and the
 * object from the interface 'SessionData' as value
 */
export const tempStorage: Record<string, SessionData> = {};

/**
 * Stores session data, resume text, and job description in tempStorage.
 *
 * @param username - Unique identifier for the session.
 * @param resumeText - Text extracted from user's resume.
 * @param jobDescription - Text of the job description from user
 *
 * This allows the user to provide 'resumeText' and 'jobDescription'
 * as an entry to store in tempStorage.
 */

export function storeData(
	username: string,
	resumeText: string,
	jobDescription: string,
): void {
	tempStorage[username] = {
		resumeText: resumeText,
		jobDescription: jobDescription,
	};
}

// Retrieve based on username:
// @return data in tempStorge if exists. Otherwise, null
export function retrieveData(username: string): SessionData | null {
	return tempStorage[username] || null;
}

// Deletes data based on sessionId
// Ensures it only tries to delete if exists
export function deleteData(sessionId: string): void {
	if (sessionId in tempStorage) {
		delete tempStorage[sessionId];
	}
}

// Clear all memory in tempStorage based on the sessionId
export function clearAllData(): void {
	Object.keys(tempStorage).forEach((key) => delete tempStorage[key]);
}
