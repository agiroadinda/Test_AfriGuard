# AfriGuard Verify - API Documentation

This document outlines all API endpoints that the frontend expects. Backend developers should implement these endpoints to match the expected request/response formats.

## Base URL
`http://your-api-domain.com/api`

---

## Authentication Endpoints

### POST `/auth/login`
Authenticate a user and return JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "token": "string (JWT token)",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

---

## Case Endpoints

### GET `/cases`
Retrieve all verification cases.

**Query Parameters:**
- `mediaType` (optional): Filter by media type (`image`, `video`, `audio`)
- `status` (optional): Filter by status (`analyzing`, `completed`, `failed`)
- `startDate` (optional): Filter by submission date (ISO 8601)
- `endDate` (optional): Filter by submission date (ISO 8601)

**Response (200 OK):**
```json
[
  {
    "id": "string",
    "mediaType": "image" | "video" | "audio",
    "status": "analyzing" | "completed" | "failed",
    "confidence": "number (0-100)",
    "submittedAt": "string (ISO 8601 datetime)",
    "completedAt": "string (ISO 8601 datetime) | null",
    "verdict": "string",
    "faceScore": "number (0-100) | undefined",
    "voiceScore": "number (0-100) | undefined",
    "lipsyncScore": "number (0-100) | undefined"
  }
]
```

### GET `/cases/:id`
Retrieve detailed information about a specific case.

**Response (200 OK):**
```json
{
  "id": "string",
  "mediaType": "image" | "video" | "audio",
  "status": "analyzing" | "completed" | "failed",
  "confidence": "number (0-100)",
  "submittedAt": "string (ISO 8601)",
  "completedAt": "string (ISO 8601) | null",
  "verdict": "string",
  "faceScore": "number (0-100) | undefined",
  "voiceScore": "number (0-100) | undefined",
  "lipsyncScore": "number (0-100) | undefined",
  "explanation": "string | undefined",
  "mediaUrl": "string (URL to media file) | undefined",
  "heatmapUrl": "string (URL to heatmap) | undefined",
  "workerId": "string | undefined",
  "processingTimeMs": "number | undefined",
  "metadata": "object | undefined"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Case not found"
}
```

---

## Statistics Endpoints

### GET `/stats`
Retrieve dashboard statistics.

**Response (200 OK):**
```json
{
  "totalVerificationsToday": "number",
  "deepfakePercentage": "number (0-100)",
  "averageConfidence": "number (0-100)",
  "totalCases": "number"
}
```

### GET `/stats/chart`
Retrieve chart data for the last 7 days.

**Response (200 OK):**
```json
[
  {
    "date": "string (YYYY-MM-DD)",
    "verifications": "number",
    "deepfakes": "number"
  }
]
```

---

## Feedback Endpoints

### GET `/feedback`
Retrieve all user feedback.

**Query Parameters:**
- `rating` (optional): Filter by rating (`positive`, `negative`)
- `startDate` (optional): Filter by submission date
- `endDate` (optional): Filter by submission date

**Response (200 OK):**
```json
[
  {
    "id": "string",
    "caseId": "string",
    "rating": "positive" | "negative",
    "comment": "string | undefined",
    "submittedAt": "string (ISO 8601)"
  }
]
```

### POST `/feedback`
Submit user feedback for a case.

**Request Body:**
```json
{
  "caseId": "string",
  "rating": "positive" | "negative",
  "comment": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "caseId": "string",
  "rating": "positive" | "negative",
  "comment": "string | undefined",
  "submittedAt": "string (ISO 8601)"
}
```

---

## WebSocket Endpoints

### WebSocket `/queue`
Real-time queue updates for verification processing.

**Connection URL:**
`ws://your-api-domain.com/queue`

**Message Format (Server → Client):**
```json
[
  {
    "id": "string",
    "mediaType": "image" | "video" | "audio",
    "submittedAt": "string (ISO 8601)",
    "progress": "number (0-100)",
    "status": "preprocessing" | "analyzing" | "llm_explaining" | "sending_result",
    "workerId": "string | undefined"
  }
]
```

**Update Frequency:** Real-time as items progress through the queue

---

## Authentication

All endpoints except `/auth/login` require JWT authentication.

**Authorization Header:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized - Invalid or missing token"
}
```

---

## Error Handling

All endpoints should follow consistent error response format:

**Error Response Structure:**
```json
{
  "error": "string (error message)",
  "code": "string (optional error code)",
  "details": "object (optional additional details)"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## CORS Configuration

The backend must allow CORS requests from the frontend domain.

**Required Headers:**
```
Access-Control-Allow-Origin: <frontend-domain>
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Rate Limiting

Consider implementing rate limiting on authentication endpoints:
- Login: 5 requests per minute per IP
- Other endpoints: 100 requests per minute per user

---

## Notes for Backend Developers

1. **Database Schema**: Design your database schema to support all fields in the response objects
2. **File Storage**: Implement secure file storage for media files and heatmap images
3. **Queue System**: Use a proper queue system (Redis, RabbitMQ, etc.) for real-time updates
4. **Security**: Implement proper validation, sanitization, and security measures
5. **Logging**: Add comprehensive logging for debugging and monitoring
6. **Testing**: Write unit tests and integration tests for all endpoints
7. **Documentation**: Keep this API documentation updated as you make changes

---

## Frontend Integration Points

The frontend uses these service files to communicate with the API:
- `src/services/AuthService.ts` - Authentication
- `src/services/CaseService.ts` - Case management and statistics
- `src/services/FeedbackService.ts` - User feedback
- `src/services/QueueService.ts` - Real-time queue WebSocket

Each service file contains commented sections showing where to add real API calls.
