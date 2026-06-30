# Mapping AI-predicted categories to operational civic departments
DEPARTMENT_ROUTING = {
    "Roads & Infrastructure": "Public Works & Engineering Department",
    "Water Supply & Leakages": "Water and Sewage Authority",
    "Streetlights & Electricity": "Municipal Electricity Board",
    "Waste Management & Sanitation": "Sanitation and Environmental Services",
    "Public Health & Safety": "Emergency Response & Civil Safety"
}

def get_assigned_department(category: str) -> str:
    """
    Returns the responsible department based on the AI category fallback.
    """
    return DEPARTMENT_ROUTING.get(category, "General Municipal Administration")