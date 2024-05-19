# UserAuth

UserAuth backend built with nodejs, expressJs and mongoDB that aims to provide basic user authentication functionality like register, login logout and get profile.

## Features

- _User Authentication_: Users can register, login and logout Retrieves our data .

## Technologies Used

- _Node&Express.js_: Node and Express.js used for creating API's.
- _MongoDB_: MongoDB is a document database used for store our data.
- _Jest_: Jest is used for unit testing.

## API Testing

If you want to test API without cloning repository you can use the following url
Hosted Api url: https://user-auth-qvhu.onrender.com

## Hosted API Routes and Payload

1. Register User Api-
   Route: https://user-auth-qvhu.onrender.com/api/auth/register
   Payload: firstName, lastName, email, password, username.
2. Login User Api-
   Route: https://user-auth-qvhu.onrender.com/api/auth/login
   Payload: email, password.
3. Logout User Api-
   Route: https://user-auth-qvhu.onrender.com/api/auth/logout
4. Get User Profile Api-
   Route: https://user-auth-qvhu.onrender.com/api/user/profile

## Installation

To run the project locally, follow these steps:

1. Clone the repository: git clone https://github.com/arvindydv/user-auth
2. Navigate to the project directory: cd user-auth
3. Install dependencies: npm install
4. Provide all env variable values which is presented in .env.sample file.
5. Start the development server: npm start
6. Open your web browser and visit http://localhost:8080/api-docs to test the API's with swagger.
7. For running the test cases you can use the command npm test.

## Usage

- We can use this api's for any authentication system.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug fixes, feel free to open an issue or submit a pull request.
