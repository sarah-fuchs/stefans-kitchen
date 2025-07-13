let selected = [];
let ingredientsToBeDisabled = [];

const recipes = [
  { ingredients: ["🍞", "🥓", "🧀"], dish: "🥪", name: "Sandwich" },
  { ingredients: ["🥚", "🥛", "🧈"], dish: "🥞", name: "Pancakes" },
  { ingredients: ["🥫", "🧀", "🫓"], dish: "🍕", name: "Pizza" },
  { ingredients: ["🥚", "🧈", "🍞"], dish: "🍳", name: "Eggs on Toast" },
  { ingredients: ["🍚", "🍤", "🥒"], dish: "🍱", name: "Sushi Plate" },
  { ingredients: ["🥫", "🥦", "🥕", "🧄", "🧅", "🥜"], dish: "🍲", name: "Peanut Stew" },
  { ingredients: ["🍚", "🥫", "🫚", "🧅", "🥦", "🌶️"], dish: "🍛", name: "Thai Curry" },
  { ingredients: ["🍗", "🥫", "🧄", "🧅"], dish: "🥘", name: "Tomato Chicken Skillet" },
  { ingredients: ["🍞", "🥩", "🍅", "🥬", "🧀"], dish: "🍔", name: "Cheeseburger" },
  { ingredients: ["🍅", "🥬", "🥒"], dish: "🥗", name: "Salad" },
  { ingredients: ["🧆", "🫓", "🥬", "🍅"], dish: "🥙", name: "Falafel Sandwich" },
  { ingredients: ["🥖", "🥓", "🧀"], dish: "🫕", name: "Fondue" },
  { ingredients: ["🌽", "🧈"], dish: "🍿", name: "Popcorn" },
  { ingredients: ["🥔", "🧂"], dish: "🍟", name: "Fries" },
  { ingredients: ["🥛", "🍓"], dish: "🍨", name: "Strawberry Ice Cream" },
];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("recipe-count").textContent = recipes.length;
}); 

const combos = {};
recipes.forEach(combo => {
  const key = generateKey(combo.ingredients);
  combos[key] = {
    dish: combo.dish,
    name: combo.name
  };
});

function generateKey(ingredients) {
  return [...ingredients].sort().join("+");
}

function init() {
  updateResetButtonState();
}

const sortedKey = generateKey(selected);

function toggleIngredient(button, emoji) {

  // check ob button gruen ist
  // => zutat entfernen
  // falls nicht gruen
  // alles wie bisher

  if (button.classList.contains("selected")) {
    // unselect
    selected = selected.filter(item => item !== emoji);
    button.classList.remove("selected");
  } else {
    // select
    if (selected.includes(emoji)) return;
    selected.push(emoji);
    button.classList.add("selected");
  }

  updatePlate();
  updateIngredients();
  updateRecipeInfo();
  updateResetButtonState();

  const sortedKey = [...selected].sort().join("+");

  if (combos[sortedKey]) {
    const result = combos[sortedKey];
    document.getElementById("dish").textContent = result.dish;

    const noArticle = new Set(["Popcorn", "Pancakes", "Eggs on Toast", "Fries"]);
    const article = noArticle.has(result.name) ? "" : "a ";

    document.getElementById("message").textContent = `You made ${article}${result.name}!`;

  } else {
    document.getElementById("dish").textContent = "";
    document.getElementById("message").textContent = "";
  }
}

function updateResetButtonState() {
  if (selected.length > 0) {
    document.getElementById('reset-button').classList.remove('disabled')
  } else {
    document.getElementById('reset-button').classList.add('disabled')
  }
}

function updateIngredients() {
  let ingredientsToBeDisplayed = [];
  document.querySelectorAll(".ingredients button").forEach(button => {
    button.classList.remove("disabled");
  });

  recipes.forEach(combo => {
    const isMatch = selected.every(ingredient =>
      combo.ingredients.includes(ingredient)
    );

    if (isMatch) {
      combo.ingredients.forEach(ingredient => {
        if (!selected.includes(ingredient) && !ingredientsToBeDisplayed.includes(ingredient)) {
          ingredientsToBeDisplayed.push(ingredient);
        }
      });
    }
  });

  document.querySelectorAll(".ingredients button").forEach(button => {
    const value = button.textContent.trim();

    if (
      !selected.includes(value) &&
      !ingredientsToBeDisplayed.includes(value)
    ) {
      button.classList.add("disabled");
    }
  });
}


function updatePlate() {
  const plate = document.getElementById("plate");
  if (selected.length === 0) {
    plate.textContent = "🍽️";
  } else {
    plate.textContent = selected.join(" + ");
  }
}

function resetPlate() {
  selected = [];
  updatePlate();
  document.getElementById("dish").textContent = "";
  document.getElementById("message").textContent = "";

  document.querySelectorAll(".ingredients button").forEach(button => {
    button.classList.remove("disabled");
    button.classList.remove("selected");
  });
  updateRecipeInfo();
}

function updateRecipeInfo() {
  let matchingCombos = 0;

  recipes.forEach(combo => {
    const isMatch = selected.every(ingredient =>
      combo.ingredients.includes(ingredient)
    );

    if (isMatch) {
      matchingCombos++;
    }
  });

  const recipeCount = document.getElementById("recipe-count");
  if (matchingCombos === 1) {
    recipeCount.textContent = `1`;
  } else {
    recipeCount.textContent = `${matchingCombos}`;
  }
}


init();