import Controller

def testPosting():
  Controller.post_login()
  for i in range(8):
    Controller.post_new_card({
      "name": "bot-upload-" + str(i*2),
      "link": "https://www.google.lv/" + str(i),
      "color1": "#FFFFFF",
      "color2": "#FF00" + str(i) + "0",
      "username": "bot-1"
    })
  Controller.get_logout()
# testPosting()

# select last entry in database
data = Controller.get_links_data()
lastLink = data[len(data) - 1]

Controller.delete_one(lastLink)