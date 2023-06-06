import requests

url = "https://minesweeper1.p.rapidapi.com/boards/new"

querystring = {"r":"1","c":"1","bombs":"1"}

headers = {
	"X-RapidAPI-Key": "SIGN-UP-FOR-KEY",
	"X-RapidAPI-Host": "minesweeper1.p.rapidapi.com"
}

response = requests.get(url, headers=headers, params=querystring)

print(response.json())
