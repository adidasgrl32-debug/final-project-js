const API_KEY = '7fb7e6c5';
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const moviesGrid = document.querySelector('.movies');
const resultsCount = document.querySelector('#resultsCount');
const sortSelect = document.querySelector('#sortSelect');

let currentMovies = [];

/* EVENT LISTENER */
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchMovies(searchTerm);
  }
});

function showSkeletons() {
  const skeletons = Array.from({ length: 10 }, () => {
    return `<div class="movie-card skeleton">
      <div class="movie-card__img skeleton__img"></div>
      <h2 class="movie-card__title skeleton__title"></h2>
      <p class="movie-card__year skeleton__year"></p>
    </div>`;
  }).join("");

  moviesGrid.innerHTML = skeletons;
}

/* FETCH MOVIES */
async function fetchMovies(searchTerm) {
  showSkeletons();

  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`);
  const data = await res.json();

  if (data.Response === "True") {
    currentMovies = data.Search;
    resultsCount.textContent = `Showing: ${searchTerm}`;
    sortSelect.style.display = 'default';
    displayMovies(currentMovies);
  } else {
    resultsCount.textContent = `Showing: ${searchTerm}`;
    moviesGrid.innerHTML = `<p class="no-results">No movies found for "${searchTerm}".</p>`;
    currentMovies = [];
  }
}

/* DISPLAY MOVIES */
const displayMovies = (movies) => {
  const movieResults = movies.map((movie) => {
    const poster = movie.Poster !== 'N/A' ? movie.Poster : '';

    return `<div class="movie-card">
      <img class="movie-card__img" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      <h2 class="movie-card__title">${movie.title}</h2>
      <p class="movie-card__year">${movie.release_date?.slice(0, 4) || "N/A"}</p>
    </div>
  `;
  }).join("");

  moviesGrid.innerHTML = movieResults;

// Add event listener after displaying movies //
moviesGrid.querySelectorAll('.movie-card__img').forEach(img => {
  img.addEventListener('click', () => {
    const movieTitle = img.alt;
    const movie = currentMovies.find(m => m.title === movieTitle);
  });
});
};

/*  SORT MOVIES */
sortSelect.addEventListener('change', (event) => {
  sortMovies(event.target.value);
});

function sortMovies(sortType) {
  let sortedMovies = [...currentMovies];

if (sortType === 'a to z') {
  sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
}else if (sortType === 'z to a') {
  sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
}else if (sortType === 'newest') {
  sortedMovies.sort((a, b) => Number(b.Year) - Number(a.Year));
}else if (sortType === 'oldest') {
  sortedMovies.sort((a, b) => Number(a.Year) - Number(b.Year));
}

displayMovies(sortedMovies);
}

function getMovies(event) {
  getMovies(event.target.value);
}

setTimeout(() => {
  getMovies();
}, 1000);

async function getMovies() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { title: "Movie 1", release_date: "2020-01-01", poster_path: "/movie1.jpg" },
        { title: "Movie 2", release_date: "2021-01-01", poster_path: "/movie2.jpg" }
      ]);
    }, 1000);
  });
}