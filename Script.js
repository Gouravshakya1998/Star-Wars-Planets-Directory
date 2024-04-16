const apiUrl = 'https://swapi.dev/api/planets/?format=json';
  const planetsContainer = document.getElementById('planets');
  const paginationContainer = document.getElementById('pagination');

  let currentPage = 1;

  async function fetchPlanets(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching planets:', error);
    }
  }

  async function displayPlanets() {
    const planetsData = await fetchPlanets(apiUrl + '&page=' + currentPage);

    planetsContainer.innerHTML = '';

    planetsData.results.forEach(planet => {
      const planetCard = document.createElement('div');
      planetCard.classList.add('planet-card');
      planetCard.innerHTML = `
        <h2>${planet.name}</h2>
        <p><strong>Climate:</strong> ${planet.climate}</p>
        <p><strong>Population:</strong> ${planet.population}</p>
        <p><strong>Terrain:</strong> ${planet.terrain}</p>
        <ul class="residents-list"></ul>
      `;
      planetsContainer.appendChild(planetCard);

      planet.residents.forEach(async residentUrl => {
        const residentData = await fetchPlanets(residentUrl);
        const residentList = planetCard.querySelector('.residents-list');
        const residentItem = document.createElement('li');
        residentItem.classList.add('resident-item');
        residentItem.textContent = `${residentData.name} (${residentData.gender}) - Height: ${residentData.height}, Mass: ${residentData.mass}`;
        residentList.appendChild(residentItem);
      });
    });

    renderPagination(planetsData);
  }

  function renderPagination(planetsData) {
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Prev';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
      currentPage--;
      displayPlanets();
    });

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = !planetsData.next;
    nextButton.addEventListener('click', () => {
      currentPage++;
      displayPlanets();
    });

    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(nextButton);
  }

  displayPlanets();