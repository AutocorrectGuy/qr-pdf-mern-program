import Controller

def upload_one(json):
  Controller.post_login()
  Controller.post_new_card(json)
  Controller.get_logout()