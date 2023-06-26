const express = require('express')
const app = express()
const port = 3000
const { exec } = require("child_process");
app.get('/', (req, res) => {
  console.time("teste");
  exec("./test "+req.query.fen, (error, stdout, stderr) => res.send(stdout));
  console.timeEnd("teste");

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

