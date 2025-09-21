Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login



Tasks
GET /api/tasks - Get all user tasks

POST /api/tasks - Create new task

PUT /api/tasks/:id - Update task

DELETE /api/tasks/:id - Delete task

POST /api/tasks/:id/log-time - Log time spent



Subscription
POST /api/subscription/upgrade - Upgrade to premium

GET /api/subscription/status - Get subscription status

Profile
GET /api/profile - Get user profile

PUT /api/profile - Update profile

PUT /api/profile/password - Change password




AI Features
GET /api/ai/monthly-summary?month=9&year=2024 - Monthly summary

POST /api/ai/chat - AI chat query



Health
GET /api/health - Health check