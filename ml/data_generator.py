import pandas as pd
import numpy as np
import random
import os

def generate_synthetic_data(num_samples=10000):
    np.random.seed(42)
    random.seed(42)

    cities = ['Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Hyderabad']
    localities = {
        'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Borivali'],
        'Bangalore': ['Koramangala', 'Whitefield', 'Indiranagar', 'HSR Layout'],
        'Delhi': ['Dwarka', 'Vasant Kunj', 'Rohini', 'Saket'],
        'Pune': ['Kothrud', 'Hinjewadi', 'Viman Nagar', 'Baner'],
        'Hyderabad': ['Banjara Hills', 'Gachibowli', 'Madhapur', 'Kukatpally']
    }

    # Base price mappings (approximate average price per sqft in INR)
    base_price_sqft = {
        'Mumbai': 15000,
        'Bangalore': 8000,
        'Delhi': 10000,
        'Pune': 7000,
        'Hyderabad': 6500
    }

    # Location multiplier based on locality premium
    locality_premium = {
        'Bandra': 1.8, 'Andheri': 1.2, 'Powai': 1.4, 'Borivali': 1.0,
        'Koramangala': 1.5, 'Whitefield': 1.1, 'Indiranagar': 1.6, 'HSR Layout': 1.3,
        'Dwarka': 1.1, 'Vasant Kunj': 1.5, 'Rohini': 0.9, 'Saket': 1.4,
        'Kothrud': 1.2, 'Hinjewadi': 1.0, 'Viman Nagar': 1.3, 'Baner': 1.1,
        'Banjara Hills': 1.7, 'Gachibowli': 1.2, 'Madhapur': 1.3, 'Kukatpally': 1.0
    }

    data = []

    for _ in range(num_samples):
        city = random.choice(cities)
        locality = random.choice(localities[city])
        
        bhk = random.choices([1, 2, 3, 4, 5], weights=[0.15, 0.45, 0.3, 0.08, 0.02])[0]
        
        # Area distribution based on BHK
        if bhk == 1:
            area = int(np.random.normal(500, 100))
        elif bhk == 2:
            area = int(np.random.normal(1000, 200))
        elif bhk == 3:
            area = int(np.random.normal(1600, 300))
        elif bhk == 4:
            area = int(np.random.normal(2500, 500))
        else:
            area = int(np.random.normal(4000, 800))
            
        area = max(300, area) # Ensure sensible minimum
        
        # Bathrooms usually depend on BHK
        bathrooms = max(1, min(bhk + 1, int(np.random.normal(bhk, 0.5))))
        
        # Total floors and specific floor
        total_floors = random.choices([4, 10, 15, 25, 40], weights=[0.2, 0.3, 0.25, 0.15, 0.1])[0]
        floor = random.randint(1, total_floors)
        
        property_age = int(max(0, np.random.normal(10, 8))) # Age in years
        
        # Amenities
        parking = bool(random.choices([True, False], weights=[0.8, 0.2])[0] if bhk > 1 else random.choices([True, False], weights=[0.4, 0.6])[0])
        lift = bool(random.choices([True, False], weights=[0.95, 0.05])[0] if total_floors > 4 else random.choices([True, False], weights=[0.3, 0.7])[0])
        balcony = bool(random.choices([True, False], weights=[0.85, 0.15])[0])
        security = bool(random.choices([True, False], weights=[0.9, 0.1])[0])
        gym = bool(random.choices([True, False], weights=[0.6, 0.4])[0])
        swimming_pool = bool(random.choices([True, False], weights=[0.4, 0.6])[0])
        garden = bool(random.choices([True, False], weights=[0.5, 0.5])[0])
        power_backup = bool(random.choices([True, False], weights=[0.8, 0.2])[0])
        
        furnishing = random.choices(['Unfurnished', 'Semi-Furnished', 'Fully Furnished'], weights=[0.3, 0.5, 0.2])[0]

        # Calculate Price based on realistic rules
        # 1. Base price calculation
        base_rate = base_price_sqft[city] * locality_premium[locality]
        
        # 2. Adjustments
        # Higher floor premium
        floor_premium = 1 + (floor * 0.002) 
        
        # Age depreciation
        age_depreciation = max(0.5, 1 - (property_age * 0.01))
        
        # Amenities premium
        amenities_premium = 1.0
        if parking: amenities_premium += 0.05
        if gym: amenities_premium += 0.03
        if swimming_pool: amenities_premium += 0.04
        if power_backup: amenities_premium += 0.02
        if furnishing == 'Semi-Furnished': amenities_premium += 0.05
        if furnishing == 'Fully Furnished': amenities_premium += 0.12
        
        # Final price calculation with some random market noise (± 10%)
        noise = np.random.uniform(0.9, 1.1)
        
        price = (area * base_rate) * floor_premium * age_depreciation * amenities_premium * noise
        
        data.append({
            'city': city,
            'locality': locality,
            'bhk': bhk,
            'area': area,
            'bathrooms': bathrooms,
            'floor': floor,
            'total_floors': total_floors,
            'property_age': property_age,
            'parking': parking,
            'lift': lift,
            'balcony': balcony,
            'security': security,
            'gym': gym,
            'swimming_pool': swimming_pool,
            'garden': garden,
            'power_backup': power_backup,
            'furnishing': furnishing,
            'price': price
        })

    df = pd.DataFrame(data)
    
    # Save the dataset
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/property_dataset.csv', index=False)
    print(f"Successfully generated {num_samples} samples and saved to 'data/property_dataset.csv'")
    
    return df

if __name__ == "__main__":
    generate_synthetic_data()
