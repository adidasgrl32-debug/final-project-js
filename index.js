const API_KEY = "7fb7e6c5";
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const moviesGrid = document.querySelector("#moviesGrid");
const resultsCount = document.querySelector("#resultsCount");
const sortSelect = document.querySelector("#sortSelect");

let currentMovies = [];

/* EVENT LISTENER */
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchMovies(searchTerm);
  }
});

/* SHOW SKELETONS */
function showSkeletons() {
  const skeletons = Array.from({ length: 10 }, () => {
    return `<div class="movie-card skeleton">
    <div class="movie-card__img skeleton__img"> </div>
    <h2 class="movie-card__title skeleton__title"></h2>
    <p class="movie-card__year skeleton__year"></p>
  </div>`;
  }).join("");

  console.log({ moviesGrid });

  moviesGrid.innerHTML = skeletons;
}

function clearSkeletons() {
  const skeletons = document.querySelectorAll(".skeleton");
  skeletons.forEach((skeleton) => skeleton.remove());
}

setTimeout(() => {
  const skeletons = document.querySelectorAll(".skeleton");
  skeletons.forEach((skeleton) => skeleton.remove());
});

/* FETCH MOVIES */
async function fetchMovies(searchTerm) {
  showSkeletons();

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`,
  );
  const data = await res.json();

  if (data.Response === "True") {
    currentMovies = data.Search;
    console.log({ resultsCount });
    resultsCount.textContent = `Showing: ${searchTerm}`;
    if (sortSelect) {
      sortSelect.style.display = "default";
    }
    displayMovies(currentMovies);
  } else {
    resultsCount.textContent = `Showing: ${searchTerm}`;
    if (moviesGrid) {
      moviesGrid.innerHTML = `<p class="no-results">No movies found for "${searchTerm}".</p>`;
    }
    currentMovies = [];
  }
}

/* DISPLAY MOVIES */
const displayMovies = (movies) => {
  const movieResults = movies
    .map((movie) => {
      const poster = movie.Poster !== "N/A" ? movie.Poster : "";

      return `<div class="movie-card">
      ${poster ? `<img class="movie-card__img" src="${poster}" alt="${movie.Title}" />` : '<div class="movie-card__poster-placeholder">No Image</div>'}
      <h2 class="movie-card__title">${movie.Title}</h2>
      <p class="movie-card__year">${movie.Year}</p>
    </div>
  `;
    })
    .join("");

  moviesGrid.innerHTML = movieResults;

  moviesGrid.querySelectorAll(".movie-card__img").forEach((img) => {
    img.addEventListener("click", () => {
      const movieTitle = img.alt;
      const movie = currentMovies.find((m) => m.Title === movieTitle);
      if (!movie) return;

      return fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&t=${movie.Title}`,
      )
        .then((response) => response.json())
        .then((data) => {
          const movieDetails = `
        Title: ${data.Title}
        Year: ${data.Year}
        `;
        });
    });
  });

function displayMovieDetails(movie) {
  const movieDetails = `
    <h2>${movie.Title}</h2>
    <p>Year: ${movie.Year}</p>
  `;
}

  /* SORT MOVIES */
  sortSelect.addEventListener("change", (event) => {
    sortMovies(event.target.value);
  });
};

function sortMovies(sortType) {
  let sortedMovies = [...currentMovies];

  if (sortType === "a to z") {
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortType === "z to a") {
    sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (sortType === "newest") {
    sortedMovies.sort((a, b) => Number(b.Year) - Number(a.Year));
  } else if (sortType === "oldest") {
    sortedMovies.sort((a, b) => Number(a.Year) - Number(b.Year));
  }
  return displayMovies(sortedMovies);
}

function filterMovies(event) {
  const searchTerm = event.target.value.toLowerCase();
  const filteredMovies = currentMovies.filter((movie) =>
    movie.Title.toLowerCase().includes(searchTerm),
  );
  displayMovies(filteredMovies);
}

/*
PROMISE
*/

async function fetMovieDetails() {
  return new Promise((resolve, reject) => {
    const movieTitle = event.target.alt;
    const movie = currentMovies.find((m) => m.Title === movieTitle);

    if (!movie) {
      reject(new Error("Movie not found"));
      return;
    }

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${movie.Title}`)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}