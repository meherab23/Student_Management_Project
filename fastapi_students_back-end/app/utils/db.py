from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DB_URL = "mongodb://localhost:27017/student_db"

client = AsyncIOMotorClient(MONGO_DB_URL)
database = client.student_db

async def connect_db():
    pass 

async def disconnect_db():
    pass  
