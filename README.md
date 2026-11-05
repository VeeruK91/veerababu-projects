# Developer Portfolio – Full Stack Projects

Welcome to my GitHub portfolio. This repository contains two full-stack web applications that demonstrate my experience building React-based user interfaces, Django REST APIs, and database-driven applications.

## About Me

I am a Full Stack Developer with hands-on experience developing web applications using React.js, JavaScript, Django, REST APIs, and SQL databases. I enjoy building practical applications with role-based workflows, responsive interfaces, and backend integrations.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React.js, JavaScript (ES6+), HTML5, CSS3 |
| Frontend tooling | Vite, npm |
| Backend | Python, Django, Django REST Framework |
| API integration | REST APIs, Axios |
| Database | MySQL |
| Version control | Git, GitHub |

---

## Projects

### 1. Local Service Finder

**Local Service Finder** is a service-booking web application that connects customers with local service providers. Users can explore available services, book a provider, and submit ratings and feedback. Service providers can publish services and manage incoming bookings, while an administrator can review and approve user and provider accounts.

**Key Features**

- Separate registration and login flows for users and service providers.
- Admin approval workflow for newly registered users and providers.
- Admin view for managing and approving user and provider accounts.
- Service providers can add services with a name, price, and description.
- Users can browse the available services and book a service.
- Users can view their booked providers.
- Users can submit ratings and feedback for providers after booking.
- Providers can view received bookings and customer ratings.
- Provider rating information is used in provider-management logic.

**Technology Stack**

- Frontend: React.js, JavaScript, HTML, CSS, Vite, React Router
- Backend: Python, Django, Django REST Framework
- API integration: Axios
- Database: MySQL

**Project Structure**

```text
2.Local Service Finder/
├── 1.Frontend/
│   └── src/
│       └── Components/
└── 2.Backend/
    ├── finderapp/
    └── service_django/
```

**Source Code:** [Open Local Service Finder](./2.Local%20Service%20Finder/)

---

### 2. Inventory POS

**Inventory POS** is an inventory and point-of-sale web application designed to manage products, staff, customers, and sales. It provides separate workflows for administrators, staff members, and users. Administrators can manage accounts and products, staff can process sales and view their sales records, and users can browse products and view their purchase history.

**Key Features**

- Separate registration and login flows for users and staff.
- Admin approval workflow for newly registered users and staff.
- Admin dashboard with user, staff, and product summaries.
- Admin can view users and staff and approve pending accounts.
- Product management: add, update, view, and delete products.
- Staff can view available products and process sales.
- Stock quantity is reduced when a sale is completed.
- Sale total is calculated from product price and quantity.
- Staff can view their individual sales records.
- Users can browse products, make purchases, and view purchase history.
- Admin can review sales records.

**Technology Stack**

- Frontend: React.js, JavaScript, HTML, CSS, Vite, React Router
- Backend: Python, Django, Django REST Framework
- API integration: Axios
- Database: MySQL

**Project Structure**

```text
3.Inventory POS/
├── 1.Frontend/
│   └── src/
│       └── Components/
└── 2.Backend/
    ├── Posapp/
    └── Inventory_django/
```

**Source Code:** [Open Inventory POS](./3.Inventory%20POS/)

---

## Running the Projects Locally

Both applications have a React/Vite frontend and a Django backend. Run the frontend and backend in separate terminals.

### Prerequisites

- Python 3.12
- Node.js (22 or later)
- npm
- MySQL Server 8.x

### Frontend Setup

For either project, open a terminal in its `1.Frontend` directory and run:

```bash
npm install
npm run dev
```

Vite will display the local frontend URL in the terminal (usually `http://localhost:5173`).

### Backend Setup

Open a terminal in the relevant project's `2.Backend` directory.

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install backend dependencies:

```bash
pip install Django==5.2.7
pip install djangorestframework==3.16.1
pip install pymysql==1.1.2
pip install django-cors-headers==4.9.0
```

Create the required MySQL database using the SQL script in that project's `2.Backend/database.txt`:

- Local Service Finder: `webdb2`
- Inventory POS: `webdb3`

Then start the Django development server:

```bash
python manage.py runserver
```

The backend API will normally be available at `http://127.0.0.1:8000/`.

> **Configuration note:** Before running the projects, configure the database connection in the Django settings for your local MySQL username and password. Do not commit real credentials, Django secret keys, or other secrets to GitHub.

---

## Repository Structure

```text
veerababu-projects/
├── README.md
├── 2.Local Service Finder/
│   ├── 1.Frontend/
│   └── 2.Backend/
└── 3.Inventory POS/
    ├── 1.Frontend/
    └── 2.Backend/
```

## Contact

- **GitHub:** [VeeruK91](https://github.com/VeeruK91)
- **LinkedIn:** linkedin.com/in/kondepudi-veerababu-ba5229314
- **Email:** veeru4323@gmail.com

Thank you for visiting my portfolio!
