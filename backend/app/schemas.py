from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from datetime import date, datetime
from typing import Optional, Literal

# Employee Schemas
class EmployeeBase(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=50, description="Unique employee identifier")
    full_name: str = Field(..., min_length=1, max_length=255, description="Full name of employee")
    email: EmailStr = Field(..., description="Valid email address")
    department: str = Field(..., min_length=1, max_length=100, description="Department name")

    @field_validator('employee_id', 'full_name', 'department')
    @classmethod
    def not_empty(cls, v):
        if not v or (isinstance(v, str) and v.strip() == ''):
            raise ValueError('Field cannot be empty')
        return v

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Attendance Schemas
class AttendanceBase(BaseModel):
    employee_id: str
    date: date
    status: Literal['Present', 'Absent']

    @field_validator('employee_id')
    @classmethod
    def not_empty(cls, v):
        if not v or (isinstance(v, str) and v.strip() == ''):
            raise ValueError('Employee ID cannot be empty')
        return v

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AttendanceWithEmployee(AttendanceResponse):
    employee: EmployeeResponse

# Statistics Schemas
class EmployeeStats(BaseModel):
    employee_id: str
    full_name: str
    department: str
    total_present: int
    total_absent: int
    total_days: int

class DashboardStats(BaseModel):
    total_employees: int
    total_attendance_records: int
    present_today: int
    absent_today: int