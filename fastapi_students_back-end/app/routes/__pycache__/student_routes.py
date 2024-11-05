from fastapi import APIRouter, HTTPException
from service.student_service import studentservice
from models.student_model import Student

router = APIRouter()
student_service = studentservice()

@router.post("/students/")
def add_student(student: Student):
    student_id = student_service.add_student(student)
    return {"id": str(student_id)}

@router.get("/students/")
def get_students():
    return student_service.get_all_students()

UPLOAD_DIR = "uploads/"  # Directory for storing uploaded files
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)  # Ensure the upload directory exists

# Create a new student with file upload
@router.post("/students")
async def create_student(
    name: str = Form(...), 
    phone: str = Form(...), 
    email: str = Form(...), 
    file: UploadFile = File(None)
):
    file_path = None
    if file:
        file_path = f"{UPLOAD_DIR}{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    student = Student(name=name, phone=phone, email=email, file=file_path)
    student_id = get_db().students.insert_one(student.dict()).inserted_id

    return JSONResponse(content={"id": str(student_id)})

# Update an existing student with file upload
@router.put("/students/{student_id}")
async def update_student(
    student_id: str, 
    name: str = Form(...), 
    phone: str = Form(...), 
    email: str = Form(...), 
    file: UploadFile = File(None)
):
    student = get_db().students.find_one({"_id": ObjectId(student_id)})

    if not student:
        return JSONResponse(content={"error": "Student not found"}, status_code=404)

    update_data = {"name": name, "phone": phone, "email": email}

    if file:
        file_path = f"{UPLOAD_DIR}{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        update_data["file"] = file_path

    get_db().students.update_one({"_id": ObjectId(student_id)}, {"$set": update_data})

    return JSONResponse(content={"message": "Student updated successfully"})

@router.get("/students/{id}")
def get_student(id: str):
    student = student_service.get_student_by_id(id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/students/{id}")
def update_student(id: str, student: Student):
    updated = student_service.update_student(id, student)
    if not updated:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student updated"}

@router.delete("/students/{id}")
def delete_student(id: str):
    deleted = student_service.delete_student(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted"}
