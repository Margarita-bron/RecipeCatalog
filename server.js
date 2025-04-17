const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/api/meals', async (req, res) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const url = search 
      ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
      : 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert';

    const apiRes = await fetch(url);
    const data = await apiRes.json();
    let meals = data.meals || [];

    if (!search && meals.length > 0) {
      meals = await Promise.all(meals.slice(0, 20).map(async meal => {
        const detailRes = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        );
        const detailData = await detailRes.json();
        return detailData?.meals?.[0] || null;
      }));
      meals = meals.filter(Boolean);
    }
    const start = (page - 1) * limit;
    const end = start + parseInt(limit);
    const paginatedMeals = meals.slice(start, end);

    res.json({
      meals: paginatedMeals,
      total: meals.length,
      hasMore: end < meals.length
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      meals: [],
      total: 0,
      hasMore: false 
    });
  }
});

app.listen(3000, () => {
  console.log(`Сервер запущен на http://localhost:${3000}`);
});