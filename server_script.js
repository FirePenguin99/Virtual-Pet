import express from 'express';
const app = express();
app.use(express.static('client')); // this serves (hosts) a folder called client, which has its own index.html.

let hives = [
];

function getHives(req, res) {
  res.json(hives);
}
function postHives(req, res) {
  hives = [...hives.slice(0, 9), req.body];
  console.log(hives);
  res.json(hives);
}

app.get('/hives', getHives);
app.post('/hives', express.json(), postHives);

app.listen(8080);
