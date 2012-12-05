//Augment String object to have function that removes white space that is more than 1 character long
String.prototype.reduceWhiteSpace = function() {
    return this.replace(/\s+/g, ' ');
};

var fs = require('fs');
var Crawler = require('simplecrawler').Crawler;
var $ = require('jquery');

var currentURL = '/Recipe/Premier-Cheesecake-Cranberry-Bars/Detail.aspx';
//var myCrawler = new Crawler('allrecipes.com', currentURL, 80);


//Original Recipe URL: /Recipe/Premier-Cheesecake-Cranberry-Bars/Detail.aspx
recipes = [];

var findRecipe = function(recipeURL) {
  var myCrawler = new Crawler('allrecipes.com', recipeURL, 80);
  myCrawler.interval = 3000;        //Retrieve every 3 seconds
  myCrawler.maxConcurrency = 1;
  myCrawler.discoverResources = false;  //Retrieve all contents only - don't auto-parse and download page components

  myCrawler.on("fetchcomplete",function(queueItem, responseBuffer, response) {
    //console.log("I just received %s (%d bytes)",queueItem.url,responseBuffer.length);
    //console.log("It was a resource of type %s",response.headers['content-type']);

    // Do something with the data in responseBuffer
    //console.log(responseBuffer.toString());
    
    //Write the source data to file
    fs.writeFile('source.html', responseBuffer, function (err) {
  		if (err) throw err;
  		//console.log('It\'s saved!');
	
	  });
  });

  //Start crawling site
  myCrawler.start();

  //Read source HTML and put into string format
  var sourceBuffer = fs.readFileSync('source.html');
  var source = sourceBuffer.toString();

  //Find Recipe Title
  var recipeTitle = $(source).find('title').html().match(/(.*)-/)[1].trim();
  //console.log(recipeTitle);

  //Get Ingredients
  var materialIngredients = [];
  $(source).find('ul.ingredient-wrap').find('span.ingredient-name').each(function(index,value) {
    materialIngredients[index] = $(value).html();
  });
  //console.log(materialIngredients);

  //Get Quantities
  var amounts = [];
  $(source).find('ul.ingredient-wrap').find('span.ingredient-amount').each(function(index,value) {
    amounts[index] = $(value).html();
  });
  //console.log(amounts);

  //Form Ingredient List
  var ingredients = [];
  $(materialIngredients).each(function(index,value) {
    ingredients[index] = amounts[index] + ' ' + value;
  });
  //console.log(ingredients);

  //Get Directions
  var directions = [];
  $(source).find('div.directions').find('span.plaincharacterwrap').each(function(index,value) {
    directions[index] = $(value).html();
  });
  //console.log(directions);

  //Get Prep Time
  var prepTime = $(source).find('#prepMinsSpan').html().replace(/<[^>]*>/g, '');
  //console.log(prepTime); 

  //Get Cook Time
  var cookTime = $(source).find('#cookMinsSpan').html().replace(/<[^>]*>/g, '');
  //console.log(cookTime);

  //Get Total Time Until Ready
  var readyTime = $(source).find('#totalHoursSpan').html().replace(/<[^>]*>/g, '');
  //console.log(readyTime); 

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

  //Find Next Recipe
  var nextRecipeURL = $(source).find('#anchorNextRecipe').attr('href');
  var nextRecipe = nextRecipeURL.match(/^.*?(?=\?)/)[0].trim();

  //Save recipe in array of recipes, set next recipe URL
  recipes[recipes.length] = recipe;
  currentURL = nextRecipe;
  console.log(currentURL);

  return nextRecipe;
}

do {findRecipe(currentURL)}
while(recipes[0] != recipes[recipes.length]);


