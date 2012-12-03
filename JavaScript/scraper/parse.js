//Add fs and jquery libraries
var fs = require('fs');
var $ = require('jquery');

//Read source HTML and put into string format
var sourceBuffer = fs.readFileSync('source.html');
var source = sourceBuffer.toString();

//Find Recipe Title
var recipeTitle = $(source).find('title').html().match(/(.*)-/)[1].trim();
console.log(recipeTitle);

//Get Ingredients
var materialIngredients = [];
$(source).find('ul.ingredient-wrap').find('span.ingredient-name').each(function(index,value) {
  materialIngredients[index]=$(value).html();
});
//console.log(materialIngredients);

//Get Quantities
var amounts = [];
$(source).find('ul.ingredient-wrap').find('span.ingredient-amount').each(function(index,value) {
  amounts[index]=$(value).html();
});
//console.log(amounts);

//Form Ingredient List
var ingredients = [];
$(materialIngredients).each(function(index,value) {
  ingredients[index] = amounts[index] + ' ' + value;
});
console.log(ingredients);

//Get Directions
var directions = [];
$(source).find('div.directions').find('span.plaincharacterwrap').each(function(index,value) {
  directions[index] = $(value).html();
});
console.log(directions);

//Get Prep Time
var prepTime = $(source).find('#prepMinsSpan').html().replace(/<[^>]*>/g, "");
console.log(prepTime); 

//Get Cook Time
var cookTime = $(source).find('#cookMinsSpan').html().replace(/<[^>]*>/g, "");
console.log(cookTime);

//Get Total Time Until Ready
var readyTime = $(source).find('#totalHoursSpan').html().replace(/<[^>]*>/g, "");
console.log(readyTime); 

//Create Recipe Object
var recipe = {
  name: recipeTitle,
  ingredients: ingredients,
  directions: directions,
  prepTime: prepTime,
  cookTime: cookTime,
  readyTime: readyTime
}
console.log(recipe);
