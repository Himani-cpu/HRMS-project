from fastapi import FastAPI, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta, date

from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy import func

import models
import schemas
from database import engine, SessionLocal, Base


# ---------------- DB INIT ----------------
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API")


# ---------------- CORS ----------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://hrms-project-five.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- DB SESSION ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =====================================================
# 🔐 AUTHENTICATION (JWT LOGIN)
# =====================================================

SECRET_KEY = "hrms_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise credentials_exception

    return user


# ---------------- LOGIN API ----------------
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()

    if not user or user.password != form_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return {"access_token": access_token, "token_type": "bearer"}


# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():
    return {"message": "HRMS Lite Backend Running with DB"}


# =====================================================
# 👨‍💼 EMPLOYEE APIs (PROTECTED)
# =====================================================

@app.post("/employees")
def add_employee(
    emp: schemas.EmployeeCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    existing = db.query(models.Employee).filter(
        models.Employee.employee_id == emp.employee_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Employee ID already exists")

    db_emp = models.Employee(**emp.model_dump())
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)

    return {"message": "Employee added successfully"}


@app.get("/employees", response_model=List[schemas.EmployeeOut])
def get_employees(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    return db.query(models.Employee).all()


@app.delete("/employees/{employee_id}")
def delete_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(emp)
    db.commit()
    return {"message": "Employee deleted successfully"}


@app.put("/employees/{employee_id}", response_model=schemas.EmployeeOut)
def update_employee(
    employee_id: str,
    emp: schemas.EmployeeCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    db_emp = db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()

    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    db_emp.name = emp.name
    db_emp.email = emp.email
    db_emp.department = emp.department

    db.commit()
    db.refresh(db_emp)

    return db_emp


# =====================================================
# 📅 ATTENDANCE APIs (PROTECTED)
# =====================================================

@app.post("/attendance")
def mark_attendance(
    rec: schemas.AttendanceCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == rec.employee_id
    ).first()

    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    db_rec = models.Attendance(**rec.model_dump())
    db.add(db_rec)
    db.commit()
    db.refresh(db_rec)

    return {"message": "Attendance marked successfully"}


@app.get("/attendance/{employee_id}", response_model=List[schemas.AttendanceOut])
def get_attendance(
    employee_id: str,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    return db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).all()


# =====================================================
# 📊 DASHBOARD STATS (PROTECTED)
# =====================================================

@app.get("/dashboard/stats")
def dashboard_stats(
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    total_employees = db.query(func.count(models.Employee.id)).scalar()

    total_departments = db.query(
        func.count(func.distinct(models.Employee.department))
    ).scalar()

    attendance_in_range = db.query(models.Attendance).filter(
        models.Attendance.date.between(start_date, end_date)
    )

    return {
        "total_employees": total_employees,
        "total_departments": total_departments,
        "attendance_in_range": attendance_in_range.count(),
        "present": attendance_in_range.filter(models.Attendance.status == "Present").count(),
        "absent": attendance_in_range.filter(models.Attendance.status == "Absent").count(),
        "leave": attendance_in_range.filter(models.Attendance.status == "Leave").count(),
    }


# =====================================================
# 🔎 SEARCH + DEPARTMENT STATS
# =====================================================

@app.get("/employees/search", response_model=List[schemas.EmployeeOut])
def search_employees(
    name: str,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    return db.query(models.Employee).filter(
        models.Employee.name.ilike(f"%{name}%")
    ).all()


@app.get("/departments/stats")
def department_stats(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    results = (
        db.query(models.Employee.department, func.count(models.Employee.id))
        .group_by(models.Employee.department)
        .all()
    )

    return [{"department": dept, "count": count} for dept, count in results]


# =====================================================
# 👑 CREATE DEFAULT ADMIN SAFELY
# =====================================================

@app.on_event("startup")
def create_default_admin():
    db: Session = SessionLocal()

    user = db.query(models.User).filter(models.User.username == "admin").first()

    if not user:
        admin = models.User(username="admin", password="admin123")
        db.add(admin)
        db.commit()

    db.close()
