# API Documentation

## Introduction
This document outlines the API endpoints for the Resume and Job Description Analysis project. Each section provides details on the endpoint URL, request/response format, validation rules, and example usage. All endpoints adhere to RESTful principles and return JSON responses.

---

## Table of Contents

- [API Documentation](#api-documentation)
	- [Introduction](#introduction)
	- [Table of Contents](#table-of-contents)
	- [Authentication](#authentication)
		- [User Registration (Task 4)](#user-registration-task-4)
		- [User Login (Task 5)](#user-login-task-5)
	- [Resume and Job Description Input Handling](#resume-and-job-description-input-handling)
		- [Resume Upload (Task 8)](#resume-upload-task-8)
		- [Job Description Submission (Task 8)](#job-description-submission-task-8)
	- [AI Integration and Analysis](#ai-integration-and-analysis)
		- [Analyze Resume and Job Description (Task 18)](#analyze-resume-and-job-description-task-18)
		- [Fit Score and Feedback Retrieval (Task 24)](#fit-score-and-feedback-retrieval-task-24)

---

## Authentication

### User Registration (Task 4)
**Endpoint:** `POST /api/register`

**Description:** Allows users to register by providing their email, username, and password.

**Request:**
```json
{
	"email": "user@example.com",
	"username": "user123",
	"password": "securePassword"
}
```

**Response:**
- **Success (`201 Created`):**
```json
{
	"isError": false,
	"message": "User registered successfully."
}
```
- **Error (`400 Bad Request`):**
```json
{
	"isError": true,
	"message": "Email already registered"
}
```

---

### User Login (Task 5)
**Endpoint:** `POST /api/login`

**Description:** Authenticates users and returns a JWT for session management.

**Request:**
```json
{
	"email": "user@example.com",
	"password": "securePassword"
}
```

**Response:**
- **Success (`200 OK`):**
```json
{
	"isError": false,
	"message": "Logged in",
	"token": "jwt-token"
}
```
- **Error (`401 Unauthorized`):**
```json
{
	"isError": true,
	"message": "Invalid email or password."
}
```

The returned jwt should be included in the "token" header for authenticated requests.

---

## Resume and Job Description Input Handling

### Resume Upload (Task 8)
**Endpoint:** `POST /api/resume-upload`

**Description:** Allows users to upload a resume in PDF or docx format.

**Request:**
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `resume_file`: The uploaded file.
- **Backend Logic:**
  - Check the file type to confirm it’s a PDF (e.g., MIME type application/pdf) or docx.
  - Validate the file size (should not exceed 2MB).
  - Temporarily store the file in memory or process it directly (no persistence required).


**Response:**
- **Success (`200 OK`):**
```json
{
	"isError": false,
	"message": "Resume uploaded successfully."
}
```
- **Error (`400 Bad Request`):**
```json
{
	"isError": true,
	"message": "Invalid file type. Only PDF files are allowed."
}
```

---

### Job Description Submission (Task 8)
**Endpoint:** `POST /api/job-description`

**Description:** Accepts a job description in text format.

Must be logged in.

**Request:**
```json
{
	"jobDescription": "We are looking for a 1000000x engineer. minimum wage."
}
```
- **Backend Logic**
  - Ensure the text input does not exceed 5,000 characters.
  - Clean the text by removing extraneous whitespace.

**Response:**
- **Success (`200 OK`):**
```json
{
	"isError": false,
	"message": "Job description submitted successfully."
}
```
- **Error (`400 Bad Request`):**
```json
{
	"isError": true,
	"error": "Job description exceeds character limit."
}
```

---

## AI Integration and Analysis

### Analyze Resume and Job Description (Task 18)
**Endpoint:** `POST /api/analyze`

Must be logged in. Uses job description and resume from previous upload.

**Description:** Connect with the NLP API and facilitate communication between the frontend and AI service.

**Backend Logic**
  - Parse the incoming request and validate the payload.
  - Construct a request to the chosen NLP API.

**Request:**
```json
{}
```

**Response:**
- **Success (`200 OK`):**
```json
{
	"isError": false,
	"message": "Analysis successful.",
	"data": {
		resumeAnalysis: ["list", "of", "keywords", "in", "resume"];
		jobDescriptionAnalysis: {
			mustHave: ["must-have", "keywords", "in", "job description"];
			niceToHave: ["nice to have", "keywords"];
		};
		feedback: [
			{
				feedback: "add 12 new programming languages.",
				category: "skills"
			},
			{
				feedback: "invent 12 new programming languages.",
				category: "experience"
			}
		]
	}
}
```
- **Error (`400 Bad Request or 500 Internal Server Error`):**
```json
{
	"isError": true,
	"message": "You must upload a resume and job description."
}
```

---

### Fit Score and Feedback Retrieval (Task 24)
**Endpoint:** `POST /api/fit-score`

Must be logged in.

**Description:** Retrieves the fit score and feedback for the authenticated user.

**Request:**
```json
{
	"resumeKeywords": ["list", "of", "keywords", "from", "/api/analyze"],
	"jobDescriptionKeywords": {
		"niceToHave": ["copied", "data", "from", "previous api call"],
		"mustHave": ["steve", "jobs"]
	}
}
```

**Response:**
- **Success (`200 OK`):**
```json
{
	"isError": false,
	"message": "success",
	"fitScore": 0.5,
	"matchedSkills": ["skills", "that", "were", "found", "in", "resume and job description"],
	"feedback": [
		{
			"feedback": "show experience with computer.",
			"category": "skills"
		},
		{
			"feedback": "demonstrate that you understand computer.",
			"category": "skills"
		}
	],
}
```
- **Error (`400 Bad Request`):**
```json
{
	"isError": true,
	"message": "malformed request",
}
```

---