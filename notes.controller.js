const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');

const notePath = path.join(__dirname, 'db.json');

async function addNote(title) {
  const notes = await getNotes();

  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);

  await fs.writeFile(notePath, JSON.stringify(notes));
  console.log(chalk.green('Note was added'));
}

async function getNotes() {
  const notes = await fs.readFile(notePath, { encoding: 'utf-8' });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function printNotes() {
  const notes = await getNotes();

  console.log(chalk.bgBlue('Here is the list of notes:'));
  notes.forEach((note) =>
    console.log(chalk.blue(note.id), chalk.blue(note.title))
  );
}

async function removeNote(id) {
  const notes = await getNotes();
  const updatedNotes = notes.filter(
    ({ id: notesId }) => notesId !== String(id)
  );

  await fs.writeFile(notePath, JSON.stringify(updatedNotes));

  console.log(chalk.red('Note was removed'));
}

async function updateNote(id, title) {
  const notes = await getNotes();

  const updatedNotes = notes.map((note) => {
    if (note.id === id) {
      return {
        title,
        id,
      };
    }
    return note;
  });
  await fs.writeFile(notePath, JSON.stringify(updatedNotes));
}

module.exports = {
  addNote,
  getNotes,
  removeNote,
  updateNote,
};
