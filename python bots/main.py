from Doggy.Watcher import Watcher
import os
# FJenz%20581%202022%20EN%2Epdf
src_path = open(os. getcwd() + "\\python bots\\enter_path_here.txt").read()
# src_path = open(os. getcwd() + "\\enter_path_here.txt").read()
fileWatcher = Watcher(src_path)
fileWatcher.run()