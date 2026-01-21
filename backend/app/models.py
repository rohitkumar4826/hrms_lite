from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    department = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    attendance_records = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), ForeignKey("employees.employee_id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    employee = relationship("Employee", back_populates="attendance_records")

    __table_args__ = (
        CheckConstraint("status IN ('Present', 'Absent')", name="check_status"),
        # Unique constraint to prevent duplicate attendance for same employee on same date
    )