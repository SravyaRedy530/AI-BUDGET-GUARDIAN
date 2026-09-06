from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import router

app = FastAPI(
    title="AI Budget Guardian — Machine Learning Engine",
    description="Microservice for Invoice Duplicate Detection, Fake Vendor Identification, Anomaly Scoring & SHAP XAI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/health")
def healthcheck():
    return {
        "status": "UP",
        "service": "AI Budget Guardian AI Engine",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
