from transformers import pipeline

# Load a lightweight, highly accurate zero-shot classification model
# This runs locally on CPU and downloads automatically on the first run
print("Loading Hyperlocal AI Engine...")
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Target categories defined by the application requirements
CATEGORIES = [
    "Roads & Infrastructure", 
    "Water Supply & Leakages", 
    "Streetlights & Electricity", 
    "Waste Management & Sanitation", 
    "Public Health & Safety"
]

SEVERITIES = ["Low Priority", "Medium Priority", "High Priority"]

def analyze_issue(description: str) -> dict:
    """
    Analyzes the user's issue text to extract both the category and predicted severity.
    """
    # 1. Predict Category
    category_result = classifier(description, candidate_labels=CATEGORIES)
    predicted_category = category_result['labels'][0] # Top match
    
    # 2. Predict Severity
    severity_result = classifier(description, candidate_labels=SEVERITIES)
    predicted_severity = severity_result['labels'][0].split(" ")[0] # Extract Low, Medium, or High
    
    return {
        "category": predicted_category,
        "priority": predicted_severity
    }