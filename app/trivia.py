import requests

def get_question():
    API_URL = f"https://the-trivia-api.com/v2/questions"

    r = requests.get(API_URL) #creating a response object that will get us the information we needr
    api_dict = r.json() #r.json() returns a dictonary after deconding the response object
    id = (api_dict[0])["id"]
    
    question = (api_dict[0])["question"]['text']
    correctAnswer= (api_dict[0])["correctAnswer"]
    incorrectAnswers = ''
    for i in range(len((api_dict[0])["incorrectAnswers"])):
        incorrectAnswers = incorrectAnswers + (api_dict[0])["incorrectAnswers"][i] + ', '
    return id + ' \n' + question + ' \n' + correctAnswer + '\n' + incorrectAnswers

for i in range(20):
    print(get_question())