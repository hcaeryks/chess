const { exec } = require("child_process");
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(express.static("dist/public"));
app.use(cors());

function os_func() {
  this.execCommand = function (cmd) {
      return new Promise((resolve, reject)=> {
         exec(cmd, (error, stdout, stderr) => {
           if (error) {
              reject(error);
              return;
          }
          resolve(stdout)
         });
     })
 }
}
var os = new os_func();

app.get('/getmove', async (req, res) => {
  console.time("mula");
  os.execCommand('mula.exe '+req.query.fen).then(r => {
    res.send(r);
  });
  console.timeEnd("mula");
});

app.listen(port, () => {
  console.log(`Running server at port ${port}`);
});

