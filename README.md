# ⭐ Store Rating Platform

A role-based full-stack web application that allows users to submit and manage ratings (1–5 ⭐) for registered stores. The platform implements a unified authentication system with role-based access control for **Admin, Normal Users, and Store Owners**.

## 🚀 Tech Stack
Frontend: React.js (Vite), Axios, React Router  
Backend: Node.js, Express.js  
Authentication: JWT, bcrypt  
Database: MySQL  

## 👥 User Roles

### 🛠 Admin
- Add new users (Admin / Normal User)
- Add new stores
- Dashboard showing:
  - Total Users
  - Total Stores
  - Total Ratings
- View and filter users
- View and filter stores
- Sorting support (Name, Email, Address, Role)

### 👤 Normal User
- Signup and login
- Update password
- View all registered stores
- Search stores by name and address
- Submit rating (1–5 ⭐)
- Modify previously submitted rating
- View overall store rating and their submitted rating

### 🏪 Store Owner
- Login and update password
- View average rating of their store
- See list of users who submitted ratings

## 📋 Validations
- Name: 20–60 characters  
- Address: Maximum 400 characters  
- Password: 8–16 characters, at least **1 uppercase letter** and **1 special character**  
- Email: Standard email format validation  
- Rating: Integer between **1 and 5**

## 🗄 Database
The application uses a normalized relational schema with three main tables:
- **Users**
- **Stores**
- **Ratings**

Key features:
- Foreign key relationships
- Unique constraint on `(user_id, store_id)`
- Average rating aggregation
- Sorting and filtering support

## ⚙️ Setup

### Clone the repository  

```bash
git clone <repo-link>  
cd store-rating-platform  
```

### Backend setup
```bash
cd backend  
npm install  
npm start
```

### Frontend setup  
```bash
cd frontend  
npm install  
npm run dev
```

## 🔗 Repository
Complete source code and project structure are available here:  
👉 **GitHub Repo:** https://github.com/Govind-553/Store-rating-platform 

💡 This project demonstrates full-stack development skills including **REST API design, role-based authentication, database modeling, and secure user management.**
