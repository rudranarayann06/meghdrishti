import requests


URL = "https://api.imd.gov.in/api/v1/aws_data"

params = {
    "sid": 10
}

response = requests.get(
    URL,
    params=params,
    timeout=30
)

print("URL:", response.url)
print("STATUS:", response.status_code)
print("HEADERS:", response.headers)

print("\nRESPONSE:")
print(response.text[:5000])