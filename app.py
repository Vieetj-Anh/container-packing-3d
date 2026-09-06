from api.index import app
from fastapi.staticfiles import StaticFiles
import os

if os.path.exists("public"):
    try:
        app.mount("/", StaticFiles(directory="public", html=True), name="static")
    except Exception:
        pass
elif os.path.exists("index.html"):
    try:
        app.mount("/", StaticFiles(directory=".", html=True), name="static")
    except Exception:
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
