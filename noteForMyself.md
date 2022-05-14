### "pre-todo-checklist" for deploying website

## if someone else takes over the project, than:

  1. I used vs code as my text editor. Plugins: 
    * postCSS Language Support (to remove errors from tailwind.css input file)
    * Tailwind CSS IntelliSense (to get code suggestions when adding styles in classes in html,js,jsx files)
    * REST Client for checking GET/POST/PUT/DELETE requests from "./route.rest" file. You can use postman or other programs to test requests as well
    * Procfile is requested for deploying on Heroku. You may not need this file if deploying on other servers
    * If you are still using mongodb database, remember to define .env variables there. Remember, that they are not posted on github because of obvious reasons, so you have to securely re-define them in mongodb homepage (acessed in settings).
    * remember to check .gitignore file if you are trying to publish this site elsewhere from github. There are a lot of files that are not on github, but are generated remotely on heroku when deploying website heroku server
    * dev-dependencies will not be pushed into heroku, so be carefull and check package-json files for that reason if there is some error about missing dependencies

### Each time when re-deploying website: 

## Remember-1
  to change proxies before deploying the website
  Main proxies are:   
    "proxy": "https://qrkodi.herokuapp.com",
    "proxy": "http://localhost:3001/",
  They have to be changed in "./frontend/src/setupProxy.js"

## Remember!-2
  to check if frontend ("./frontend/src/App.js") Links are as same as "./routes/**.js" links. Otherwise they will not open outside app (you just wouldn't be able to send links like ...herokuap.com/myspecialink to other people)

## Remember-3
  Commit the new update to github;
  "git push heroku main" in main project directory to push the github source to heroku