import time
from watchdog.observers import Observer
from App.Handler import Handler

class Watcher:
  def __init__(self, path):
    self.observer = Observer()
    self.path = path
  def run(self):
    event_handler = Handler()
    self.observer.schedule(event_handler, self.path, recursive=True)
    self.observer.start()
    try:
      while True:
        time.sleep(1)
    except:
      self.observer.stop()
      print("Watchdog has done its work. Woof, woof!")
    self.observer.join()