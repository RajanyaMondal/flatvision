from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os
from typing import Dict, Any, List

app = FastAPI(title="FlatVision AI ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and metrics on startup
model = None
metrics = None

@app.on_event("startup")
def load_model():
    global model, metrics
    try:
        model = joblib.load('models/property_model.joblib')
        metrics = joblib.load('models/metrics.joblib')
        print("Linear Regression model and metrics loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")

class PropertyData(BaseModel):
    Area_Sqft: float
    Facing: str
    Floor: int
    Car_Parking_Sqft: float
    Bedrooms: int

@app.get("/health")
def health_check():
    return {
        "status": "ok" if model is not None else "degraded",
        "model_loaded": model is not None
    }

@app.get("/metrics")
def get_metrics():
    if metrics is None:
        return {"status": "degraded", "message": "Metrics not loaded"}
    return metrics

@app.get("/dataset-data")
def get_dataset_data():
    try:
        excel_path = 'data/Flat_Price_Multiple_Linear_Regression_100 copy.xlsx'
        if not os.path.exists(excel_path):
            excel_path = 'data/Flat_Price_Multiple_Linear_Regression_100.xlsx'
            if not os.path.exists(excel_path):
                raise HTTPException(status_code=404, detail="Excel dataset file not found.")
        df = pd.read_excel(excel_path)
        # Convert records to native python types
        records = []
        for _, row in df.iterrows():
            records.append({
                "Flat_ID": int(row["Flat_ID"]),
                "Area_Sqft": int(row["Area_Sqft"]),
                "Facing": str(row["Facing"]),
                "Floor": int(row["Floor"]),
                "Car_Parking_Sqft": int(row["Car_Parking_Sqft"]),
                "Bedrooms": int(row["Bedrooms"]),
                "Price_Lakh": int(row["Price_Lakh"])
            })
        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
def predict_price(data: PropertyData):
    if model is None:
        raise HTTPException(status_code=503, detail="ML Model is not currently available")
    
    try:
        # Extract features and map them to the format expected by the model
        input_data = {
            'Area_Sqft': data.Area_Sqft,
            'Facing': data.Facing,
            'Floor': data.Floor,
            'Car_Parking_Sqft': data.Car_Parking_Sqft,
            'Bedrooms': data.Bedrooms
        }
        
        # Convert to DataFrame
        df = pd.DataFrame([input_data])
        
        # Make prediction (Linear Regression yields price in Lakhs)
        prediction_lakh = model.predict(df)[0]
        # Convert prediction to absolute Rupees
        prediction_rs = float(prediction_lakh) * 100000
        
        # Find 3 similar properties in the dataset (real data comparison)
        similar_properties = []
        try:
            excel_path = 'data/Flat_Price_Multiple_Linear_Regression_100 copy.xlsx'
            if not os.path.exists(excel_path):
                excel_path = 'data/Flat_Price_Multiple_Linear_Regression_100.xlsx'
            if os.path.exists(excel_path):
                ref_df = pd.read_excel(excel_path)
                
                # Calculate a simple Euclidean distance to find the closest properties in the dataset
                # Normalize values roughly to balance weights
                ref_df['dist'] = (
                    ((ref_df['Area_Sqft'] - data.Area_Sqft) / 300) ** 2 +
                    ((ref_df['Floor'] - data.Floor) / 2) ** 2 +
                    ((ref_df['Bedrooms'] - data.Bedrooms) / 1) ** 2 +
                    ((ref_df['Car_Parking_Sqft'] - data.Car_Parking_Sqft) / 40) ** 2 +
                    (ref_df['Facing'].apply(lambda x: 0 if x == data.Facing else 1.5)) ** 2
                )
                closest = ref_df.sort_values('dist').head(3)
                for _, row in closest.iterrows():
                    similar_properties.append({
                        "Flat_ID": int(row["Flat_ID"]),
                        "Area_Sqft": int(row["Area_Sqft"]),
                        "Facing": str(row["Facing"]),
                        "Floor": int(row["Floor"]),
                        "Car_Parking_Sqft": int(row["Car_Parking_Sqft"]),
                        "Bedrooms": int(row["Bedrooms"]),
                        "Price_Lakh": int(row["Price_Lakh"])
                    })
        except Exception as distance_err:
            print(f"Error calculating similar properties: {distance_err}")
        
        return {
            "predicted_price": float(prediction_rs),
            "model_name": metrics.get('model_name', 'Multiple Linear Regression'),
            "metadata": {
                "r2_score": metrics.get('r2'),
                "mae": metrics.get('mae'),
                "rmse": metrics.get('rmse'),
                "intercept": metrics.get('intercept'),
                "coefficients": metrics.get('coefficients'),
                "similar_properties": similar_properties
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/trend-data")
def get_trend_data(time_range: str = '6M'):
    range_val = time_range
    try:
        excel_path = 'data/Flat_Price_Multiple_Linear_Regression_100 copy.xlsx'
        if not os.path.exists(excel_path):
            excel_path = 'data/Flat_Price_Multiple_Linear_Regression_100.xlsx'
            if not os.path.exists(excel_path):
                raise HTTPException(status_code=404, detail="Dataset not found.")
        
        df = pd.read_excel(excel_path)
        avg_price = df['Price_Lakh'].mean()
        
        from datetime import datetime, timedelta
        import random

        now = datetime.now()
        data = []
        
        if range_val == '1M':
            # Daily for 30 days
            points = 30
            growth_rate = 0.005 / 30
            current_price = avg_price * (1 - (points * growth_rate))
            for i in range(points):
                date_label = (now - timedelta(days=points-i)).strftime("%d %b")
                current_price *= (1 + growth_rate + random.gauss(0, 0.001))
                data.append({"label": date_label, "price": round(current_price, 2)})
        elif range_val == '3M':
            # Weekly for 12 weeks
            points = 12
            growth_rate = 0.015 / 12
            current_price = avg_price * (1 - (points * growth_rate))
            for i in range(points):
                date_label = (now - timedelta(weeks=points-i)).strftime("W%W")
                current_price *= (1 + growth_rate + random.gauss(0, 0.002))
                data.append({"label": date_label, "price": round(current_price, 2)})
        elif range_val == '6M':
            # Monthly for 6 months
            points = 6
            growth_rate = 0.03 / 6
            current_price = avg_price * (1 - (points * growth_rate))
            for i in range(points):
                date = now - timedelta(days=30*(points-i))
                date_label = date.strftime("%b '%y")
                current_price *= (1 + growth_rate + random.gauss(0, 0.005))
                data.append({"label": date_label, "price": round(current_price, 2)})
        elif range_val == '1Y':
            # Monthly for 12 months
            points = 12
            growth_rate = 0.06 / 12
            current_price = avg_price * (1 - (points * growth_rate))
            for i in range(points):
                date = now - timedelta(days=30*(points-i))
                date_label = date.strftime("%b '%y")
                current_price *= (1 + growth_rate + random.gauss(0, 0.005))
                data.append({"label": date_label, "price": round(current_price, 2)})
        elif range_val == '5Y':
            # Yearly for 5 years
            points = 5
            growth_rate = 0.35 / 5
            current_price = avg_price * (1 - (points * growth_rate))
            for i in range(points):
                date_label = str(now.year - (points-i))
                current_price *= (1 + growth_rate + random.gauss(0, 0.02))
                data.append({"label": date_label, "price": round(current_price, 2)})
        else:
            raise HTTPException(status_code=400, detail="Invalid range.")
            
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
