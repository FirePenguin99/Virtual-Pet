document.querySelector('#newGame').addEventListener('click', () => localStorage.setItem('newOrLoad', 'new'));
document.querySelector('#loadGame').addEventListener('click', () => localStorage.setItem('newOrLoad', 'load'));

const hiveList = document.querySelector('#hiveList');
let hives;

async function loadHives() {
  const response = await fetch('hives');
  if (response.ok) {
    hives = await response.json();
    console.log(hives);
  } else {
    hives = ['failed to load hives :-('];
  }

  showHives();
}


/* Add an array of messages to the page */
function showHives() {
  hiveList.textContent = '';

  for (const hive of hives) {
    const li = document.createElement('li');
    li.textContent = hive.id;

    const loadButton = document.createElement('button');
    const spectateButton = document.createElement('button');
    loadButton.textContent = 'Load';
    spectateButton.textContent = 'Spectate';

    loadButton.addEventListener('click', () => loadAndStartGameplay(hive));
    spectateButton.addEventListener('click', () => loadAndStartSpecate(hive));

    li.append(loadButton);
    li.append(spectateButton);

    hiveList.append(li);
  }
}

function loadAndStartGameplay(hive) {
  localStorage.setItem('newOrLoad', 'load');
  localStorage.setItem('loadedHive', JSON.stringify(hive));
  window.location.href = '/gameplay/index.html';
}

function loadAndStartSpecate(hive) {
  localStorage.setItem('newOrLoad', 'spectate');
  localStorage.setItem('loadedHive', JSON.stringify(hive));
  window.location.href = '/gameplay/index.html';
}

loadHives();
