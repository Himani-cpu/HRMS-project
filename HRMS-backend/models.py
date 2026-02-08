from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


# =====================================================
# 👨‍💼 EMPLOYEE TABLE
# =====================================================
class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)

    # relationship with attendance
    attendance = relationship(
        "Attendance",
        back_populates="employee",
        cascade="all, delete-orphan",
    )


# =====================================================
# 📅 ATTENDANCE TABLE
# =====================================================
class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False)

    # relationship back to employee
    employee = relationship("Employee", back_populates="attendance")


# =====================================================
# 🔐 USER TABLE (FOR LOGIN AUTH)
# =====================================================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
