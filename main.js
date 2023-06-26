const { exec } = require("child_process");
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(express.static("dist/public"));
app.use(cors());

app.get('/getmove', (req, res) => {
  console.time("teste");
  exec("./test "+req.query.fen, (error, stdout, stderr) => {res.send(stdout);console.log(stdout)});
  console.timeEnd("teste");
});

app.listen(port, () => {
  console.log(`Running server at port ${port}`);
});

