# Project Management System

A full-stack **Project Management System** built with **Laravel REST
API** and **React.js**.\
The application provides an admin dashboard for managing users, roles,
permissions, projects, and project members.

## 🚀 Tech Stack

### Backend

-   PHP
-   Laravel
-   Laravel Sanctum
-   Spatie Laravel Permission
-   MySQL
-   REST API
-   Composer

### Frontend

-   React.js
-   Vite
-   React Router
-   Axios
-   Bootstrap
-   React Hot Toast

## ✨ Features

### Authentication

-   User registration
-   User login
-   Sanctum token authentication
-   Authenticated user profile
-   Logout
-   Protected React routes

### User Management

-   User listing
-   Create user
-   Edit user
-   Delete user
-   Assign role
-   Remove role
-   Role and permission based authorization

### Project Management

-   Project listing
-   Create project
-   Edit project
-   Delete project
-   Project status management
-   Project description
-   Start date and due date
-   Project creator information
-   Project members

### Project Member Management

-   Assign users to projects
-   Remove users from projects
-   Prevent duplicate project members

## 🔐 Roles & Permissions

The backend uses **Spatie Laravel Permission** for authorization.

Example permissions:

``` text
view users
create users
edit users
delete users
assign roles

view projects
create projects
edit projects
delete projects
manage project members
```

API routes are protected using Laravel Sanctum and permission
middleware.

## 📁 Project Structure

``` text
project-management/
│
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   ├── config/
│   └── composer.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   └── routes/
    ├── package.json
    └── vite.config.js
```

## ⚙️ Backend Installation

Go to the backend directory:

``` bash
cd backend
```

Install Composer dependencies:

``` bash
composer install
```

Create the environment file:

``` bash
copy .env.example .env
```

Generate the application key:

``` bash
php artisan key:generate
```

Configure your MySQL database in `.env`:

``` env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=project_management
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations:

``` bash
php artisan migrate
```

Run seeders:

``` bash
php artisan db:seed
```

Clear application and permission cache if required:

``` bash
php artisan optimize:clear
php artisan permission:cache-reset
```

Start Laravel:

``` bash
php artisan serve
```

Backend will normally run at:

``` text
http://127.0.0.1:8000
```

## 🎨 Frontend Installation

Open another terminal:

``` bash
cd frontend
```

Install dependencies:

``` bash
npm install
```

Start the React development server:

``` bash
npm run dev
```

The frontend will normally run at:

``` text
http://localhost:5173
```

## 🔗 API Authentication

After login, the backend returns a Sanctum token.

Protected API requests use:

``` http
Authorization: Bearer YOUR_TOKEN
Accept: application/json
```

The React Axios instance should automatically attach the token to
protected requests.

## 📡 Main API Endpoints

### Authentication

  Method   Endpoint               Description
  -------- ---------------------- ----------------------------
  POST     `/api/auth/login`      Login
  POST     `/api/auth/register`   Register
  POST     `/api/auth/logout`     Logout
  GET      `/api/auth/user`       Current authenticated user

### Users

  Method   Endpoint                 Description
  -------- ------------------------ -------------
  GET      `/api/users`             List users
  POST     `/api/users`             Create user
  GET      `/api/users/{id}`        Get user
  PUT      `/api/users/{id}`        Update user
  DELETE   `/api/users/{id}`        Delete user
  POST     `/api/users/{id}/role`   Assign role
  DELETE   `/api/users/{id}/role`   Remove role

### Projects

  Method   Endpoint               Description
  -------- ---------------------- ----------------
  GET      `/api/projects`        List projects
  POST     `/api/projects`        Create project
  GET      `/api/projects/{id}`   Get project
  PUT      `/api/projects/{id}`   Update project
  DELETE   `/api/projects/{id}`   Delete project

### Project Members

  Method   Endpoint                              Description
  -------- ------------------------------------- ---------------
  POST     `/api/projects/{id}/members`          Assign member
  DELETE   `/api/projects/{id}/members/{user}`   Remove member

## 🖥️ Admin Panel

The React admin panel currently includes:

``` text
Dashboard
Users
 ├── User List
 ├── Add User
 ├── Edit User
 └── Delete User

Projects
 ├── Project List
 ├── Add Project
 ├── Edit Project
 └── Delete Project
```

## 🔒 Security

-   Laravel Sanctum authentication
-   Protected API routes
-   Spatie role and permission authorization
-   Password hashing
-   Request validation
-   Protected React routes
-   Bearer token authentication

## 🧪 API Testing

You can test the Laravel API using **Postman**.

Recommended flow:

``` text
1. Register/Login
       ↓
2. Get Sanctum token
       ↓
3. Add Bearer token
       ↓
4. Test protected APIs
       ↓
5. Test Users
       ↓
6. Test Projects
```

## 🛠️ Development

Recommended local environment:

``` text
PHP 8.x
MySQL 8.x
Node.js 18+
npm
Composer
XAMPP / Laragon
```

## 📌 Current Status

### Completed

-   [x] Laravel API setup
-   [x] React + Vite setup
-   [x] Authentication
-   [x] Sanctum authentication
-   [x] Protected routes
-   [x] Admin dashboard
-   [x] User CRUD
-   [x] Role assignment
-   [x] Spatie permissions
-   [x] Project CRUD
-   [x] Project member API
-   [x] React project list
-   [x] React create project
-   [x] React edit project
-   [x] React delete project

### Planned

-   [ ] Project details page
-   [ ] Project member management UI
-   [ ] Task management
-   [ ] Task assignment
-   [ ] Task status workflow
-   [ ] Project dashboard statistics
-   [ ] Notifications
-   [ ] Search and advanced filters
-   [ ] Pagination improvements
-   [ ] Activity logs
-   [ ] User profile
-   [ ] Production deployment

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch:

``` bash
git checkout -b feature/new-feature
```

3.  Commit your changes:

``` bash
git add .
git commit -m "Add new feature"
```

4.  Push the branch:

``` bash
git push origin feature/new-feature
```

5.  Create a Pull Request.

## 📄 License

This project is intended for learning and development purposes. Add your
preferred open-source or commercial license before publishing the
project publicly.

## 👨‍💻 Author

**Amir Saifi**

Full-Stack PHP/Laravel & React Developer.

------------------------------------------------------------------------

⭐ If you find this project useful, consider giving the repository a
star.
