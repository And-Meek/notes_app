require('dotenv').config();

const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const {
  addNote,
  getNotes,
  removeNote,
  updateNote,
} = require('./notes.controller');
const { addUser, loginUser } = require('./user.controller');
const auth = require('./middlewares/auth');

const PORT = 3001;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/login', async (req, res) => {
  res.render('login', {
    title: 'Express App',
    error: undefined,
  });
});

app.post('/login', async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);

    res.cookie('token', token, { httpOnli: true });

    res.redirect('/');
  } catch (e) {
    res.render('register', {
      title: 'Express App',
      error: e.message,
    });
  }
});

app.get('/register', async (req, res) => {
  res.render('register', {
    title: 'Express App',
    error: undefined,
  });
});

app.post('/register', async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);
    res.redirect('/login');
  } catch (e) {
    if (e.code === 11000) {
      res.render('register', {
        title: 'Express App',
        error: 'Email is already registred',
      });
      return;
    }
    console.log(e);
    res.render('register', {
      title: 'Express App',
      error: e.message,
    });
  }
});

app.get('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true });

  res.redirect('./login');
});

app.use(auth);

app.get('/', async (req, res) => {
  res.render('index', {
    title: 'Express App',
    notes: await getNotes(),
    userEmail: req.user.email,
    created: false,
    error: false,
  });
});

app.post('/', async (req, res) => {
  try {
    await addNote(req.body.title, req.user.email);
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: true,
      error: false,
    });
  } catch (e) {
    console.error('Creation error', e);
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: true,
    });
  }
});

app.delete('/:id', async (req, res) => {
  try {
    await removeNote(req.params.id, req.user.email);
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message,
    });
  }
});

app.put('/:id', async (req, res) => {
  try {
    await updateNote(req.params.id, req.body.title, req.user.email);
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    res.render('index', {
      title: 'Express App',
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message,
    });
  }
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
const URL = process.env.MONGOOSE_CONNECT_STRING;

mongoose.connect(URL).then(() => {
  app.listen(PORT, () => {
    console.log(chalk.green(`server has been started on port ${PORT}...`));
  });
});
