document.addEventListener('DOMContentLoaded', searchMeals(''));

const searchInput = document.getElementById('search');
const recipesContainer = document.getElementById('recipes');
const modal = document.querySelector('.modal');
const modalWrapper = document.querySelector('.modal-wrapper');
const modalContent = document.querySelector('.modal-content');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalIngredients = document.getElementById('modal-ingredients');
const modalInstructions = document.getElementById('modal-instructions');

function renderMeals(meals) {
  recipesContainer.innerHTML = meals.length ? meals.map(meal => `
    <div class="recipe-card" data-id="${meal.idMeal}">
      <h3>${meal.strMeal}</h3>
      <img class="recipe-card__img" src="${meal.strMealThumb}/preview" alt="${meal.strMeal}" loading="lazy">
    </div>
  `).join('') : '<p>Nothing found</p>';

  recipesContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.recipe-card');
    if (card) showDetails(card.dataset.id);
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
    modalContent.style.backgroundImage = `url('${meal.strMealThumb}') no-repeat`;
    
    
    modalIngredients.innerHTML = getIngredientsList(meal)
    .map(item => `
      <tr>
        <td>${item.ingredient}</td>
        <td>${item.measure || '-'}</td>
      </tr>
    `).join('');

    modal.classList.add('active');
  } catch (error) {
    console.error('Error:', error);
    alert('Error loading recipe details');
  }
}

document.querySelector('.close').addEventListener('click', () => {
  modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
  if (e.target === modalWrapper) modal.classList.remove('active');
});

function getIngredientsList(meal) {
  const ingredients = [];
  
  for(let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if(ingredient?.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: (measure || '').trim() 
      });
    }
  }
  
  return ingredients;
}