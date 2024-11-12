const apiKey = "bd926207a87e457fa367d3b2262875b9";
const popularRecipesURL = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=6`;
const searchRecipesURL = `https://api.spoonacular.com/recipes/autocomplete?apiKey=${apiKey}&number=5&query=`;
let favorites = JSON.parse(localStorage.getItem("favorites")) || []; // Load from localStorage or start with empty array

// Fetch and display popular recipes
document.addEventListener("DOMContentLoaded", function () {
    fetchPopularRecipes();
    setupEventListeners();
});

function fetchPopularRecipes() {
    fetch(popularRecipesURL)
        .then((response) => response.json())
        .then((data) => displayRecipes(data.recipes))
        .catch((error) =>
            console.error("Error fetching popular recipes:", error)
        );
}

function displayRecipes(recipes) {
    const recipeContainer = document.getElementById("recipeContainer");
    recipeContainer.innerHTML = "";

    recipes.forEach((recipe) => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add(
            "bg-white",
            "rounded-lg",
            "shadow-lg",
            "p-4",
            "cursor-pointer",
            "transition",
            "transform",
            "hover:scale-105"
        );
        recipeDiv.innerHTML = `
            <img src="${recipe.image}" alt="${
            recipe.title
        }" class="w-full h-70 object-cover rounded-md">
            <h3 class="text-lg underline decoration-yellow-700 font-semibold mt-2">${
                recipe.title
            }</h3>
            <p class="text-gray-500"><span class="text-red-500">🔥</span> Ready in ${
                recipe.readyInMinutes
            } mins</p>
            <p class="text-gray-600 text-sm mt-1">${
                recipe.summary
                    ? recipe.summary.slice(0, 100) + "..."
                    : "No description available"
            }</p>
        `;

        recipeDiv.onclick = () => fetchRecipeDetails(recipe.id);
        recipeContainer.appendChild(recipeDiv);
    });
}

function fetchRecipeDetails(id) {
    const recipeURL = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;
    fetch(recipeURL)
        .then((response) => response.json())
        .then((data) => showRecipeDetails(data))
        .catch((error) =>
            console.error("Error fetching recipe details:", error)
        );
}

function showRecipeDetails(recipe) {
    const recipeDetails = document.getElementById("recipeDetails");
    recipeDetails.innerHTML = `
        <img src="${recipe.image}" alt="${
        recipe.title
    }" class="w-full h-48 object-cover rounded-md mb-4">
        <h3 class="text-xl font-bold">${recipe.title}</h3>
        <p class="text-gray-500 mt-2">Ready in ${recipe.readyInMinutes} mins</p>
        
        <div class="bg-gradient-to-r from-yellow-100 to-yellow-300 p-4 rounded-lg mt-4">
            <h4 class="text-lg font-semibold">Ingredients</h4>
            <ul class="list-disc list-inside">
                ${recipe.extendedIngredients
                    .map(
                        (ing) =>
                            `<li>${ing.amount} ${ing.unit} ${ing.name}</li>`
                    )
                    .join("")}
            </ul>
        </div>

        <div class="bg-gradient-to-r from-yellow-100 to-yellow-300 p-4 rounded-lg mt-4">
            <h4 class="text-lg font-semibold">Instructions</h4>
            <ol class="list-decimal list-inside">
                ${
                    recipe.analyzedInstructions[0]?.steps
                        .map((step) => `<li>${step.step}</li>`)
                        .join("") || "Instructions not available"
                }
            </ol>
        </div>

        <div class="bg-gradient-to-r from-yellow-100 to-yellow-300 p-4 rounded-lg mt-4">
            <h4 class="text-lg font-semibold">Nutritional Information</h4>
            <p>Calories: ${
                recipe.nutrition?.nutrients.find((n) => n.name === "Calories")
                    ?.amount || "N/A"
            } kcal</p>
            <p>Protein: ${
                recipe.nutrition?.nutrients.find((n) => n.name === "Protein")
                    ?.amount || "N/A"
            } g</p>
            <p>Fat: ${
                recipe.nutrition?.nutrients.find((n) => n.name === "Fat")
                    ?.amount || "N/A"
            } g</p>
            <p>Carbohydrates: ${
                recipe.nutrition?.nutrients.find(
                    (n) => n.name === "Carbohydrates"
                )?.amount || "N/A"
            } g</p>
        </div>
    `;

    const modal = document.getElementById("recipeModal");
    modal.classList.remove("hidden");
    modal.querySelector("div").style.maxHeight = "80vh";
    modal.querySelector("div").style.overflowY = "auto";

    // Setup "Add to Favorites" button with the current recipe
    document.getElementById("addToFavorites").onclick = () =>
        addToFavorites(recipe);
}

// Function to close the modal
function closeModal() {
    document.getElementById("recipeModal").classList.add("hidden");
}

document
    .getElementById("closeModalButton")
    .addEventListener("click", closeModal);

function addToFavorites(recipe) {
    if (!favorites.some((fav) => fav.id === recipe.id)) {
        favorites.push(recipe);
        localStorage.setItem("favorites", JSON.stringify(favorites)); // Save to localStorage
        alert(`${recipe.title} was saved successfully to favorites!`);
    } else {
        alert(`${recipe.title} is already in your favorites.`);
    }
    closeModal();
}

function showFavorites() {
    const favoritesContainer = document.getElementById("favoritesContainer");
    favoritesContainer.innerHTML = "";

    favorites.forEach((recipe) => {
        const favDiv = document.createElement("div");
        favDiv.classList.add(
            "bg-white",
            "rounded-lg",
            "shadow-lg",
            "p-4",
            "mb-4"
        );
        favDiv.innerHTML = `
            <div class="flex items-center">
                <img src="${recipe.image}" alt="${recipe.title}" class="w-16 h-16 object-cover rounded-md mr-4">
                <h3 class="text-lg font-semibold">${recipe.title}</h3>
            </div>
        `;
        favoritesContainer.appendChild(favDiv);
    });

    document.getElementById("favoritesModal").classList.remove("hidden");
}

function closeFavorites() {
    document.getElementById("favoritesModal").classList.add("hidden");
}

function searchRecipes(query) {
    fetch(searchRecipesURL + query)
        .then((response) => response.json())
        .then((data) => displaySearchSuggestions(data))
        .catch((error) =>
            console.error("Error fetching search results:", error)
        );
}

function displaySearchSuggestions(suggestions) {
    const searchSuggestions = document.getElementById("searchSuggestions");
    searchSuggestions.innerHTML = "";
    searchSuggestions.classList.remove("hidden");

    suggestions.forEach((suggestion) => {
        const suggestionDiv = document.createElement("div");
        suggestionDiv.classList.add(
            "p-2",
            "cursor-pointer",
            "hover:bg-yellow-200"
        );
        suggestionDiv.textContent = suggestion.title;
        suggestionDiv.onclick = () => {
            document.getElementById("searchBar").value = suggestion.title;
            searchSuggestions.classList.add("hidden");
            fetchRecipeDetails(suggestion.id);
        };
        searchSuggestions.appendChild(suggestionDiv);
    });
}

function setupEventListeners() {
    document
        .getElementById("viewFavoritesButton")
        .addEventListener("click", showFavorites);
    document
        .getElementById("closeModalButton")
        .addEventListener("click", closeModal);
    document
        .getElementById("closeFavoritesButton")
        .addEventListener("click", closeFavorites);

    document.getElementById("searchBar").addEventListener("input", function () {
        const query = this.value.trim();
        if (query.length >= 3) {
            searchRecipes(query);
        } else {
            document
                .getElementById("searchSuggestions")
                .classList.add("hidden");
        }
    });

    document
        .getElementById("searchButton")
        .addEventListener("click", function () {
            const query = document.getElementById("searchBar").value.trim();
            if (query) {
                searchRecipes(query);
            }
        });

    document.addEventListener("click", (event) => {
        if (
            !document.getElementById("searchBar").contains(event.target) &&
            !document.getElementById("searchSuggestions").contains(event.target)
        ) {
            document
                .getElementById("searchSuggestions")
                .classList.add("hidden");
        }
    });
}
