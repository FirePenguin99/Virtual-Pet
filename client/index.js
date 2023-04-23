document.querySelector('#newGame').addEventListener('click', () => localStorage.setItem('newOrLoad', 'new'));

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
  hiveList.textContent = 'Saved Hives:';

  if (hives.length === 0) {
    hiveList.textContent = 'No Hives Saved!';
  }

  for (const hive of hives) {
    const li = document.createElement('li');
    li.textContent = hive.id;

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load';

    loadButton.addEventListener('click', () => loadAndStartGameplay(hive));

    li.append(loadButton);

    hiveList.append(li);
  }
}

function loadAndStartGameplay(hive) {
  localStorage.setItem('newOrLoad', 'load');
  localStorage.setItem('loadedHive', JSON.stringify(hive));
  window.location.href = '/gameplay/index.html';
}

loadHives();
