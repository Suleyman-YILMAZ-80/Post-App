# 📌 Post-App

This is a **Post Management Application** built as a full-stack project to practice the interaction between frontend and backend.  
The application allows users to **create, edit, and delete posts** through a simple interface, while the backend handles requests with an Express server.  

Currently, there is **no database integration**. All posts are stored in memory and reset whenever the server restarts.  
This structure makes it easier to understand the basics of client-server communication before adding a persistent storage system.

---

## 🖥️ Tech Stack

### Frontend
- ⚛️ [React](https://react.dev/) (with [Vite](https://vitejs.dev/))  
- 🎨 [Tailwind CSS](https://tailwindcss.com/) for styling  
- Modern component-based architecture  

### Backend
- 🟢 [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
- Built with [NestJS](https://nestjs.com/) under the hood  
- REST API for post operations  

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Suleyman-YILMAZ-80/Post-App.git
cd Post-App
```

2. Setup backend

```bash
cd backend
npm install
npm run start:dev
```

3. Setup frontend

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
