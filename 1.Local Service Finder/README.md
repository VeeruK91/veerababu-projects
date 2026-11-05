# Local Service Finder

A full-stack web application that connects customers with local service providers. Customers can discover services, book providers, and submit ratings and feedback. Providers can publish services and manage their bookings, while administrators review and approve user and provider registrations.

## Features

### Customer
- Register and log in as a customer.
- View available services and their provider details.
- Book a service from the available listings.
- View previously booked providers.
- Submit ratings and feedback for providers.

### Service Provider
- Register and log in as a service provider.
- Add services with a name, price, and description.
- View bookings received from customers.
- View ratings and feedback submitted by customers.

### Administrator
- View registered customers and service providers.
- Review pending registrations.
- Approve customer and provider accounts.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, JavaScript (ES6+), HTML5, CSS3 |
| Frontend tooling | Vite 7, React Router |
| HTTP/API integration | Axios |
| Backend | Python 3.12, Django 5.2, Django REST Framework |
| Database | MySQL 8 |
| Database connectivity | PyMySQL |
| Cross-origin support | django-cors-headers |

## Application Structure

```text
2.Local Service Finder/
├── 1.Frontend/
│   ├── public/
│   └── src/
│       ├── Components/
│       │   ├── Admin.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── ServeceProvider.jsx
│       │   └── User.jsx
│       ├── App.jsx
│       └── main.jsx
└── 2.Backend/
    ├── finderapp/
    │   ├── urls.py
    │   └── views.py
    ├── service_django/
    │   ├── settings.py
    │   └── urls.py
    ├── database.txt
    └── manage.py
```

## Prerequisites

Install the following before running the application:

- Python 3.12
- Node.js 22 or later and npm
- MySQL Server 8
- Git (optional, for version control)

## Setup and Run

Run the frontend and backend in separate terminals.

### 1. Configure the database

1. Start your MySQL server.
2. Open MySQL Workbench or a MySQL command-line client.
3. Execute the SQL statements in `2.Backend/database.txt` to create the `webdb2` database and its tables.
4. Configure your local database connection in the backend settings and database connection code. Use your own local MySQL username and password; do not commit credentials.

### 2. Set up the backend

Open a terminal in `2.Local Service Finder/2.Backend`:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install Django==5.2.7
pip install djangorestframework==3.16.1
pip install pymysql==1.1.2
pip install django-cors-headers==4.9.0
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend development server runs at:

```text
http://127.0.0.1:8000/
```

### 3. Set up the frontend

Open another terminal in `2.Local Service Finder/1.Frontend`:

```bash
npm install
npm run dev
```

Vite displays the frontend development URL in the terminal (commonly `http://localhost:5173/`).

## API Overview

The backend exposes REST endpoints under `/api/`, including:

| Endpoint | Purpose |
|---|---|
| `/api/register/` | Register a customer or provider |
| `/api/login/` | Authenticate a user |
| `/api/services/` | Retrieve available services |
| `/api/addservice/` | Add a provider service |
| `/api/book/` | Book a service |
| `/api/rating/` | Submit a provider rating |
| `/api/provider-bookings/` | Retrieve a provider's bookings |
| `/api/provider-ratings/` | Retrieve provider ratings |
| `/api/booked-providers/` | Retrieve a customer's booked providers |
| `/api/admin/users/` | List customer accounts |
| `/api/admin/providers/` | List provider accounts |
| `/api/approve/user/` | Approve a customer account |
| `/api/approve/provider/` | Approve a provider account |

## Notes

- This repository contains a development project. Review and harden authentication, password storage, permissions, validation, and configuration before any production deployment.
- Keep Django secret keys, database passwords, and other credentials in environment variables. Never publish real secrets.
- The database schema is provided in `2.Backend/database.txt`.

## Author

**Veerababu**

- GitHub: [@VeeruK91](https://github.com/VeeruK91)
- LinkedIn: linkedin.com/in/kondepudi-veerababu-ba5229314
- Email: veeru4323@gmail.com
