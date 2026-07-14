import requests
from bs4 import BeautifulSoup
import time
import os
import re

# Configuration
BASE_URL = "https://islandleaf.vercel.app"
ADMIN_USER = "nova"
ADMIN_PASS = "nova"
PKR_TO_JMD = 0.46

CATEGORIES = {
    "SUV": "https://www.pakwheels.com/used-cars/suv/107776",
    "Sedan": "https://www.pakwheels.com/used-cars/sedan/107775",
    "Hatchback": "https://www.pakwheels.com/used-cars/hatchback/107774",
    "Pickup": "https://www.pakwheels.com/used-cars/pick-up/266837",
    "Luxury": "https://www.pakwheels.com/used-cars/search/-/mk_mercedes-benz/",
    "Performance": "https://www.pakwheels.com/used-cars/search/-/q_sports/"
}

session = requests.Session()

def login():
    print(f"Logging in to {BASE_URL}...")
    try:
        resp = session.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USER,
            "password": ADMIN_PASS
        }, timeout=10)
        if resp.status_code == 200:
            print("Successfully logged in.")
            return True
        print(f"Login failed: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"Login error: {e}")
    return False

def reset_catalog():
    print("Resetting catalog...")
    try:
        resp = session.delete(f"{BASE_URL}/api/products/reset", timeout=30)
        if resp.status_code == 200:
            print("Catalog cleared.")
        else:
            print(f"Reset failed: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"Reset error: {e}")

def parse_price(price_str):
    # Example: "PKR 45.5 lacs" or "PKR 1.25 crore"
    try:
        price_str = price_str.lower()
        match = re.search(r'([\d.]+)', price_str)
        if not match:
            return 1500000 # Default if unknown
        
        val = float(match.group(1))
        if "lac" in price_str:
            pkr = val * 100000
        elif "crore" in price_str:
            pkr = val * 10000000
        else:
            pkr = val
            
        return int(pkr * PKR_TO_JMD)
    except:
        return 1500000

def scrape_category(cat_name, cat_url, limit=200):
    strains = []
    page = 1
    print(f"\n--- Scraping Category: {cat_name} ---")
    
    while len(cars) < limit:
        url = f"{cat_url}?page={page}" if "?" not in cat_url else f"{cat_url}&page={page}"
        print(f"Fetching page {page} ({len(cars)}/{limit})...")
        try:
            resp = session.get(url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            }, timeout=15)
            if resp.status_code != 200:
                print(f"Failed to fetch page {page}: {resp.status_code}")
                break
                
            soup = BeautifulSoup(resp.text, 'html.parser')
            # Selector from browser investigation
            listings = soup.select('li.well.search-list-clearfix.ad-listing')
            if not listings:
                # Fallback to a broader selector
                listings = soup.select('.well.search-list-clearfix')
            if not listings:
                # Fallback for non-browser response (seen in grep)
                listings = soup.select('li.classified-listing')
            
            if not listings:
                print("No more listings found on this page.")
                break
                
            for ad in listings:
                try:
                    title_elem = ad.select_one('a.car-name.ad-detail-path h3') or ad.select_one('a.car-name.ad-detail-path')
                    if not title_elem: continue
                    name = title_elem.text.strip()
                    
                    price_elem = ad.select_one('.price-details .price') or ad.select_one('.price-details') or ad.select_one('.generic-white.fs18')
                    price_str = price_elem.text.strip() if price_elem else "0"
                    price_kes = parse_price(price_str)
                    
                    img_elem = ad.select_one('img.lazy') or ad.select_one('.img-box img')
                    img_url = img_elem.get('data-original') or img_elem.get('src')
                    if img_url and img_url.startswith('//'):
                        img_url = 'https:' + img_url
                        
                    details = ad.select('ul.search-strain-info li') or ad.select('ul.search-strain-info-list li')
                    year = details[0].text.strip() if len(details) > 0 else "2020"
                    mileage_str = details[1].text.strip() if len(details) > 1 else "0"
                    mileage = re.sub(r'[^\d]', '', mileage_str) or "0"
                    fuel = details[2].text.strip() if len(details) > 2 else "Petrol"
                    
                    # Engine and Transmission are often grouped in the 4th item or split
                    engine_trans = details[3].text.strip() if len(details) > 3 else "1500 cc . Automatic"
                    parts = engine_trans.split('.')
                    engine = parts[0].strip() if len(parts) > 0 else "1500 cc"
                    trans = parts[-1].strip() if len(parts) > 1 else "Automatic"
                    
                    strains.append({
                        "name": name,
                        "price": price_kes,
                        "image_url": img_url,
                        "category": cat_name,
                        "make": name.split(' ')[0],
                        "year": year,
                        "mileage": mileage,
                        "fuel_type": fuel,
                        "engine_capacity": engine,
                        "transmission": trans,
                        "description": f"Beautiful {name} available for sale. Features: {fuel}, {trans}, {engine}."
                    })
                    
                    if len(cars) >= limit:
                        break
                except Exception as e:
                    print(f"  Error parsing listing: {e}")
                    
            page += 1
            time.sleep(1) 
        except Exception as e:
            print(f"  Request error: {e}")
            break
            
    return strains

def upload_car(car):
    try:
        # No need to download image anymore, send URL directly
        if not car['image_url'] or 'placeholder' in car['image_url']:
            print(f"Skipping {car['name']} (no image)")
            return
            
        data = {
            'name': car['name'],
            'description': car['description'],
            'price': str(car['price']),
            'category': car['category'],
            'make': car['make'],
            'year': car['year'],
            'condition': 'Used',
            'transmission': car['transmission'],
            'engine_capacity': car['engine_capacity'],
            'fuel_type': car['fuel_type'],
            'mileage': car['mileage'],
            'stock': '1',
            'image_url': car['image_url'], # Direct URL
            'features': 'Air Conditioning, Power Steering, Power Windows, ABS, Airbags, Sunroof'
        }
        
        # Sending as regular form data (application/x-www-form-urlencoded or multipart)
        resp = session.post(f"{BASE_URL}/api/products", data=data, timeout=30)
        if resp.status_code == 201:
            print(f"Uploaded: {car['name']} ({car['category']})")
            return True
        else:
            print(f"Upload failed for {car['name']}: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"Upload error for {car['name']}: {e}")
    return False

def main():
    if not login():
        return
        
    reset_catalog()
    
    total_uploaded = 0
    for cat_name, cat_url in CATEGORIES.items():
        strains = scrape_category(cat_name, cat_url, limit=200)
        print(f"Found {len(cars)} strains for {cat_name}. Uploading...")
        for strain in strains:
            if upload_car(car):
                total_uploaded += 1
        time.sleep(2) # Gap between categories
        
    print(f"\nDone! Total strains uploaded: {total_uploaded}")

if __name__ == "__main__":
    main()
