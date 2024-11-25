# API Gateway using NodeJS and ExpressJS

This project demonstrates how to use NodeJS to build a simple API gateway. In this project I learned how to setup unified authentication and authorization, as well as how rate limiting works.

> NOTE: This project does not include any persistence layer (database); it only provides an idea of how the API gateway is configured. You can extend this project based on your preferences.

# Technologies and Prerequisites

- NodeJS
- TypeScript
- ExpressJS

# Environment Variables

```env
PORT=8700 -- This port is for the API Gateway
```

# How to Test this Project

1. Clone the repository

   This repository includes two branches: One is the `master` branch, and the other is the `login-service` branch. These two branches represent two different servers, hence you need to clone them separately.

   - To clone the `master` branch inside of the `api-gateway` folder:

   ```bash
   git clone --branch master https://github.com/adriandotdev/node-ts-api-gateway.git api-gateway
   ```

   - To clone the `login-service` branch inside of the `login-service` folder:

   ```bash
   git clone --branch login-service https://github.com/adriandotdev/node-ts-api-gateway.git login-service
   ```

2. Install dependencies for each application

   - To install all of the dependencies in the `api-gateway` folder:

     ```bash
     cd /api-gateway
     ```

     ```bash
     npm install
     ```

   - To install all of the dependencies in the `login-service` folder:

     ```bash
     cd /login-service
     ```

     ```bash
     npm install
     ```

3. Create a `.env` file and provide the required variables listed above.

   Your `.env` file should look like this:

   ```
   PORT=8700
   ```

4. Start the two applications.

   - To start the `api-gateway` application:

     ```bash
     cd /api-gateway
     ```

     ```bash
     npm run dev
     ```

   - To start the `login-service` application:

     ```bash
     cd /login-service
     ```

     ```bash
     npm run dev
     ```

5. That's it! You should see the two applications running.

# Requesting to APIs

To request via API gateway to all of your APIs, you need to know what are the paths specified in your routes.

Example is inside of your `AuthenticationRoutes.ts` file you can request to:

- `http://localhost:8700/api/auth/login`
- `http://localhost:8700/api/auth/register`

Just look on the `path` property.
