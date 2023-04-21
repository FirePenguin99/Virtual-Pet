import express from 'express';
const app = express();
app.use(express.static('client')); // this serves (hosts) a folder called client, which has its own index.html.

let hives = [
  {
    id: '0001',
    bugsList: ['blud', 'myMan', 'Yosei'],
    entityList: ['house1', 'house2', 'gaff'],
    bugNumber: 3,
    corpseList: [],
  },
  {
    id: '0002',
    bugsList: ['blud', 'myMan', 'Yosei'],
    entityList: ['house1', 'house2', 'gaff'],
    bugNumber: 3,
    corpseList: [],
  },
  {
    id: '0003',
    bugsList: ['blud', 'myMan', 'Yosei'],
    entityList: ['house1', 'house2', 'gaff'],
    bugNumber: 3,
    corpseList: [],
  },
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
