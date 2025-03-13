from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


class PatientRequest(BaseModel):
    request: str


@app.post("/api/endpoint")
async def get_patient_info(request: PatientRequest):
    if request.request == "patient_info":
        return {
            "Patient_Info": {
                "Name": "John Bloodborne",
                "HN": "123456789",
                "Age": 35,
                "Sex": "Male",
                "Blood_Type": "AB+",
                "National_ID": "11013XXXXXXXX",
                "Birthdate": "01/24/2002",
            },
            "Visit_Info": {
                "Date_of_Treatment": "03/12/2025",
                "Doctor": "Dr. Han Mahoree",
                "Chief_Complaint": "Severe pain while urinating",
                "Medical_Condition": "Type 2 Diabetes Mellitus (DM)",
                "Drug_Allergy": "Penicillin",
            },
            "Vital_Signs": {
                "Weight_kg": 75,
                "Height_cm": 175,
                "BMI": 24.5,
                "BP": {"Systolic": 120, "Diastolic": 80},
            },
            "Lifestyle": {"Drink": "No", "Smoke": "Former smoker"},
        }
    return {"error": "Invalid request"}


@app.post("/api/diagnosis")
async def get_diagnosis(request: PatientRequest):
    if request.request == "diagnosis":
        return {"Diagnosis": "Peptic ulcer disease"}
    return {"error": "Invalid request"}


@app.post("/api/evaluation")
async def get_evaluation(request: PatientRequest):
    if request.request == "evaluation":
        return {
            "case": "Peptic ulcer disease",
            "evaluationMetricScores": {
                "domain1": {"1.1": 4, "1.2": 3, "1.3": 2, "1.4": 6, "1.5": 0},
                "domain2": {
                    "2.1": 3,
                    "2.2": 2,
                    "2.3": 2,
                    "2.4": 2,
                    "2.5": 1,
                    "2.6": 2,
                    "2.7": 2,
                    "2.8": 1,
                    "2.9": 2,
                    "2.10": 2,
                    "2.11": 2,
                    "2.12": 2,
                    "2.13": 2,
                    "2.14": 2,
                },
                "domain3": {"3.1": 6, "3.2": 6, "3.3": 4, "3.4": 6, "3.5": 6},
                "domain4": {"4.1": 18},
            },
            "conversationData": [
                {
                    "question": "What are the symptoms of peptic ulcer disease?",
                    "comment": "Peptic ulcer disease symptoms include burning epigastric pain, worse after eating, and relieved with food or antacids.",
                },
                {
                    "question": "How is peptic ulcer disease diagnosed?",
                    "comment": "Diagnosis is typically made based on clinical symptoms and confirmed with endoscopy or barium swallow.",
                },
                {
                    "question": "Can you describe the pain you are experiencing?",
                    "comment": "The pain is usually described as a burning or gnawing sensation in the upper abdomen.",
                },
                {
                    "question": "Do you have any other symptoms like nausea or vomiting?",
                    "comment": "Yes, some patients may experience nausea, vomiting, bloating, or loss of appetite.",
                },
                {
                    "question": "Have you noticed any blood in your stool or vomit?",
                    "comment": "Yes, in severe cases, there may be blood in the stool (melena) or vomit (hematemesis).",
                },
                {
                    "question": "Do you have a history of taking NSAIDs or aspirin?",
                    "comment": "Yes, prolonged use of NSAIDs or aspirin can increase the risk of developing peptic ulcers.",
                },
                {
                    "question": "Have you been under a lot of stress lately?",
                    "comment": "Stress and lifestyle factors can contribute to the development of peptic ulcers.",
                },
                {
                    "question": "Do you smoke or consume alcohol?",
                    "comment": "Smoking and excessive alcohol consumption can aggravate peptic ulcer disease.",
                },
                {
                    "question": "Have you had any previous episodes of similar pain?",
                    "comment": "Yes, recurrent episodes of similar pain may indicate a chronic peptic ulcer condition.",
                },
                {
                    "question": "Are you currently taking any medications for this condition?",
                    "comment": "Medications like proton pump inhibitors (PPIs) or H2 blockers are commonly used to treat peptic ulcers.",
                },
                {
                    "question": "Have you made any dietary changes recently?",
                    "comment": "Certain foods and beverages can trigger or worsen peptic ulcer symptoms.",
                },
                {
                    "question": "Do you have any family history of peptic ulcer disease?",
                    "comment": "A family history of peptic ulcer disease can increase the risk of developing the condition.",
                },
                {
                    "question": "Do you have a boyfriend or girlfriend?",
                    "comment": "This question might be too personal unless it directly relates to the case.",
                },
            ],
        }
    return {"error": "Invalid request"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
