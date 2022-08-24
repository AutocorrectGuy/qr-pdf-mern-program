# Pamācība (shrepoint bota iestatana)
## 1. Python uzstādīšana
##### 1.1. Lejuplādēt python
  Links: https://www.python.org/downloads/
##### 1.2. Instalēt python izmantojot lejuplādēto failu
  Faila nosaukums: *python-3.10.6-amd64.exe* (vai līdzīgs).
  **Svarīgi**: Pirmajā instalēšanas solī atzīmēt ķeksīti lodziņā *Add Python to PATH*
  
## 2. Lejuplādēt un uzstādīt izstrādāto programmu: 
  Links: https://github.com/AutocorrectGuy/qr-pdf-mern-program/blob/main/python%20bots.rar
##### 2.1. Izvērst *.rar* failu 
  Gadījumā, ja nav iespējams izvērst (extract) failu *python bots.rar*, lejuplādēt un instalēt aplikāciju, kura spēs to izdarīt.
  Links uz šo aplikāciju: https://www.win-rar.com/predownload.html?&L=0
##### 2.2. Instalēt python pakotnes
  Atvērt failu *install-pyton-libraries.bat*. Kad fails tiks palaists, uz īsu brīdi atvērsies *windows command propmt* lodziņš. Pakas lejuplādēsies, instalēsies, un tad šis lodziņš aizvērsies
##### 2.3. Izvēlēties mapītes direktoriju, kuras faili tiks sinhronizēti
  *Šajā solī ir jāsameklē mape, kurā glabājas un glabāsies visi katalogi, kurus gribēs publicēt onlainā.*
  Atvērt failu *enter_path_here.txt*. Failā būs ievadīts paraugs ar direktoriju, kurš tika izmantots, lai testētu programmu. Jūsu uzdevums: ievadīt savu mērķ-direktoriju, kurā glabāsies faili. Rezultātam jāizskatās apmēram šādi:
`````
C:\Users\autoc\Desktop\sharepoint-faili
`````
##### 2.4. Palaist izstrādāto python botu: *main.pyw* (atvērt ar python)
  Piezīmes: palast tikai vienreiz. Kad programma tiek atvērta, nekam acīmredzami nav jānotiek. Lai pārbaudītu, vai programma ir atvērta, var atvērt "windows task manager" (ctrl + shift + esc): procesa nosaukums: "python.exe". Viss darbojas pareizi, ja palaists viens "python.exe" process.
 
 
 Kad bots ir palaists, izvēlētajā mapītē (kura tika izvēlēta 2.3. solī) jebkurš ievietotais faila nosaukums tiks augšuplādēts datubāzē, kurš reizē parādīsies https://www.qrkodi.herokuapp.com/. Faila nosaukumam automātiski tiek pievienots sharepoint adreses teksts, kas rezultātā rada īsto Microsoft Sharepoint url adresi uz konkrēto failu.
