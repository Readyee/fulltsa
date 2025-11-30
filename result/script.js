//most of this was not me

const categoryMap = { 1: "Breakfast", 2: "Lunch", 3: "Dinner", 4: "Dessert" };

document.addEventListener("DOMContentLoaded", async () => {

  function updateNav(level, category, time) {
    var links = [];

    if (level != 0) {
      links.push(`<a href="index.html?level=${level}" id="level">Level: ${level || "All"}</a>`);
    }

    if (category != 0) {
      links.push(`<a href="index.html?level=${level}&amp;cat=${category}" id="category">${categoryMap[category] || "All Categories"}</a>`); 
    }

    if (time != 0) {
      links.push(`<a href="index.html?level=${level}&amp;cat=${category}&amp;time=${time*15}" id="time">Time: ${time ? "&lt; " + time * 15 + " mins" : "All"}</a>`);
    }

    var html = `<p> Recipes `;
    for (var i = 0; i < links.length; i++) {
      html += links[i];
      if (i < links.length - 1) {
        html += ' &gt; ';
      }
    }
    html += ` </p>`;

    document.getElementById("nav").innerHTML = html;
  }
  
  function updateFilters(level, category, time) {
 	
    const levelElem = document.getElementById("level");
    if(level && level != 0) {
      levelElem.value = level; 
    }

    const catElem = document.getElementById("category");
    if(category && category != 0) {
      catElem.value = category;
    }
    
    const timeElem = document.getElementById("time");
    if(time && time != 0) {
      time = time * 15;
      timeElem.value = time;
    }

  }

  async function loadRecipes() {
    const url = new URL(window.location);

    var level = 0;
    var category = 0;
    var time = 0;

    // get level, category, and time from URL if they are in the URL parameters
    if (url.searchParams.get("level") || url.searchParams.get("cat") || url.searchParams.get("time")) {
      level = url.searchParams.get("level") ? url.searchParams.get("level") : 0;
      category = url.searchParams.get("cat") ? url.searchParams.get("cat") : 0;
      time = url.searchParams.get("time") ? url.searchParams.get("time") : 0;
      if(time > 0) {
        time = time/15;
      }
      // otherwise, get the info from the cookies (tasty)
    } else {
      level = getCookie("level") ? parseInt(getCookie("level"), 10) : 0;
      category = getCookie("food") ? parseInt(getCookie("food"), 10) : 0;
      time = getCookie("tik") ? parseInt(getCookie("tik"), 10) : 0;
    }

    const categoryName = categoryMap[category];

    updateNav(level, category, time);
    
    updateFilters(level, category, time);

    const recipes = await fetchRecipes("data.json");

    const filteredRecipes = recipes.filter(recipe =>
      (level == 0 || recipe.level == level) &&
      (category == 0 || !categoryName || !recipe.category || recipe.category.toLowerCase() === categoryName.toLowerCase()) &&
      (time == 0 || recipe.totalTime <= time * 15)
    );
    
    const recipeContainer = document.getElementById("chip");
    recipeContainer.innerHTML = filteredRecipes.length
      ? filteredRecipes.map((recipe, index) => `
        <div class="recipe-card row">
          <div class="img column">
            <a href="recipe.html?r=${recipe.id}">
              <figure>
           	    <img src="${recipe.localImgUrl}" alt="${recipe.title}">
                <figcaption><a href="${recipe.sourceUrl}">${recipe.title}</a> (via <a href="${recipe.sourceWebsiteUrl}">${recipe.sourceWebsite}</a>)</figcaption>
              </figure>
            </a>
          </div>
          <div class="recipe-info double-column">
            <h2>${recipe.title}</h2>
            <p>Level: ${recipe.level}</p>
            <p>Total Time: ${recipe.totalTime} minutes</p>
            <p>Servings: ${recipe.servings}</p>
            <p><a href="recipe.html?r=${recipe.id}">View Recipe</a></p>
          </div>
        </div>`
      ).join("")
      : "<p>No recipes found matching your criteria.</p>";
  }

  loadRecipes();
  addFormListener("index.html");
  initSearchFeature('data.json');
  initXP();
});