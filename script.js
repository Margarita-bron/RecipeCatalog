document.addEventListener('DOMContentLoaded', function() {
  fetchAllRecipes();
});

function fetchAllRecipes() {
  const apiUrl = './recipes.json';

  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          displayRecipes(data);
      })
      .catch(error => console.error('There was a problem with the fetch operation:', error));
}

document.getElementById('search-form').addEventListener('input', function(event) {
  event.preventDefault();
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  searchRecipes(query);
});

function searchRecipes(query) {
  const apiUrl = './recipes.json';

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          const filteredRecipes = data.filter(recipe => 
              recipe.title.toLowerCase().includes(query)
          );
          displayRecipes(filteredRecipes);
      })
      .catch(error => console.error('There was a problem with the fetch operation:', error));
}




document.getElementById('add-recipe-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const title = document.getElementById('new-recipe-title').value;
  const image = document.getElementById('new-recipe-image').value;
  const description = document.getElementById('new-recipe-description').value;

  // Здесь вы можете добавить код для сохранения нового рецепта
  // Например, отправить его на сервер или сохранить в локальном хранилище
});

function displayRecipes(recipes) {
  const recipesSection = document.getElementById('recipes');
  recipesSection.innerHTML = '';

  recipes.forEach(recipe => {
      const recipeCard = document.createElement('div');
      recipeCard.classList.add('recipe-card');
      
      let description = recipe.description;
      if (recipe.description.length > 300) {
        description = `${recipe.description.slice(0,300)}...`;
      }
      if(!recipe.image) {
        recipeCard.innerHTML = `
          <h2>${recipe.title}</h2>
          <iframe src="https://www.youtube.com/embed/${recipe.id}" frameborder="0" allowfullscreen></iframe>
          <p>${description}</p>
          <button class="delete-button" data-id="${recipe.id}?autoplay=1&mute=1">Удалить</button>`;
      } else {
        recipeCard.innerHTML = `
        <h2>${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}">
        <p>${description}</p>
        <button class="delete-button" data-id="${recipe.id}">Удалить</button>`;
      }
      
      recipeCard.addEventListener('click', () => openModal(recipe));
      recipesSection.appendChild(recipeCard);
      
      recipeCard.querySelector('.delete-button').addEventListener('click', function() {
          deleteRecipe(recipe.id);
      });
  });
}

const modal = document.getElementById('recipe-modal');
const closeBtn = document.querySelector('.close');
const modalTitle = document.getElementById('modal-title');
const modalVideo = document.getElementById('modal-video');
const modalDescription = document.getElementById('modal-description');

// Функция для открытия модального окна
function openModal(recipe) {
  modalTitle.textContent = recipe.title;
  modalDescription.textContent = recipe.description;
  
  // Очищаем предыдущее видео
  modalVideo.innerHTML = '';
  
  // Если есть video_id, добавляем iframe
  if (recipe.video) {
    modalVideo.innerHTML = `
      <iframe 
        width="100%" 
        height="400" 
        src="https://www.youtube.com/embed/${recipe.video_id}" 
        frameborder="0" 
        allowfullscreen>
      </iframe>`;
  }

  modal.style.display = 'block';
}

// Закрытие модального окна
closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = 'none';
}

function deleteRecipe(id) {
  // Здесь добавьте код для удаления рецепта
  console.log(`Рецепт с ID ${id} удален.`);
}

function saveRecipesToLocal(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

function loadRecipesFromLocal() {
  const recipes = localStorage.getItem('recipes');
  return recipes ? JSON.parse(recipes) : [];
}