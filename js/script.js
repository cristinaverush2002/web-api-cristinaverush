document.addEventListener('DOMContentLoaded', function () {
  fetchDataByCategory();
});

async function fetchDataByCategory() {
  const categoryDropdown = document.getElementById('category-dropdown');
  const selectedCategory = categoryDropdown.value;

  const peopleContainer = document.getElementById('people-container');

  if (!peopleContainer.dataset.originalContent) {
    peopleContainer.dataset.originalContent = peopleContainer.innerHTML;
  }

  const originalContent = peopleContainer.dataset.originalContent;

  peopleContainer.innerHTML = '';

  if (selectedCategory === 'photos') {
    await fetchPhotosWithPagination(1, peopleContainer);
  } else if (selectedCategory === 'videos') {
    await fetchVideosWithPagination(1, peopleContainer);
  }

  peopleContainer.dataset.originalContent = originalContent;
}

async function fetchPhotosWithPagination(page) {
  const peopleContainer = document.getElementById('people-container');

  try {
    const apiKey = 'kfSWDeLjuHr4e1CoCx7MqTRbTWQBU4KTlbGGdpRQREjclVI1tZSPEyq1';
    const response = await fetch(`https://api.pexels.com/v1/curated?page=${page}&per_page=10`, {
      headers: {
        'Authorization': apiKey
      }
    });
    const data = await response.json();
    const photos = data.photos;

    const columns = Array.from({ length: 3 }, () => document.createElement('div'));
    columns.forEach((col, index) => col.classList.add(`col-${index + 1}`));

    photos.forEach((photo, index) => {
      const personCard = document.createElement('div');
      personCard.classList.add('person');
      personCard.classList.add(`category-${photo.category}`);
      personCard.innerHTML = `
             <img src="${photo.src.large}" alt="${photo.photographer}" class="card-img-top">
            <div class="overlay">
                <div class="person-name">
                    <h5>${photo.photographer}</h5>
                </div>
            </div>
        `;

      columns[index % 3].appendChild(personCard);
    });

    columns.forEach(col => peopleContainer.appendChild(col));

    if (data.next_page) {
      fetchPhotosWithPagination(page + 1);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function fetchVideosWithPagination(page) {
  const peopleContainer = document.getElementById('people-container');

  try {
    const apiKey = 'kfSWDeLjuHr4e1CoCx7MqTRbTWQBU4KTlbGGdpRQREjclVI1tZSPEyq1';
    const response = await fetch(`https://api.pexels.com/videos/popular?page=${page}&per_page=10`, {
      headers: {
        'Authorization': apiKey
      }
    });

    const data = await response.json();
    const videos = data.videos;

    const columns = Array.from({ length: 3 }, () => document.createElement('div'));
    columns.forEach((col, index) => col.classList.add(`col-${index + 1}`));

    videos.forEach((video, index) => {
      const videoCard = document.createElement('div');
      videoCard.classList.add('video');
      videoCard.classList.add(`category-${video.category}`);

      videoCard.style.margin = '10px';

      videoCard.innerHTML = `
        <video width="100%" height="100%" controls>
          <source src="${video.video_files[0].link}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div class="overlay">
          <div class="person-name">
            <h5>${video.user.name}</h5>
          </div>
        </div>
      `;

      columns[index % 3].appendChild(videoCard);
    });

    peopleContainer.innerHTML = '';
    columns.forEach(col => peopleContainer.appendChild(col));

    if (data.next_page) {
      fetchVideosWithPagination(page + 1);
    }
  } catch (error) {
    console.error('Error fetching video data:', error);
  }
}


function filterByCategory(category) {
  const peopleContainer = document.getElementById('people-container');
  const personCards = Array.from(peopleContainer.children);

  personCards.forEach(card => {
    const categoryClassList = Array.from(card.classList).filter(className => className.startsWith('category-'));

    if (categoryClassList.length === 0 || categoryClassList.includes(`category-${category}`)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}


function sortPhotographersAlphabetically() {
  const peopleContainer = document.getElementById('people-container');
  const personCards = Array.from(peopleContainer.children);

  personCards.sort((a, b) => {
    const nameA = a.querySelector('.person-name h5').innerText.toLowerCase();
    const nameB = b.querySelector('.person-name h5').innerText.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  clearAndAppendToContainer(personCards, peopleContainer);
}

function sortPhotographersReverseAlphabetically() {
  const peopleContainer = document.getElementById('people-container');
  const personCards = Array.from(peopleContainer.children);

  personCards.sort((a, b) => {
    const nameA = a.querySelector('.person-name h5').innerText.toLowerCase();
    const nameB = b.querySelector('.person-name h5').innerText.toLowerCase();
    return nameB.localeCompare(nameA);
  });

  clearAndAppendToContainer(personCards, peopleContainer);
}

function clearAndAppendToContainer(cards, container) {
  container.innerHTML = '';
  cards.forEach(card => {
    container.appendChild(card);
  });
}

function searchPhotographers() {
  const peopleContainer = document.getElementById('people-container');
  const searchInput = document.getElementById('search-input').value.toLowerCase();
  const personCards = Array.from(peopleContainer.children);

  personCards.forEach(card => {
    const photographerName = card.querySelector('.person-name h5').innerText.toLowerCase();
    if (photographerName.includes(searchInput)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

