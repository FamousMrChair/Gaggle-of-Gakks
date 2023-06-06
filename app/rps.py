# The start of cheating rock paper scissors (I'll never lose again.)
import random

def throw():
    numbergenerator = random.randint(0, 2)
    if numbergenerator == 0:
        return "rock"
    if numbergenerator == 1:
        return "paper"
    if numbergenerator == 2:
        return "scissors"

for i in range(10):
    print(throw())  