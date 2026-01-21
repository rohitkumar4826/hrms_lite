from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from ..database import get_db
from ..models import Employee
from ..schemas import EmployeeCreate, EmployeeResponse

router = APIRouter(prefix="/api/employees", tags=["employees"])

@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    """Create a new employee"""
    try:
        db_employee = Employee(**employee.model_dump())
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee
    except IntegrityError as e:
        db.rollback()
        error_msg = str(e.orig)
        if "employee_id" in error_msg or "unique constraint" in error_msg.lower():
            if "employee_id" in error_msg:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Employee ID already exists"
                )
            elif "email" in error_msg:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email address already exists"
                )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee with this ID or email already exists"
        )

@router.get("/", response_model=List[EmployeeResponse])
def get_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all employees"""
    employees = db.query(Employee).offset(skip).limit(limit).all()
    return employees

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    """Get a specific employee by ID"""
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    return employee

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    """Delete an employee"""
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    db.delete(employee)
    db.commit()
    return None