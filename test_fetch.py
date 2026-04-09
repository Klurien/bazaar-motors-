import requests
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}
url = "https://www.pakwheels.com/used-cars/suv/107776"
resp = requests.get(url, headers=headers)
with open("pakwheels_test.html", "w") as f:
    f.write(resp.text)
print(f"Status: {resp.status_code}")
if "well search-list-clearfix" in resp.text:
    print("Found listings!")
else:
    print("Listings not found in HTML.")
