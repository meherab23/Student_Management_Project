from repository.student_repository import StudentRepository
from db.mongo import get_students_collection
from models.student_model import Student

class studentservice:
    def __init__(self):
        self.student_repository = StudentRepository(get_students_collection())

    def get_all_students(self):
        return self.student_repository.find_all()

    def get_student_by_id(self, student_id: str):
        return self.student_repository.find_by_id(student_id)

    def add_student(self, student: Student):
        return self.student_repository.insert(student.dict())

    def update_student(self, student_id: str, student: Student):
        result = self.student_repository.update(student_id, student.dict())
        return result.modified_count == 1

    def delete_student(self, student_id: str):
        result = self.student_repository.delete(student_id)
        return result.deleted_count == 1
