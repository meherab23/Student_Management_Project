from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
import pymongo

app = FastAPI()
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client["student_db"]
students_collection = db["students"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Student(BaseModel):
    name: str
    phone: str
    email: str

def student_helper(student) -> dict:
    return {
        "id": str(student["_id"]),
        "name": student["name"],
        "phone": student["phone"],
        "email": student["email"]
    }

@app.post("/students/")
def add_student(student: Student):
    student_id = students_collection.insert_one(student.dict()).inserted_id
    return {"id": str(student_id)}

@app.get("/students/")
def get_students():
    students = [student_helper(student) for student in students_collection.find()]
    return students

@app.get("/students/{id}")
def get_student(id: str):
    student = students_collection.find_one({"_id": ObjectId(id)})
    if student:
        return student_helper(student)
    raise HTTPException(status_code=404, detail="Student not found")

@app.put("/students/{id}")
def update_student(id: str, student: Student):
    if students_collection.find_one({"_id": ObjectId(id)}):
        students_collection.update_one({"_id": ObjectId(id)}, {"$set": student.dict()})
        return {"message": "Student updated"}
    raise HTTPException(status_code=404, detail="Student not found")

@app.delete("/students/{id}")
def delete_student(id: str):
    delete_result = students_collection.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Student deleted"}
    raise HTTPException(status_code=404, detail="Student not found")
