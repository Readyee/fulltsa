document.addEventListener("DOMContentLoaded", async () => {

  async function loadRecipe() {
    
    const url = new URL(window.location);

    var level = 0;
    var category = 0;
    var time = 0;
   //not me(readyee)
    //const recipeId = getCookie("selectedRecipe"); // Get recipe ID from cookie
    const recipeId = url.searchParams.get("r") ? url.searchParams.get("r") : 0;

    if (!recipeId) {
        //that alert was a debuging thing (readyee)
      //alert("No recipe selected!");
      document.getElementById("recipe").innerHTML = "<p>No recipe selected.</p>";
      return;
    }
    //this massicure will not end D: (readyee)
    //console.log("Recipe ID: " + recipeId); // Logs the recipe ID

    const recipes = await fetchRecipes("data.json");
    //im so sad for my code (readyee)
    //const recipe = recipes[recipeId - 1]; // Get the correct recipe (adjusting for 0-based index)
	
	var filteredRecipes = recipes.filter(recipe => (recipe.id == recipeId));
	const recipe = filteredRecipes[0];

    if (!recipe) {
      document.getElementById("recipe").innerHTML = "<p>Recipe not found.</p>";
      return;
    }
    //not me (readyee)
    // gets the ingredients and puts them in a list
    //console.log(recipe.ingredients);
    var ingredientArray = recipe.ingredients.split("\n");
    //console.log(ingredientArray);
    
    var htmlIngredients = `<ul>`;
	for (var i=0; i < ingredientArray.length; i++) {
	  htmlIngredients += `<li>${ingredientArray[i]}</li>`;
	}
	htmlIngredients += `</ul>`;    
 
    // gets the directions and puts them in an ordered list
    var directionsArray = recipe.directions.split("\n");
    //console.log(directionsArray);
    var htmlDirections = `<ol>`;
	for (var i=0; i < directionsArray.length; i++) {
	  htmlDirections += `<li>${directionsArray[i]}</li>`;
	}
	htmlDirections += `</ol>`; 
    
    // :( there it gose my code agian (readyee)
    
    /*let inputText = Array.isArray(recipe.ingredients) ? recipe.ingredients.join(' ') : recipe.ingredients;

    function how(text) {
        let index = text.indexOf('.');
        if (index !== -1) {
            return text.slice(0, index + 1) + '<br>' + text.slice(index + 1);
        }
        return text; // Return the original text if no period is found
    }
    
    let howfull = how(inputText);
    //console.log(howfull)
    */
    
    
    
    
    // Display the recipe
    document.getElementById("recipe").innerHTML = `
      <div class="recipe-title"><h2>${recipe.title}</h2></div>
      <div class="recipe-header row">
        <div class="img double-column">
          <figure>
            <img src="${recipe.localImgUrl}" alt="${recipe.title}" width="350px">
            <figcaption><a href="${recipe.sourceUrl}">${recipe.title}</a> (via <a href="${recipe.sourceWebsiteUrl}">${recipe.sourceWebsite}</a>)</figcaption>
          </figure>
        </div>
        <div class="recipe-info column">
          <p><strong>Level:</strong> <span class="level">${recipe.level}</span></p>
          <p><strong>Category:</strong> ${recipe.category}</p>
          <p><strong>Total Time:</strong> ${recipe.totalTime} minutes</p>
          <p><strong>Servings:</strong> ${recipe.servings}</p>
          <p><strong>Source:</strong> <a href="${recipe.sourceUrl}" target="_blank">${recipe.title}</a> (via <a href="${recipe.sourceWebsiteUrl}">${recipe.sourceWebsite}</a>)</p>
          <div class="buttons">
            <button id="i-made-this-button" data-r="${recipe.id}">I Made This Recipe</button>
            <div class="tooltip-info">
              <div class="question" id="question">?</div>
              <div class="tooltip">Make recipes to get EXP (Experience Points)</div>
            </div>
            <p id="button-message"></p>
          </div>
        </div>
      </div>
      <div class="row">
        <section class="column ingredients"><h3>Ingredients</h3>${htmlIngredients}</section>
        <section class="column directions"><h3>Directions</h3>${htmlDirections}</section>
      </div>
    `;
    // not me (readyee)
    // Add click tooltip for mobile browsers
    var question = document.getElementById("question");
    question.addEventListener("click", function(e) {
      question.nextSibling().style.display = "block";
    });
    
    // disable button if already made
    var madeButton = document.getElementById('i-made-this-button');
	
	var recipeList = getRecipeList(); 
	if(recipeList.includes(recipe.id)) {
	  	console.log(recipe.id + " is already in the list");
	  	madeButton.disabled = true;
	  }

	madeButton.addEventListener("click", function(e) {
      e.preventDefault();

	  var xp = getXP();
	  var r=this.getAttribute("data-r");
	  recipeList = getRecipeList();
	  
	  if(recipeList.includes(r)) {
	  	//console.log(r + " is already in the list");
	  }
	  else{
	    recipeList.push(r);
	    setCookie("recipe-list", recipeList, 400);
	    
	    xp+=10;
	    setCookie("xp", xp, 400);
	    document.getElementById("xp-value").innerHTML = xp;
	    
	    // Disable the button
	    this.disabled = true;
	    document.getElementById("button-message").innerHTML = "Good job! Your EXP is now " + xp;
	    
	  }
	  
	  //console.log(recipeList);
	  //console.log(xp);
    });
    
  } 

  initSearchFeature('data.json');
  loadRecipe();
  initXP();
});