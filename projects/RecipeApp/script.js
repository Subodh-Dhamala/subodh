const searchBox = document.getElementById("search-box");
const searchBtn = document.getElementById("searchBtn");
const randomBtn = document.getElementById("randomBtn");
const recipeContainer = document.getElementById("recipe-container");

const recipeModal = document.querySelector(".recipeModal");
const recipeDetailsContent = document.querySelector(".recipeDetailsContent");
const recipeClose = document.querySelector(".recipeClose");

const handleViewClick = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p><strong>Area:</strong> ${meal.strArea}</p>
    <br>
    <p>${meal.strInstructions}</p>
  `;

  recipeModal.style.display = "flex";
};

const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await response.json();

    recipeContainer.innerHTML = "";

    if (!data.meals) {
      recipeContainer.innerHTML =
        "<h2>No recipes found! Try 'Cake' or 'Random Dish'</h2>";
      return;
    }

    data.meals.forEach((meal) => {
      const card = document.createElement("div");
      card.className = "recipe-card";

      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p>${meal.strArea}</p>
        <p>${meal.strCategory}</p>
      `;

      const viewRecipe = document.createElement("button");
      viewRecipe.textContent = "View Recipe";
      viewRecipe.className = "viewRecipe";

      card.appendChild(viewRecipe);
      recipeContainer.appendChild(card);

      viewRecipe.addEventListener("click", () => handleViewClick(meal));
    });
  } catch (error) {
    recipeContainer.innerHTML =
      "<h2>Error loading recipes. Please try again.</h2>";
  }
};

const fetchRandomMeal = async () => {
  recipeContainer.innerHTML = "<h2>Fetching a random dish...</h2>";

  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const data = await response.json();

    recipeContainer.innerHTML = "";

    const meal = data.meals[0];

    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
      <p>${meal.strArea}</p>
      <p>${meal.strCategory}</p>
    `;

    const viewRecipe = document.createElement("button");
    viewRecipe.textContent = "View Recipe";
    viewRecipe.className = "viewRecipe";

    card.appendChild(viewRecipe);
    recipeContainer.appendChild(card);

    viewRecipe.addEventListener("click", () => handleViewClick(meal));
  } catch (error) {
    recipeContainer.innerHTML = "<h2>Failed to fetch random dish.</h2>";
  }
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const query = searchBox.value.trim();
  if (query) fetchRecipes(query);
});

// Random dish
randomBtn.addEventListener("click", fetchRandomMeal);

// Close modal
recipeClose.addEventListener("click", () => {
  recipeModal.style.display = "none";
});

// Close modal when clicking outside content
recipeModal.addEventListener("click", (e) => {
  if (e.target === recipeModal) {
    recipeModal.style.display = "none";
  }
});

