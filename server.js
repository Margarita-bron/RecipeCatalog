const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/api/meals', async (req, res) => {
  try {
    const { search } = req.query;
    const url = search 
      ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
      : 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert';

    const apiRes = await fetch(url);
    const data = await apiRes.json();
    res.json(data.meals || []);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'API request failed' });
  }
});

app.listen(3000, () => {
  console.log(`Сервер запущен на http://localhost:${3000}`);
});