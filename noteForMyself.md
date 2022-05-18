### "pre-todo-checklist" for deploying website

## if someone else takes over the project, than:

  I used vs code as my text editor. Plugins: 
  1. postCSS Language Support (to remove warnings from tailwind.css input file)
  2. Tailwind CSS IntelliSense (to get code suggestions when adding styles in classes in html,js,jsx files)
  3. REST Client for testing GET/POST/PUT/DELETE requests from "./route.rest" file. You can use postman or other programs to test requests as well
  4. Procfile is requested for deploying on Heroku. You may not need this file if deploying on other servers
  5. If you are still using mongodb database, remember to define .env variables there. Remember, that they are not posted on github because of obvious reasons, so you have to securely re-define them in mongodb homepage (acessed in settings).
  6. remember to check .gitignore file if you are trying to publish this site elsewhere from github. There are a lot of files that are not on github, but are generated remotely on heroku when deploying website heroku server
  7. dev-dependencies will not be pushed into heroku, so be carefull and check package-json files for that reason if there is some error about missing dependencies