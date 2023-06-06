import http.client

conn = http.client.HTTPSConnection("minesweeper1.p.rapidapi.com")

headers = {
    'X-RapidAPI-Key': "955171d53fmshdbf33da3892fb58p14c3dcjsn9cf0c834973d",
    'X-RapidAPI-Host': "minesweeper1.p.rapidapi.com"
}

conn.request("GET", "/boards/new?r=1&c=1&bombs=1", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))