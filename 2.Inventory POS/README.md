# Inventory POS

A full-stack inventory and point-of-sale (POS) web application for managing products, staff, customers, and sales. The application provides separate workflows for administrators, staff members, and customers, with product and sales information managed through a Django REST API and MySQL database.

## Features

### Administrator
- Log in to the administrator area.
- View customer and staff accounts.
- Review and approve pending customer and staff registrations.
- View the product inventory.
- Add, update, and delete products.
- View sales records across the application.

### Staff
- Register and log in as a staff member (subject to administrator approval).
- View available products and stock information.
- Process product sales by selecting products and quantities.
- View individual staff sales records.

### Customer
- Register and log in (subject to administrator approval).
- Browse available products.
- Purchase products.
- View personal purchase history.

### Sales and Inventory
- Calculate sale totals from product price and quantity.
- Record sales with staff, customer, product, quantity, total, and sale date information.
- Update product stock when a sale is processed.

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
3.Inventory POS/
├── 1.Frontend/
│   ├── public/
│   └── src/
│       ├── Components/
│       │   ├── Admin.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Staff.jsx
│       │   └── User.jsx
│       ├── App.jsx
│       └── main.jsx
└── 2.Backend/
    ├── Posapp/
    │   ├── urls.py
    │   └── views.py
    ├── Inventory_django/
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
3. Execute the SQL statements in `2.Backend/database.txt` to create the `webdb3` database and its tables.
4. Configure your local database connection in the backend settings and database connection code. Use your own local MySQL username and password; do not commit credentials.

### 2. Set up the backend

Open a terminal in `3.Inventory POS/2.Backend`:

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

Open another terminal in `3.Inventory POS/1.Frontend`:

```bash
npm install
npm run dev
```

Vite displays the frontend development URL in the terminal (commonly `http://localhost:5173/`).

## API Overview

The backend exposes REST endpoints under `/api/`, including:

| Endpoint | Purpose |
|---|---|
| `/api/register/` | Register a customer or staff member |
| `/api/login/` | Authenticate a user |
| `/api/admin/users/` | List customer accounts |
| `/api/admin/staff/` | List staff accounts |
| `/api/approve/user/` | Approve a customer account |
| `/api/approve/staff/` | Approve a staff account |
| `/api/products/` | Retrieve products |
| `/api/add-product/` | Add a product |
| `/api/update-product/` | Update a product |
| `/api/delete-product/` | Delete a product |
| `/api/products/sell/` | Process a product sale |
| `/api/sales/staff/` | Retrieve staff sales |
| `/api/sales/user/` | Retrieve customer purchase history |
| `/api/all-sales/` | Retrieve all sales records |

## Database Tables

The supplied SQL setup defines the following tables:

- `users_table` – customer account information and approval status.
- `staff_table` – staff account information and approval status.
- `products` – product names, prices, and stock quantities.
- `sales` – sales transactions and related details.

## Notes

- This repository contains a development project. Review and harden authentication, password storage, permissions, validation, stock handling, and configuration before any production deployment.
- Keep Django secret keys, database passwords, and other credentials in environment variables. Never publish real secrets.
- The database schema is provided in `2.Backend/database.txt`.

## Author

**Veerababu**

- GitHub: [@VeeruK91](https://github.com/VeeruK91)
- LinkedIn: linkedin.com/in/kondepudi-veerababu-ba5229314
- Email: veeru4323@gmail.com
