from pydantic import BaseModel, EmailStr
from datetime import date


class EmployeeBase(BaseModel):
    employee_id: str
    name: str
    email: EmailStr
    department: str


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeOut(EmployeeBase):
    class Config:
        from_attributes = True


class AttendanceBase(BaseModel):
    employee_id: str
    date: date
    status: str


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceOut(AttendanceBase):
    class Config:
        from_attributes = True
