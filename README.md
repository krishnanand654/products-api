# Task 2

## Product End-points

This module contains routes related to product management.

### Routes:

- `GET /`: Retrieves all products. Requires authentication.
- `GET /:id`: Retrieves a product by its ID. Requires authentication.
- `POST /create`: Creates a new product. Requires authentication.
- `PUT /update/:id`: Updates a product by its ID. Requires authentication.
- `DELETE /delete/:id`: Deletes a product by its ID. Requires authentication.

## File End-points

This module contains routes related to file management.

### Routes:

- `POST /upload`: Uploads a file. Requires authentication. Expects a file with the key `file` in the request body.
- `GET /:id`: Retrieves a file by its ID. Requires authentication.

## Authentication End-points

This module contains routes related to user authentication.

### Routes:

- `POST /register`: Registers a new user.
- `POST /login`: Logs in a user.
- `POST /refresh-token`: Refreshes the authentication token.

Each route is protected by an authentication middleware (`authenticateToken`) to ensure secure access to the API endpoints. Additionally, file uploads are handled using a file upload middleware (`fileUploadMiddleware`). The controllers for each route are located in their respective controller modules.

Before starting the server, make sure to configure your environment variables:

- `SECRET_KEY`: Secret key used for generating JWT tokens.
- `REFRESH_SECRET_KEY`: Secret key used for generating refresh tokens.
- `DB_URI`: URI of the MongoDB used by the application.

To use this API,

```bash
npm install
```

Start server,

```bash
node server.js
```
