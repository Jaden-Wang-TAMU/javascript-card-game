
 



import tkinter as tk
from tkinter import *
from tkinter import messagebox
from PIL import Image, ImageTk
import time
import json
import requests
import threading
from threading import Event
 
 

 
d = "fbasdihf"

 
def getImages():
    global d
    d = str(requests.get('https://deckofcardsapi.com/api/deck/new/?deck_count=1').json()["deck_id"])
    for i in range(1,53):
        draw = requests.get(f"https://deckofcardsapi.com/api/deck/{d}/draw/?count=1").json()["cards"][0]

        c = draw['suit']
        r = draw['value']

        

        if  c== "HEARTS":
            c = "H"
        elif c == "DIAMONDS":
            c = "D"
        elif c == "SPADES":
            c = "S"
        else:
            c = "C"


        if r == "KING":
            r = "K"
        elif r == "QUEEN":
            r = "Q"
        elif r == "JACK":
            r = "J"
        elif r == "ACE":
            r = "A"
        


        f = open(f"cards/{r}{c}.png","wb")

        response = requests.get(draw["image"])
        f.write(response.content)
        f.close()
 
 

print('Hi')
getImages()
 






