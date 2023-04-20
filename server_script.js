import express from 'express';
const app = express();
app.use(express.static('client')); // this serves (hosts) a folder called client, which has its own index.html.

const hives = [
  {
    id: '0001',
    currentObj: 'blud',
    bugsList: ['blud', 'myMan', 'Yosei'],
    entityList: ['house1', 'house2', 'gaff'],
    bugNumber: 3,
    corpseList: [],
  },
  {
    id: '0002',
    currentObj: 'blud',
    bugsList: ['blud', 'myMan', 'Yosei'],
    entityList: ['house1', 'house2', 'gaff'],
    bugNumber: 3,
    corpseList: [],
  },
  {
    id: '0003',
    currentObj: 'blud',
    bugsList: ['blud', 'myMan', 'Yosei'],
    entityList: ['house1', 'house2', 'gaff'],
    bugNumber: 3,
    corpseList: [],
  },
];

function getHives(req, res) {
  res.json(hives);
}

app.get('/hives', getHives);

app.listen(8080);
