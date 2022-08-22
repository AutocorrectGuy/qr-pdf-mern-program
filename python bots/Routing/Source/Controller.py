import requests
import json
from Routing.Config import Routes, Credentials

s = requests.Session()

def post_login():
  print(">>> Authorization request sent.")
  s.post(Routes.login, json=Credentials.loginJSON)

def get_logout():
  print(">>> Logout POST request sent.")
  s.get(Routes.logout)
  
def post_new_card(json):
  print(">>> Upload request sent. Entry name: `" + json["name"] + "'.")
  requests.post(Routes.postNewLink, json=json, headers=Credentials.headers)

def get_links_data():
  print(">>> All links data request sent.")
  res = requests.get(Routes.allLinksData)
  return json.loads(res.text)

def print_links_data():
  print(get_links_data())

def delete_last():
  print(">>> Deleting last entry: ")
  # select last entry in database
  data = get_links_data()
  lastLink = data[len(data) - 1]
  print(">>> _id: " + lastLink["link"] + ", _id: " + lastLink["_id"])
  s.delete(Routes.deleteOne + lastLink["_id"])

def sync_sharepoint(sharepointFileNames):
  print(">>> Syncing with sharepoint...")
  jsonData = {
    "fileNames": sharepointFileNames
  }
  s.post(Routes.syncSharepoint, json=jsonData, headers=Credentials.headers)
  print(">>> Sync finished!")