from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, ConfigDict
from typing import List

# DB 설정
DATABASE_URL = "sqlite:///./todos.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 1. DB 모델 (테이블 구조 정의) - 2주차 데이터 구조 반영
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    completed = Column(Boolean, default=False)
    date = Column(String, index=True)

# 2. Pydantic 스키마 (검문소)
# 생성할 때는 text와 date만 받고, completed는 DB에서 기본값 False로 처리!
class TodoCreate(BaseModel):
    text: str
    date: str

# 수정할 때는 text, completed, date 모두 받을 수 있게 처리
class TodoUpdate(BaseModel):
    text: str
    completed: bool
    date: str

# 프론트엔드에 응답을 보낼 때의 모양 (DB 객체를 JSON으로 변환)
class TodoResponse(BaseModel):
    id: int
    text: str
    completed: bool
    date: str

    model_config = ConfigDict(from_attributes=True) # Pydantic v2 설정 (ORM 모델 변환 허용)

# 테이블 생성 (서버 켤 때 알아서 todos.db 파일이 생김)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API")

# 3. CORS 설정 (아주 중요!)
# 프론트엔드(포트 3000)에서 백엔드(포트 8000)로 요청을 보낼 때, 브라우저가 막지 않도록 허락해 주는 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], # GET, POST 등 모든 통신 허용
    allow_headers=["*"],
)

# 4. DB 세션 의존성
# 요청이 들어올 때마다 창고(DB) 문을 열고, 일이 끝나면 닫아주는 안전장치
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 5. 엔드포인트 구현 (CRUD)

# 조회 (Read)
@app.get("/todos", response_model=List[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    return db.query(Todo).all()

# 생성 (Create)
@app.post("/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    # 프론트에서 받은 데이터로 새 DB 객체 만들기
    new_todo = Todo(text=todo.text, date=todo.date)
    db.add(new_todo)
    db.commit() # DB에 영구 저장 (도장 쾅!)
    db.refresh(new_todo) # 생성된 id를 가져오기 위해 새로고침
    return new_todo

# 수정 (Update)
@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    # 수정할 Todo가 있는지 번호(id)로 찾기
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    # 찾은 Todo의 값을 새 값으로 덮어씌우기
    db_todo.text = todo.text
    db_todo.completed = todo.completed
    db_todo.date = todo.date
    db.commit()
    db.refresh(db_todo)
    return db_todo

# 삭제 (Delete)
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(db_todo)
    db.commit()
    return {"message": "삭제 완료!"}