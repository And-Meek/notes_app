const express = require('express');
const chalk = require('chalk');
const path = require('path');
const {
  addNote,
  getNotes,
  removeNote,
  updateNote,
} = require('./notes.controller');

const PORT = 3001;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/', async (req, res) => {
  res.render('index', {
    title: 'Express App',
    notes: await getNotes(),
    created: false,
  });
});

app.post('/', async (req, res) => {
  await addNote(req.body.title);
  res.render('index', {
    title: 'Express App',
    notes: await getNotes(),
    created: true,
  });
});

app.delete('/:id', async (req, res) => {
  await removeNote(req.params.id);
  res.render('index', {
    title: 'Express App',
    notes: await getNotes(),
    created: false,
  });
});

app.put('/:id', async (req, res) => {
  await updateNote(req.params.id, req.body.title);
  res.render('index', {
    title: 'Express App',
    notes: await getNotes(),
    created: false,
  });
});

// const server = http.createServer(async (req, res) => {
//   if (req.method === 'GET') {
//     const content = await fs.readFile(path.join(basePath, 'index.html'));

//     res.writeHead(200, {
//       'Content-Type': 'text/html',
//     });
//     res.end(content);
//   } else if (req.method === 'POST') {
//     res.writeHead(200, {
//       'Content-Type': 'text/html,charset: utf-8',
//     });
//     const body = [];

//     req.on('data', (data) => {
//       body.push(Buffer.from(data));
//     });

//     req.on('end', () => {
//       const title = body.toString().split('=')[1].replaceAll('+', ' ');
//       addNote(title);
//       res.end(`Title = ${title}`);
//     });
//   }
// });

app.listen(PORT, () => {
  console.log(chalk.green(`server has been started on port ${PORT}...`));
});
