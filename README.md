# HRMS Lite - Human Resource Management System

A production-ready full-stack web application for managing employees and tracking daily attendance. Built with modern technologies and following best practices for UI/UX and code organization.

## 🎯 Features

### Core Functionality
- ✅ **Employee Management**: Add, view, and delete employee records
- ✅ **Attendance Tracking**: Mark and view daily attendance (Present/Absent)
- ✅ **Dashboard Statistics**: Overview of employees and attendance metrics
- ✅ **Employee Statistics**: View attendance history and statistics per employee

### Bonus Features
- ✅ **Attendance Filtering**: Filter by employee and date range
- ✅ **Employee Search**: Quick search through employee records
- ✅ **Real-time Stats**: Dashboard shows present/absent counts for today
- ✅ **Professional UI**: Clean, modern, responsive interface

---

## 🛠 Tech Stack

### Frontend
- **React 19**: Modern component-based UI framework
- **React Router v7**: Client-side routing
- **Tailwind CSS v4**: Utility-first styling with custom components
- **Axios**: HTTP client for API communication
- **Lucide React**: Beautiful SVG icons
- **Vite 7**: Lightning-fast build tool and dev server

### Backend
- **FastAPI**: High-performance Python web framework
- **SQLAlchemy 2.0**: Object-relational mapping (ORM)
- **Pydantic v2**: Data validation using Python type annotations
- **PostgreSQL 17**: Robust relational database
- **Uvicorn**: ASGI application server

### DevOps
- **Docker** (optional): Containerization ready
- **Git**: Version control
- **.env**: Environment configuration management

---

## 📋 Requirements

### Functional Requirements ✅
- [x] Employee Management (Add, View, Delete)
- [x] Attendance Management (Mark, View, Filter)
- [x] RESTful API design
- [x] Database persistence
- [x] Server-side validation
- [x] Error handling with meaningful messages
- [x] Professional UI with multiple states (Loading, Empty, Error)

### Technical Requirements ✅
- [x] Readable, modular, well-structured code
- [x] Reusable components
- [x] Proper HTTP status codes
- [x] Input validation (email format, required fields, duplicates)
- [x] Responsive design

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+ 
- Node.js 18+ and npm
- PostgreSQL 12+ (or use provided Docker setup)
- Git

### Local Setup

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/hrms-lite.git
cd hrms-lite
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure database
# Create .env file with:
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/hrms_lite

# Start backend server
uvicorn app.main:app --reload --port 8000
```

Backend will run on: http://localhost:8000

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: http://localhost:5174 (or next available port)

### Verify Installation
```bash
# Health check
curl http://localhost:8000/health

# Get employees
curl http://localhost:8000/api/employees/

# Access frontend
open http://localhost:5174
```

---

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── employees.py      # Employee API endpoints
│   │   │   └── attendence.py     # Attendance API endpoints
│   │   ├── models.py             # SQLAlchemy models
│   │   ├── schemas.py            # Pydantic schemas & validation
│   │   ├── database.py           # Database configuration
│   │   └── main.py               # FastAPI app initialization
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment variables (create locally)
│   └── test_attendance.py        # Test scripts
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── pages/                # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   └── Attendance.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios API client
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css               # Global styles
│   │   └── main.jsx              # Entry point
│   ├── package.json              # NPM dependencies
│   └── vite.config.js            # Vite configuration
│
├── QUICK_START.md                # Quick setup guide
├── REQUIREMENTS_VERIFICATION.md  # Requirement checklist
├── ATTENDANCE_FIX.md            # Troubleshooting guide
└── README.md                     # This file
```

---

## 🔌 API Endpoints

### Employee Management

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/api/employees/` | List all employees | 200 |
| POST | `/api/employees/` | Create new employee | 201 |
| DELETE | `/api/employees/{employee_id}` | Delete employee | 204 |

**Create Employee Request**:
```json
{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "IT"
}
```

### Attendance Management

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/api/attendance/` | List all attendance records | 200 |
| POST | `/api/attendance/` | Mark attendance | 201 |
| DELETE | `/api/attendance/{id}` | Delete attendance record | 204 |
| GET | `/api/attendance/stats/employee/{employee_id}` | Get employee stats | 200 |
| GET | `/api/attendance/stats/dashboard` | Get dashboard stats | 200 |

**Mark Attendance Request**:
```json
{
  "employee_id": "EMP001",
  "date": "2026-01-21",
  "status": "Present"
}
```

**Query Parameters for Filtering**:
```
GET /api/attendance/?employee_id=EMP001&start_date=2026-01-01&end_date=2026-01-31
```

### System Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | System health check |

---

## 🎨 UI Components

### Pages
- **Dashboard**: Overview of employees and attendance statistics
- **Employees**: Manage employee records with CRUD operations
- **Attendance**: Mark and view attendance records with filtering

### Reusable Components
- **Layout**: Main page wrapper with navigation
- **Modal**: Form container for adding/editing records
- **Loading**: Spinner for async operations
- **ErrorMessage**: Error display with details
- **EmptyState**: Message when no data available

---

## 🔒 Validation & Error Handling

### Server-Side Validation
- ✅ Required fields enforcement
- ✅ Email format validation
- ✅ Unique employee ID constraint
- ✅ Duplicate attendance prevention (same employee, same date)
- ✅ Date format validation

### HTTP Status Codes
- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Validation error
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Messages
All error responses include meaningful messages:
```json
{
  "detail": "Attendance already marked for employee 'EMP001' on 2026-01-21"
}
```

---

## 🧪 Testing

### Manual API Testing
```bash
# Test health endpoint
curl http://localhost:8000/health

# Create employee
curl -X POST http://localhost:8000/api/employees/ \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"EMP002","full_name":"Jane Smith","email":"jane@example.com","department":"HR"}'

# Mark attendance
curl -X POST http://localhost:8000/api/attendance/ \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"EMP001","date":"2026-01-21","status":"Present"}'

# Filter attendance by date
curl "http://localhost:8000/api/attendance/?start_date=2026-01-01&end_date=2026-01-31"
```

### Frontend Testing
1. Navigate to http://localhost:5174
2. Add a new employee
3. Mark attendance for the employee
4. View attendance records and statistics
5. Filter by date range
6. Delete records and verify

---

## 📊 Database Schema

### employees table
```sql
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### attendance table
```sql
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent')),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  UNIQUE(employee_id, date)
);
```

---

## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables:
   - `DATABASE_URL`: Production PostgreSQL URL
   - `PORT`: 8000 (or auto-detected)
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Connect GitHub repository to Vercel/Netlify
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variable:
   - `VITE_API_URL`: Backend URL (e.g., https://api.example.com)
5. Deploy

### Environment Variables
Create `.env` in backend folder:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/hrms_lite
PORT=8000
DEBUG=False
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to backend"
**Solution**:
1. Ensure backend is running: `uvicorn app.main:app --reload`
2. Check port 8000 is available
3. Verify database connection in `.env`
4. Check browser console for CORS errors

### Issue: "Database connection failed"
**Solution**:
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Ensure password special characters are URL-encoded (@ → %40)
4. Test connection: `python test_db.py`

### Issue: "CSS not loading"
**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart frontend dev server: `npm run dev`
3. Check Tailwind CSS is properly configured

### Issue: "Form validation errors"
**Solution**:
1. Check console for specific error messages
2. Ensure email format is valid (user@domain.com)
3. Verify employee ID is unique
4. Check required fields are filled

See [ATTENDANCE_FIX.md](ATTENDANCE_FIX.md) for detailed troubleshooting.

---

## 📝 Assumptions & Limitations

### Assumptions
- Single admin user (no authentication required)
- Employees can only have one attendance record per day
- Department is a free-text field
- No soft deletes (deletion is permanent)

### Limitations
- No leave management
- No payroll processing
- No advanced reporting
- Single timezone (server timezone)
- No audit logging

### Future Enhancements
- User authentication & authorization
- Leave management system
- Payroll integration
- Advanced analytics and reporting
- Shift management
- Bulk attendance import/export
- Email notifications
- Mobile app

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👥 Support

For issues, questions, or suggestions:
1. Check [QUICK_START.md](QUICK_START.md) for quick setup
2. Review [REQUIREMENTS_VERIFICATION.md](REQUIREMENTS_VERIFICATION.md) for feature checklist
3. See [ATTENDANCE_FIX.md](ATTENDANCE_FIX.md) for troubleshooting
4. Open an issue on GitHub

---

## ✅ Verification Checklist

Before deployment, verify:
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5174+
- [ ] Database connected and tables created
- [ ] Can add employee via UI
- [ ] Can mark attendance via UI
- [ ] Can view attendance records
- [ ] Filters work (by employee, date range)
- [ ] Dashboard shows correct statistics
- [ ] Error messages appear for invalid input
- [ ] All API endpoints respond with correct status codes

---

**Project Status**: ✅ Production Ready  
**Last Updated**: January 21, 2026  
**Version**: 1.0.0

---

## Quick Commands

```bash
# Backend
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev

# Database verification
cd backend && python test_db.py

# Build frontend for production
cd frontend && npm run build
```
