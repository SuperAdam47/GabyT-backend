const fetch = require('node-fetch')
const credential = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdjOWM3OGUzYjAwZTFiYjA5MmQyNDZjODg3YjExMjIwYzg3YjdkMjAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxODA1ODA0OTU1NTEtNm5vNHRnbGxpcXZzZnY4cWN0Yjl2dXRqaTdna2o4OGguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxODA1ODA0OTU1NTEtNm5vNHRnbGxpcXZzZnY4cWN0Yjl2dXRqaTdna2o4OGguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTY4NDMwODE1NDg5OTQ3ODk5NTYiLCJlbWFpbCI6Im1vcm5lLm5lc2VyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE2OTE5MDQ3MjMsIm5hbWUiOiJNb3Juw6kgTmVzZXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0ZU9LZ09WYTJ2TnNpLUdYclNWVTBYaWhPaHQxTVZEZUs1U2pKN3Fxa0w4PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ik1vcm7DqSIsImZhbWlseV9uYW1lIjoiTmVzZXIiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTY5MTkwNTAyMywiZXhwIjoxNjkxOTA4NjIzLCJqdGkiOiI4NjY2M2I0ZDI2NDVkYjczOTU0NzFmYzU1NzhjMGYxNjI0MWI5YjY4In0.AjThE_AeKvq7vFxQLc_P240ryW-b7m4uJzIdmEWKC64W6mAzj4nx0jx97ZyyjT6uOwpeRrMiVCaHkzEdemtOjzJDKs257Wlkza7Zu6lSutBk4E7Anu6uvIzpi9qpGZiv06kLROtWgwbx0OizkBhJlg1X64mMr_XQ5rM8a28NRdbwbFOvP2JYO_ak9TU0szVyrsh-2N_R0kJg5bv9Ni81cg2Nop7JE1g0UV9XAb6t2ph2vPlyNNytfQAnnaFLKX0zyVTx6VU2HkCh6Mca6ZVwnPkKNFnCXNJvSzRyeBfLMx5m-ld1OZ7232oizav12AhLbvSIU8aCwCQq-rEVHGBZCw"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE4NCwiaWF0IjoxNjkxOTYyODM5LCJleHAiOjE2OTIwMDYwMzl9.PoydYWI7yyLVr9qUhNlajy3vAwjfXujKUGgJRGOl6kU"
/*
fetch("http://localhost:8080/api/login", {
    method: "POST",
//    body: JSON.stringify({ credential }),
//    body: JSON.stringify({ email:"morne.neser@gmail.com", password:"Gesels13s" }),
    body: JSON.stringify({ email:"morne.neser@gmail.com", code: 251943 }),
    headers: { "Content-type": "application/json"}
}).then(res => res.text())
.then(console.log)
.catch(console.log)
*/
fetch("http://localhost:8080/api/prompts", {
    method: "PUT",
    body: JSON.stringify({ ID: 19, promptName: "tl-dr", prompt: "Make it a styled TLDR blurp", persona:"as a proof writer" }),
//    body: JSON.stringify({ ID: 20 }),
    headers: { "Content-type": "application/json", "Authorization": "Bearer " + token}
})
.then(res => res.text())
.then(console.log)
.catch(console.log)

/*
fetch("https://dev.gaby-t.ai/includes/db.php", {
    method: "POST",
    body: JSON.stringify({ page_form: "TwoFactor", gptusername:"morne.neser@gmail.com", gpt2Factor: 251943 }),
    headers: { "Content-type": "application/json"}
}).then(res => res.text())
.then(txt => console.log(txt))
.catch(console.log)
*/