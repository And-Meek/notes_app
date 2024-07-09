document.addEventListener('click', (event) => {
  if (event.target.dataset.type === 'remove') {
    const id = event.target.dataset.id;
    remove(id).then(() => {
      event.target.closest('li').remove();
    });
  }

  if (event.target.dataset.type === 'edit') {
    const id = event.target.dataset.id;
    const curentTitle = event.target.dataset.value;
    const newTitle = prompt('Измените заметку', curentTitle);
    edit(id, newTitle).then(() => {
      const li = event.target.closest('li');
      li.querySelector('span').innerText = newTitle;
    });
  }
});

async function remove(id) {
  await fetch(`/${id}`, {
    method: 'DELETE',
  });
}

async function edit(id, newTitle) {
  await fetch(`/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({
      id,
      title: newTitle,
    }),
  });
}
