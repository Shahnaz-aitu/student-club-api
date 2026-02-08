Student Club API

Repository: https://github.com/Shahnaz-aitu/student-club-api.git

Live Deployment: https://student-club-api.onrender.com/login


Project Overview

Student Club API is a RESTful backend application built using Node.js, Express.js, and MongoDB (Atlas).
This API supports user registration, login, user profile management, and CRUD operations on a second resource (such as club posts, events, or activities).

Key features include:

User authentication with JWT
Secure password hashing using bcrypt
Organized modular structure: controllers, routes, models, middleware
CRUD operations for a custom resource
Error handling and data validation


This project follows best practices for building scalable APIs with Node/Express and MongoDB.
Project Structure

├── config/

├── controllers/

├── middleware/

├── models/

├── routes/

├── public/  

├── views/

├── app.js  

├── server.js  

├── package.json  

├── .env  


server.js – app entry point

routes/ – defines API endpoints

controllers/ – business logic for routes

models/ – Mongoose schemas

middleware/ – authentication & error handling


Setup Instructions


Clone the Repository

git clone https://github.com/Shahnaz-aitu/student-club-api.git

cd student-club-api


Install Dependencies

npm install



Create Environment Variables

Create a .env file in the project root with:

PORT=3000

MONGO_URI=MongoDB Atlas Connection URI

JWT_SECRET=JWT Secret Key


npm start
Server running on port http://localhost:3000


API Documentation


Public Endpoints
POST /register

Register a new user.
{
  "username": "john123",
  "email": "john@example.com",
  "password": "securePass"
}

POST /login

Login and receive a JWT.
{
  "email": "john@example.com",
  "password": "securePass"
}

GET /users/profile
Get profile of logged-in user.

PUT /users/profile
Update logged-in user’s profile.
{
  "username": "newname",
  "email": "new@example.com"
}


Resource Routes

POST /clubs
Create a new club item.
{
  "title": "Coding Club",
  "description": "Weekly coding sessions"
}

GET /clubs
Get all club items for the logged-in user.

GET /clubs/:id
Get a single club item by ID.

PUT /clubs/:id
Update a club item.

DELETE /clubs/:id
Delete a club item.


Validation & Error Handling
Uses middleware to validate required fields
Returns proper HTTP status codes
Handles errors globally


<img width="1914" height="944" alt="image" src="https://github.com/user-attachments/assets/b15e8128-c721-41c0-a0b0-bbcefd1ad33d" />

Users can sign up with email and password.

<img width="1897" height="966" alt="image" src="https://github.com/user-attachments/assets/f5ff92fb-a290-4064-b373-d671214c054e" />

After registration, the user sees a confirmation message that the account was created successfully.

<img width="1917" height="916" alt="image" src="https://github.com/user-attachments/assets/331e8b4d-0e5f-4b4c-b076-f3f70962e4cf" />

After registration, the user sees a confirmation message that the account was created successfully.

<img width="1919" height="969" alt="image" src="https://github.com/user-attachments/assets/1b4d53e2-7757-4b44-925d-417a55cf4a4c" />

The dashboard displays available student clubs that users can browse and explore.

<img width="1912" height="689" alt="image" src="https://github.com/user-attachments/assets/143b1c45-2728-409f-8edb-ba7962f21905" />

Users can open a club page to view event details, schedules, and participation information.

<img width="1913" height="838" alt="image" src="https://github.com/user-attachments/assets/b19b3adb-ba73-4a71-9e57-3d914d7bf120" />

The profile page shows personal user information and the list of clubs the user has joined.


Database

MongoDB Atlas is used (cloud database).

Data models include:

User (username, email, password, role)

Second main collection (e.g., Club, Post, Event, etc.)

Connection string is stored in .env (MONGO_URI).

Deployment

Deployed on a cloud provider Render 
Environment variables store sensitive keys
Continuous deployment from GitHub recommended


Advanced Features

Role-Based Access Control (RBAC)

The application implements a granular permission system to ensure data security and administrative control:

User Role: Standard users can create their own resources (clubs/tasks), view public data, and update their own profiles or entries.

Admin Role: Administrators have elevated privileges, including the ability to delete any resource globally and manage user accounts to maintain platform integrity.

Middleware Protection: Access levels are enforced via a custom roleCheck middleware that verifies the user's role stored within the JWT.



SMTP Email Service Integration

To enhance user engagement and provide a professional experience, the system includes an automated email service:

Welcome Emails: Upon successful registration via the /register endpoint, the system triggers an automated welcome email to the user's provided address.

Technology: Integrated using Nodemailer with secure SMTP configurations (e.g., SendGrid or Mailtrap).

Security: All API keys and SMTP credentials are strictly managed through .env environment variables to prevent sensitive data leaks.



Conclusion

This project demonstrates the development of a full-stack backend application using Node.js, Express, and MongoDB Atlas. It provides secure user authentication with JWT, organized modular architecture, and complete CRUD functionality for managing student clubs. The system ensures data validation, error handling, and protection of private routes, making it reliable and scalable.

Through this project, important concepts such as RESTful API design, database integration, authentication, and deployment were successfully implemented. The Student Club API offers a practical solution for managing club participation and information while showcasing modern web development practices.


