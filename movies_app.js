const tmdbURL_KEY = "d8e5b8d5b82e83d072e0336202d6524b";
const tmdbAPI_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbURL_KEY}&append_to_response=videos,images`;
let watchlist = [];

document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript file is loaded");

    const searchBar = document.getElementById("searchBar");
    const searchSuggestions = document.getElementById("search-suggestions");
    const searchButton = document.getElementById("search__icon");
    const homeButton = document.getElementById("home__button");

    loadPopularMovies();

    function loadPopularMovies() {
        fetch(tmdbAPI_URL)
            .then((response) => response.json())
            .then((data) => {
                const movies = data.results;
                displayMovies(movies);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }

    function displayMovies(movies) {
        const movieContainer = document.getElementById("movie-container");
        movieContainer.innerHTML = "";

        movieContainer.classList.add(
            "grid",
            "grid-cols-2",
            "sm:grid-cols-3",
            "lg:grid-cols-4",
            "xl:grid-cols-5",
            "gap-6",
            "p-6"
        );

        movies.forEach((movie) => {
            const movieDiv = document.createElement("div");
            movieDiv.classList.add(
                "movie",
                "bg-white",
                "rounded-lg",
                "shadow-lg",
                "overflow-hidden"
            );

            movieDiv.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-full h-70 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-semibold">${movie.title}</h3>
                    <p class="text-blue-600 font-bold">Rate: ${movie.vote_average}</p>
                </div>
            `;

            movieDiv.onclick = () => {
                showMovieDetails(movie);
            };

            movieContainer.appendChild(movieDiv);
        });
    }

    function showMovieDetails(movie) {
        const movieDetails = document.getElementById("movieDetails");
        movieDetails.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-90 h-40 object-cover mb-4">
            <h3 class="text-xl font-bold">${movie.title}</h3>
            <p class="text-gray-700 mt-2">${movie.overview}</p>
            <p class="text-gray-500 mt-2">Release Date: ${movie.release_date}</p>
            <p class="text-gray-500">Rating: ${movie.vote_average}</p>
        `;

        document.getElementById("addToWatchlist").onclick = function () {
            addToWatchlist(movie);
        };

        const movieModal = document.getElementById("movieModal");
        movieModal.classList.remove("hidden");
    }

    function closeModal() {
        const movieModal = document.getElementById("movieModal");
        movieModal.classList.add("hidden");
    }

    function addToWatchlist(movie) {
        if (!watchlist.find((item) => item.id === movie.id)) {
            watchlist.push(movie);
            alert(`${movie.title} added to watchlist!`);
        } else {
            alert(`${movie.title} is already in your watchlist.`);
        }
        closeModal();
    }

    function showWatchlist() {
        const watchlistContainer =
            document.getElementById("watchlistContainer");
        watchlistContainer.innerHTML = "";

        watchlist.forEach((movie) => {
            const movieDiv = document.createElement("div");
            movieDiv.classList.add(
                "movie",
                "bg-white",
                "rounded-lg",
                "shadow-lg",
                "overflow-hidden",
                "mb-4"
            );

            movieDiv.innerHTML = `
                <div class="flex flex-row gap-6">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="w-90 h-40 object-cover">
                    <div class="p-4">
                        <h3 class="text-lg font-semibold">${movie.title}</h3>
                        <p class="text-gray-600">Rate: ${movie.vote_average}</p>
                    </div>
                </div>
            `;

            watchlistContainer.appendChild(movieDiv);
        });

        const watchlistModal = document.getElementById("watchlistModal");
        watchlistModal.classList.remove("hidden");
    }

    function closeWatchlist() {
        const watchlistModal = document.getElementById("watchlistModal");
        watchlistModal.classList.add("hidden");
    }

    searchBar.addEventListener("input", function () {
        const query = searchBar.value.trim();
        if (query.length < 3) {
            searchSuggestions.classList.add("hidden");
            return;
        }

        const tmdbSearchURL = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbURL_KEY}&query=${query}&language=en-US&page=1`;

        fetch(tmdbSearchURL)
            .then((response) => response.json())
            .then((data) => {
                const movies = data.results;
                displaySearchSuggestions(movies);
            })
            .catch((error) =>
                console.error("Error fetching search results:", error)
            );
    });

    function displaySearchSuggestions(movies) {
        searchSuggestions.innerHTML = "";
        searchSuggestions.classList.remove("hidden");

        movies.forEach((movie) => {
            const suggestionDiv = document.createElement("div");
            suggestionDiv.classList.add(
                "p-2",
                "cursor-pointer",
                "hover:bg-blue-200"
            );
            suggestionDiv.innerText = movie.title;

            suggestionDiv.addEventListener("click", function () {
                searchBar.value = movie.title;
                searchSuggestions.classList.add("hidden");
                fetchMovieById(movie.id);
            });

            searchSuggestions.appendChild(suggestionDiv);
        });
    }

    function fetchMovieById(movieId) {
        const tmdbMovieURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbURL_KEY}&append_to_response=videos,images`;
        fetch(tmdbMovieURL)
            .then((response) => response.json())
            .then((data) => {
                displayMovies([data]);
            })
            .catch((error) =>
                console.error("Error fetching movie by ID:", error)
            );
    }

    searchButton.addEventListener("click", function () {
        const query = searchBar.value.trim();
        if (query) {
            const tmdbSearchURL = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbURL_KEY}&query=${query}&language=en-US&page=1`;

            fetch(tmdbSearchURL)
                .then((response) => response.json())
                .then((data) => {
                    const movies = data.results;
                    displayMovies(movies);
                    searchSuggestions.classList.add("hidden");
                })
                .catch((error) =>
                    console.error("Error fetching search results:", error)
                );
        }
    });

    homeButton.addEventListener("click", loadPopularMovies);
    document
        .getElementById("viewWatchlistButton")
        .addEventListener("click", showWatchlist);

    document.addEventListener("click", (event) => {
        if (
            !searchBar.contains(event.target) &&
            !searchSuggestions.contains(event.target)
        ) {
            searchSuggestions.classList.add("hidden");
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal();
            closeWatchlist();
        }
    });
});
