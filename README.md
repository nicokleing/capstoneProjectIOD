# capstoneProjectIODPrivate

E-commerce platform for tech services and products for startups, including a frontend, backend, and chatbot.

## Description

The application allows users to register, log in, search for products and services, add products to the cart, request information, and chat in real time. Administrators can manage users, services, news, and information requests.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/nicokleing/capstoneProjectIODPrivate.git
    ```
2. Navigate to the project folder:
    ```sh
    cd capstoneProjectIODPrivate
    ```

### Backend

1. Navigate to the `backend` folder:
    ```sh
    cd backend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file in the `backend` folder with the following content:
    ```env
    MONGO_URI=your_mongo_uri
    PORT=5000
    JWT_SECRET=your_jwt_secret
    ```
4. Start the server:
    ```sh
    npm run server
    ```

### Frontend

1. Navigate to the `frontend` folder:
    ```sh
    cd ../frontend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file in the `frontend` folder with the following content:
    ```env
    VITE_API_URL=http://localhost:5000
    ```
4. Start the development server:
    ```sh
    npm run dev
    ```

### ChatBot

1. Navigate to the `ChatBot` folder:
    ```sh
    cd ../ChatBot
    ```
2. Ensure that the necessary dependencies are installed and configured.

## Usage

### Backend

- The backend server runs on `http://localhost:5000`.
- The API routes are available at:

    - `GET /api/users` - User management.
    - `GET /api/services` - Service management.
    - `GET /api/chat` - Chat management.
    - `GET /api/news` - News management.
    - `GET /api/cart` - Cart management.
    - `GET /api/info-requests` - Information requests management.

### Frontend

- The frontend server runs on `http://localhost:3000`.
- It interacts with the backend for the functionalities mentioned above.

### ChatBot

- Ensure the chatbot is properly configured and running.

## Available Scripts

### Backend

- `npm start`: Starts the server.
- `npm run server`: Starts the server with nodemon for development.

### Frontend

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the built application.

## Socket.IO Configuration

The Socket.IO server is configured in `backend/server.js`:

```javascript
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
