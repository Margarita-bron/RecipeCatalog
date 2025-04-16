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






















async function showDetails(mealId) {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await res.json();
    const meal = data.meals[0];
    
    modalTitle.textContent = meal.strMeal;
    modalImage.src = meal.strMealThumb;
    modalInstructions.textContent = meal.strInstructions;
    
    modalIngredients.innerHTML = getIngredientsList(meal)
      .map(item => `<div>${item}</div>`)
      .join('');

    modal.style.display = 'block';
  } catch (error) {
    console.error('Error:', error);
    alert('Error loading recipe details');
  }
}

document.querySelector('.close-btn').onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = 'none';
}

function getIngredientsList(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]?.trim()) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    }
  }
  return ingredients;
}