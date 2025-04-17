document.addEventListener('DOMContentLoaded', () => {
  searchMeals(''),  
  currentQuery = '';
});

const searchInput = document.getElementById('search');
const recipesContainer = document.getElementById('recipes');
const modal = document.querySelector('.modal');
const modalWrapper = document.querySelector('.modal-wrapper');
const modalContent = document.querySelector('.modal-content');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalIngredients = document.getElementById('modal-ingredients');
const modalInstructions = document.getElementById('modal-instructions');
let currentPage = 1;
let currentQuery = '';
let totalMeals = 0;

function renderMeals(meals) {
  if (!Array.isArray(meals)) {
    console.error('Invalid meals data:', meals);
    meals = [];
  }

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

async function searchMeals(query, page = 1) {
  try {
    const res = await fetch(`http://localhost:3000/api/meals?search=${encodeURIComponent(query)}&page=${page}&limit=12`);
    const { meals = [], total = 0 } = await res.json();

    totalMeals = total;
    currentPage = page;
  
    renderMeals(meals);
    renderPagination(total, page);

  } catch (error) {
    console.error('Error:', error);
    recipesContainer.innerHTML = '<p>Error loading data</p>';
  }
}

function renderPagination(totalItems, currentPage) {
  const pagination = document.getElementById('pagination');
  const limit = 12;
  const totalPages = Math.ceil(totalItems / limit);
  
  let buttons = '';
  
  buttons += `
    <button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" 
            data-page="${currentPage - 1}"
            ${currentPage === 1 ? 'disabled' : ''}>
      ←
    </button>`;

  for(let i = 1; i <= totalPages; i++) {
    buttons += `
      <button class="page-btn ${i === currentPage ? 'active' : ''}" 
              data-page="${i}">
        ${i}
      </button>`;
  }

  buttons += `
    <button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" 
            data-page="${currentPage + 1}"
            ${currentPage === totalPages ? 'disabled' : ''}>
      →
    </button>`;

  pagination.innerHTML = buttons;

  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if(btn.classList.contains('disabled')) return;
      searchMeals(currentQuery, parseInt(btn.dataset.page));
    });
  });
}


searchInput.addEventListener('input', () => {
  currentQuery = searchInput.value.trim();
  currentPage = 1;
  searchMeals(currentQuery, 1);
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
