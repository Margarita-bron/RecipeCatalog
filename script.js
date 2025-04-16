document.addEventListener('DOMContentLoaded', searchMeals(''));

const searchInput = document.getElementById('search');
const recipesContainer = document.getElementById('recipes');
/*const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalIngredients = document.getElementById('modal-ingredients');
const modalInstructions = document.getElementById('modal-instructions');*/

function renderMeals(meals) {
  recipesContainer.innerHTML = meals.length ? meals.map(meal => `
    <div class="recipe-card" data-id="${meal.idMeal}">
      <h3>${meal.strMeal}</h3>
      <img src="${meal.strMealThumb}/preview" alt="${meal.strMeal}">
      <p>${meal.strInstructions ? meal.strInstructions.slice(0, 100) + '...' : 'Description is missing'}</p>
    </div>
  `).join('') : '<p>Nothing found</p>';

  document.querySelectorAll('.recipe').forEach(card => {
    card.addEventListener('click', () => {
      showDetails(card.dataset.id);
    });
  });
}

async function searchMeals(query) {
  try {
    const res = await fetch(`http://localhost:3000/api/meals?search=${encodeURIComponent(query)}`);
    const meals = await res.json();
    renderMeals(meals);
  } catch (error) {
    console.error('Error:', error);
    recipesContainer.innerHTML = '<p>Error loading data</p>';
  }
}

searchInput.addEventListener('input', () => {
  searchMeals(searchInput.value.trim());
});

