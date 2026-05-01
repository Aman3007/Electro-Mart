# Electro-Mart ⚡
**[Live Demo](https://electro-mart-front.onrender.com/)**
Welcome to **Electro-Mart**, a modern, full-stack web application designed as a marketplace for electronic devices (similar to Cashify). Users can create listings, explore available products, and communicate with sellers in real-time!

## 🚀 Key Features

- **User Authentication:** Secure signup and login using JWT (JSON Web Tokens) and password hashing with bcrypt.
- **Product Listings:** Users can easily create, edit, browse, and manage electronic product listings.
- **Real-Time Chat:** Integrated Socket.io for live, instant messaging between buyers and sellers.
- **Image Uploading:** Seamless image storage and management powered by Cloudinary and Multer.
- **Modern UI:** A beautiful, responsive user interface built using React 19 and Tailwind CSS v4.
- **Secure API:** API endpoints protected with Helmet, CORS, and rate-limiting to prevent abuse.

## 🛠 Tech Stack

### Frontend
* **Core:** React 19, Vite
* **State Management:** Redux Toolkit & React-Redux
* **Routing:** React Router DOM (v7)
* **Styling:** Tailwind CSS (v4)
* **API Calls:** Axios
* **Real-time:** Socket.io-client
* **Utilities:** React Hook Form, React Hot Toast

### Backend
* **Runtime / Framework:** Node.js, Express.js
* **Database:** MongoDB configured with Mongoose
* **WebSockets:** Socket.io
* **Authentication:** jsonwebtoken, bcryptjs
* **Storage:** Cloudinary, Multer
* **Security:** Helmet, express-rate-limit, CORS

## 📁 Project Structure

The project is structured entirely as a monorepo containing both the frontend and the backend.

```
cashify/
├── backend/          # Node.js Express API server
│   ├── config/       # Database and other configurations
│   ├── controllers/  # API business logic
│   ├── middleware/   # Custom Express middleware (auth, error handling)
│   ├── models/       # Mongoose database schemas
│   ├── routes/       # Express route definitions
│   ├── socket/       # Socket.io event listeners
│   └── server.js     # Entry point for backend
│
└── frontend/         # React Application
    ├── src/
    │   ├── api/      # Axios setups and API endpoints
    │   ├── components/# Reusable UI components
    │   ├── hooks/    # Custom React hooks (e.g., useSocket)
    │   ├── pages/    # Route pages (Home, Dashboard, Chat, etc.)
    │   ├── store/    # Redux slices and store config
    │   └── App.jsx   # Main React component & routing logic
    └── package.json  # Frontend dependencies
```

## ⚙️ Local Development Setup

To run this application locally, follow these steps:

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas URL)
- Cloudinary Account (for image uploads)

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd cashify
```

### 2. Backend Setup
Navigate to the backend directory, install packages, and set up your environment variables.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:
```bash
npm start
# or use nodemon if preferred
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, install packages, and start the development server.

```bash
cd frontend
npm install
npm run dev
```

The React app should now be running automatically at `http://localhost:5173`.

