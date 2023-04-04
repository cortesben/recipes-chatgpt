const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());

mongoose.set('strictQuery', false);

// connect to MongoDB
mongoose.connect('mongodb://localhost/recipes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log(error);
});

// define recipe schema
const recipeIngredients = new mongoose.Schema({
  item: String,
  amount: String
});

const recipeImage = new mongoose.Schema({
  location: String,
  caption: String,
  required: false
});

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [recipeIngredients],
  instructions: [String],
  image: [recipeImage]
});

// define recipe model
const Recipe = mongoose.model('Recipe', recipeSchema);

// CRUD operations

// create a new recipe
app.post('/recipes', async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const result = await recipe.save();
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

// read all recipes
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.send(recipes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// read a single recipe
app.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send();
    }
    res.send(recipe);
  } catch (error) {
    res.status(500).send(error);
  }
});

// update a recipe
app.put('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) {
      return res.status(404).send();
    }
    res.send(recipe);
  } catch (error) {
    res.status(400).send(error);
  }
});

// delete a recipe
app.delete('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).send();
    }
    res.send(recipe);
  } catch (error) {
    res.status(500).send(error);
  }
});

// start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
