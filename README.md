# movieApi
movie api provide details of movies

Built With
MERN Tech stack (only the frontend is built using React library)

Code editor: VS Code (with ESLint)
MongoDB with hosting of the database on MongoDB Atlas
Heroku to host the app
(Postman to test the API endpoints)
Node.js
Node dependencies:
"Express" for routing
"morgan" for logging
"bodyParser" to be able to read the body of HTML requests
"mongoose" as the business logic layer (to connect the MongoDB with node.js)
"cors" to allow access to the API from external domains (set to all "*")
"express-validator" to validate input fields in the PUSH and PUT endpoints
"passport" for for HTML ("passport-local", used for login) and JWT ("passport-jwt", used for all other requests, except "/" endpoint) authentication
"jsonwebtoken" to generate JWT tokens
"bcrypt" to hash user passwords
