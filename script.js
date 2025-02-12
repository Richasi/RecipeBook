document.addEventListener("DOMContentLoaded", loadRecipes);

document.getElementById("recipe-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("recipe-name").value.trim();
    const ingredients = document.getElementById("ingredients").value.trim();
    const steps = document.getElementById("steps").value.trim();
    const imageFile = document.getElementById("recipe-image").files[0];

    if (!name || !ingredients || !steps) {
        alert("Please fill in all fields.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageUrl = imageFile ? e.target.result : "";

        const recipe = { name, ingredients, steps, imageUrl };
        saveRecipe(recipe);
    };
    if (imageFile) {
        reader.readAsDataURL(imageFile);
    } else {
        saveRecipe({ name, ingredients, steps, imageUrl: "" });
    }
});

function saveRecipe(recipe) {
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipes.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    loadRecipes();
    document.getElementById("recipe-form").reset();
}

function loadRecipes() {
    const container = document.getElementById("recipes-container");
    container.innerHTML = "";
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

    recipes.forEach((recipe, index) => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");

        card.innerHTML = `
            <img src="${recipe.imageUrl || "default.jpg"}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Steps:</strong> ${recipe.steps}</p>
            <button onclick="deleteRecipe(${index})">Delete</button>
        `;

        container.appendChild(card);
    });
}

function deleteRecipe(index) {
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipes.splice(index, 1);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    loadRecipes();
}

document.getElementById("search").addEventListener("input", function () {
    let query = this.value.toLowerCase();
    let cards = document.querySelectorAll(".recipe-card");

    cards.forEach(card => {
        let title = card.querySelector("h3").textContent.toLowerCase();
        let ingredients = card.querySelector("p").textContent.toLowerCase();
        card.style.display = title.includes(query) || ingredients.includes(query) ? "block" : "none";
    });
});
