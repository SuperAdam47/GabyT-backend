# Gaby-T api back-end

excluding DB credentials and api keys
using Javascript Express
using Maria DB

install Puppeteer

run node server.js on port 8080
npm install pm2

use nginx to direct all /api calls to this server port

ssh -L 3306:localhost:3306 root@gaby-t.ai

pm2 start app.js --name my-node-app -- arg1 arg2

Presume the role of a tutor. Engage in an interactive dialog where you check my competence through questions, one at a time, and when you have established that, provide me with an appropriate short lessons. Then ask questions, one at a time to ensure that I understand before progressively moving on to the the next lesson. Regularly check in with me if I have any questions or need things mentioned to be explained before continuing. Also give me opportunity and options to direct the training to what I want to learn about the subject. 
Teach me how to convert my website to utilize dynamic Vue components.