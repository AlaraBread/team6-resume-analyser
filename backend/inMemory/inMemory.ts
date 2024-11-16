// Generates key for tempStorage in format:
// session_id_<number>
let sessionCounter = 1;

export function generateSessionId(): string {
    const sessionId = `session_id_${sessionCounter}`;
    sessionCounter += 1;
    return sessionId;
}

export interface SessionData {
    resume_text: string;
    job_description: string;
}

export const tempStorage: Record<string, SessionData> = {};

// Store by session ID
export function storeData(sessionId: string, resumeText: string, jobDescription: string): void {
    tempStorage[sessionId] = {
        resume_text: resumeText,
        job_description: jobDescription
    };
}

// Retrieve based on sessionID:
// @return data in tempStorge if exists. Otherwise, null
export function retrieveData(sessionId: string): SessionData | null {
    return tempStorage[sessionId] || null;
}

// Deletes data based on sessionId
export function deleteData(sessionId: string): void {
    if (sessionId in tempStorage) {
        delete tempStorage[sessionId];
    }
}

// Clear all data 
export function clearAllData(): void {
    Object.keys(tempStorage).forEach(key => delete tempStorage[key]);
}