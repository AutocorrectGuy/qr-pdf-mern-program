from watchdog.events import FileSystemEventHandler
from os import listdir
from os.path import isfile, join
from threading import Timer
from Routing.Source.Controller import delete_last, sync_sharepoint
import urllib.parse

# Timer runs each time changes are made in folder. 
# Timer resets to initial time each time another changes are being made in folder
# If timers time has run out, web requests are being made
# In conclusion, web requests are being sent after last change being made in folder

slugBefore = "https://chipperparts.sharepoint.com/sites/QRcatalogue/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FQRcatalogue%2FShared%20Documents%2F"
slugAfter = "&parent=%2Fsites%2FQRcatalogue%2FShared%20Documents%2F"
t = None
secondsDelayTillNewRequest = 5

def resetTimer(files):
  def callBack():
    print(files)
    sync_sharepoint(files)
  global t
  if t != None:
    t.cancel()
  t = Timer(secondsDelayTillNewRequest, callBack)
  t.start() 

def getFileNameSlurs(fileNames):
  result = []
  for fn in fileNames:
    result.__iadd__([slugBefore + urllib.parse.quote(fn).replace(".", "%2E") + slugAfter])
  return result
    

class Handler(FileSystemEventHandler):
  @staticmethod
  def on_any_event(event):
    if event.is_directory:
      return None
    src_path = event.src_path[0:event.src_path.rfind("\\") + 1]
    fileNames = getFileNameSlurs(listdir(src_path))
    resetTimer(fileNames)