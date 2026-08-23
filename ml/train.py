import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def train_model():
    excel_path = 'data/Flat_Price_Multiple_Linear_Regression_100.xlsx'
    print(f"Loading reference dataset from '{excel_path}'...")
    if not os.path.exists(excel_path):
        raise FileNotFoundError(f"Reference dataset not found at '{excel_path}'. Please verify the file path.")

    # Load dataset
    df = pd.read_excel(excel_path)
    
    # Drop Flat_ID as it is just an identifier
    if 'Flat_ID' in df.columns:
        df = df.drop('Flat_ID', axis=1)
        
    print("Dataset Columns:", list(df.columns))
    print("Dataset Sample:\n", df.head())
    
    # Define features and target
    X = df.drop('Price_Lakh', axis=1)
    y = df['Price_Lakh']
    
    print("Preprocessing configuration...")
    # Define categorical and numerical features
    categorical_cols = ['Facing']
    numerical_cols = ['Area_Sqft', 'Floor', 'Car_Parking_Sqft', 'Bedrooms']
    
    # Preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_cols)
        ],
        remainder='passthrough'
    )
    
    # Define the Linear Regression pipeline
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', LinearRegression())
    ])
    
    print("Splitting data into train and test sets (80/20 split)...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Linear Regression Model...")
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    
    # Calculate evaluation values in Lakhs
    mae_lakh = mean_absolute_error(y_test, y_pred)
    rmse_lakh = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    # Convert evaluation metrics to Rupees for frontend display consistency
    mae_rs = mae_lakh * 100000
    rmse_rs = rmse_lakh * 100000
    
    print("\n--- Model Evaluation (Rupees) ---")
    print(f"MAE (Mean Absolute Error): Rs.{mae_rs:,.2f}")
    print(f"RMSE (Root Mean Squared Error): Rs.{rmse_rs:,.2f}")
    print(f"R2 Score: {r2:.6f}")
    print("------------------------\n")
    
    # Extract coefficients and intercept
    regressor = model.named_steps['regressor']
    feature_names_out = model.named_steps['preprocessor'].get_feature_names_out()
    
    coefficients = regressor.coef_
    intercept = regressor.intercept_
    
    # Clean feature names and map coefficients
    coef_map = {}
    for name, coef in zip(feature_names_out, coefficients):
        clean_name = name.replace('cat__Facing_', 'Facing_').replace('remainder__', '')
        coef_map[clean_name] = float(coef)
        
    print("Model Intercept (beta_0):", intercept)
    print("Model Coefficients:", coef_map)
    
    # Save the model pipeline
    print("Saving model to 'models/property_model.joblib'...")
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/property_model.joblib')
    
    # Prepare test set actual vs predicted values for scatter plot (in Rupees)
    test_predictions = []
    for act, pred in zip(y_test, y_pred):
        test_predictions.append({
            "actual": float(act) * 100000,
            "predicted": float(pred) * 100000
        })
        
    # Save evaluation metrics and parameters
    metrics = {
        'mae': float(mae_rs),
        'rmse': float(rmse_rs),
        'r2': float(r2),
        'model_name': 'Multiple Linear Regression',
        'intercept': float(intercept),
        'coefficients': coef_map,
        'test_predictions': test_predictions
    }
    joblib.dump(metrics, 'models/metrics.joblib')
    print("Training complete! Model and metrics successfully saved.")

if __name__ == "__main__":
    train_model()
