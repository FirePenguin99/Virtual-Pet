import express from 'express';
const app = express();
app.use(express.static('client')); // this serves (hosts) a folder called client, which has its own index.html.
app.listen(8080);
