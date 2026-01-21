from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import date
from ..database import get_db
from ..models import Employee, Attendance
from ..schemas import (
    AttendanceCreate, AttendanceResponse, 
    AttendanceWithEmployee, EmployeeStats, DashboardStats
)

router = APIRouter(prefix="/api/attendance", tags=["attendance"])

@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    """Mark attendance for an employee"""
    # Check if employee exists
    employee = db.query(Employee).filter(Employee.employee_id == attendance.employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{attendance.employee_id}' not found"
        )
    
    # Check for duplicate attendance
    existing = db.query(Attendance).filter(
        and_(
            Attendance.employee_id == attendance.employee_id,
            Attendance.date == attendance.date
        )
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Attendance already marked for employee '{attendance.employee_id}' on {attendance.date}"
        )
    
    try:
        db_attendance = Attendance(**attendance.model_dump())
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to mark attendance"
        )

@router.get("/", response_model=List[AttendanceWithEmployee])
def get_attendance(
    employee_id: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get attendance records with optional filters"""
    query = db.query(Attendance)
    
    if employee_id:
        query = query.filter(Attendance.employee_id == employee_id)
    
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    
    attendance_records = query.order_by(Attendance.date.desc()).offset(skip).limit(limit).all()
    return attendance_records

@router.get("/employee/{employee_id}", response_model=List[AttendanceResponse])
def get_employee_attendance(
    employee_id: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """Get attendance records for a specific employee"""
    # Verify employee exists
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    query = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    
    return query.order_by(Attendance.date.desc()).all()

@router.get("/stats/employee/{employee_id}", response_model=EmployeeStats)
def get_employee_stats(employee_id: str, db: Session = Depends(get_db)):
    """Get attendance statistics for an employee"""
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    present_count = db.query(Attendance).filter(
        and_(Attendance.employee_id == employee_id, Attendance.status == "Present")
    ).count()
    
    absent_count = db.query(Attendance).filter(
        and_(Attendance.employee_id == employee_id, Attendance.status == "Absent")
    ).count()
    
    return EmployeeStats(
        employee_id=employee.employee_id,
        full_name=employee.full_name,
        department=employee.department,
        total_present=present_count,
        total_absent=absent_count,
        total_days=present_count + absent_count
    )

@router.get("/stats/dashboard", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get overall dashboard statistics"""
    total_employees = db.query(Employee).count()
    total_attendance = db.query(Attendance).count()
    
    today = date.today()
    present_today = db.query(Attendance).filter(
        and_(Attendance.date == today, Attendance.status == "Present")
    ).count()
    
    absent_today = db.query(Attendance).filter(
        and_(Attendance.date == today, Attendance.status == "Absent")
    ).count()
    
    return DashboardStats(
        total_employees=total_employees,
        total_attendance_records=total_attendance,
        present_today=present_today,
        absent_today=absent_today
    )

@router.delete("/{attendance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_attendance(attendance_id: int, db: Session = Depends(get_db)):
    """Delete an attendance record"""
    attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attendance record with ID {attendance_id} not found"
        )
    db.delete(attendance)
    db.commit()
    return None