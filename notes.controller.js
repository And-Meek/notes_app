const chalk = require('chalk');
const Note = require('./models/note');

async function addNote(title, owner) {
  await Note.create({ title, owner });

  console.log(chalk.green('Note was added'));
}

async function getNotes() {
  const notes = await Note.find();
  return notes;
}

async function removeNote(id, owner) {
  const result = await Note.deleteOne({ _id: id, owner });
  if (result.matchedCount === 0) {
    throw new Error('No note to delete');
  }

  console.log(chalk.red('Note was removed'));
}

async function updateNote(id, title, owner) {
  const result = await Note.updateOne({ _id: id, title }, owner);
  if (result.matchedCount === 0) {
    throw new Error('No note to edit');
  }
  console.log(chalk.green(`Note with id=${id} was updated`));
}

module.exports = {
  addNote,
  getNotes,
  removeNote,
  updateNote,
};
