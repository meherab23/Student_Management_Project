from bson import ObjectId
from pymongo.collection import Collection

class StudentRepository:
    def __init__(self, students_collection: Collection):
        self.students_collection = students_collection

    def find_all(self):
        return list(self.students_collection.find())

    def find_by_id(self, student_id: str):
        return self.students_collection.find_one({"_id": ObjectId(student_id)})

    def insert(self, student_data: dict):
        return self.students_collection.insert_one(student_data).inserted_id

    def update(self, student_id: str, student_data: dict):
        return self.students_collection.update_one({"_id": ObjectId(student_id)}, {"$set": student_data})

    def delete(self, student_id: str):
        return self.students_collection.delete_one({"_id": ObjectId(student_id)})
