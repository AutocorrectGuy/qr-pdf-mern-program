from Doggy.Watcher import Watcher
import os
print(os. getcwd())
src_path = open(os. getcwd() + "\\enter_path_here.txt").read()
# print("watching the directory: " + src_path)
fileWatcher = Watcher(src_path)
fileWatcher.run()