import requests
import json
from Defaults import Route, Json

s = requests.Session()

def post_login():
  print(">>> Authorization request sent.")
  s.post(Route.login, json=Json.loginJSON)

def get_logout():
  print(">>> Logout POST request sent.")
  s.get(Route.logout)
  
def post_new_card(json):
  print(">>> Upload request sent.")
  requests.post(Route.postNewLink, json=json, headers=Json.headers)

def get_links_data():
  print(">>> All links data request sent.")
  return json.loads(requests.get(Route.allLinksData).text)

def print_links_data():
  print(get_links_data())

def delete_one(obj):
  print(">>> Deleting one link: ")
  print(">>> _id: " + obj["link"] + ", _id: " + obj["_id"])
  s.delete(Route.deleteOne + obj["_id"])