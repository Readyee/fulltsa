// lol i made allot of this

function time() {
    const data3 = document.getElementById("time");
    const time = parseInt(data3.value, 10);
    var times = 0;
    if (time === 30) {
        times = 2;
    } else if (time == 15) {
        times = 1;
    } else if (time == 45) {
        times = 3;
    } else if (time == 60) {
        times = 4;
    } else {
        times = 0;
        return;
    }
    return times;// this is just saying "HEY he wants under 60 by assing it to a number"
}

function category() {
    const data2 = document.getElementById("category");
    const cat = data2.value;
    var cata = 0;
    /*if (cat == "breakfast") {
        cata = 1;
    } else if (cat == "lunch") {
        cata = 2;
    } else if (cat == "dinner") {
        cata = 3;
    } else if (cat == "dessert") {
        cata = 4;
    } else {
        cata = 0;
        return;
    }*/
    cata = Number(cat);
    
    return cata;// >:( my code has ben commented out D: so sad:((((
}

function level() {
    const data1 = document.getElementById("level");
    const level = data1.value;
    var number = 0;
    /*if (level === "1") {
        number = 1;
    } else if (level === "2") {
        number = 2;
    } else if (level === "3") {
        number = 3;
    } else {
        number = 0;
        return;
    }*/
    number = Number(level);//NOT AGAINN D: AAAAAh
    return number;
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}//its the cookie thing i stole form w3school lolol

function search(action="result/index.html") {
    var number = level();
    var times = time();
    var cata = category();
    if (number && times && cata) {
        setCookie("level", number, 30);
        setCookie("food", cata, 30);
        setCookie("tik", times, 30);
        window.location.href = action;  // Redirect to the results page
    } else {
      setCookie("level", number, 30);
      setCookie("food", cata, 30);
      setCookie("tik", times, 30);
      window.location.href = action;
    }
}// legit this basicly sent this into a WAHT
//no my cookie D: 
//orginaly there was gonna be a cookie that send it but it was removed D:
//so sad

function addFormListener(action="result/index.html") {
    document.getElementById('filter-form').addEventListener("submit", function(e) {
      e.preventDefault();

      search(action);
    });
  }


async function fetchJSON(url) {
  try {
    const response = await fetch(url, {cache: "no-cache"});
    if (!response.ok) throw new Error("Failed to fetch data.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching JSON data:", error);
    return [];
  }
}

async function fetchRecipes(url) {
	var recipes = await fetchJSON(url);
	
	// add some stuff to each recipe that was not in the json
	recipes.forEach((recipe, index) => {
      
      // Create an ID from the title
      recipes[index].id = recipe.title.replace(/ /g,"-").toLowerCase();
            
      // Add source website info
      if(recipe.sourceUrl) {
        if(recipe.sourceUrl.includes("recipetineats.com")) {    
          recipes[index].sourceWebsite = "RecipeTin Eats";
          recipes[index].sourceWebsiteUrl = "https://www.recipetineats.com";
        }
        else if(recipe.sourceUrl.includes("foodnetwork.com")) {
          recipes[index].sourceWebsite = "Food Network";
          recipes[index].sourceWebsiteUrl = "https://www.foodnetwork.com";
        }
        else if(recipe.sourceUrl.includes("budgetbytes.com")) {
          recipes[index].sourceWebsite = "Budget Bytes";
      	  recipes[index].sourceWebsiteUrl = "https://www.budgetbytes.com";
        }
        else {
    	  recipes[index].sourceWebsite = "";
        }
      }
      
      // Each image was renamed to the recipe id
	  var ext = "jpg";
	  if(recipe.image) {
		ext = recipe.image.split('.').pop();
	  }
	  
	  recipes[index].localImgUrl = `img/${recipe.id}.${ext}`;
      
      
    });
    
    return recipes;
}

async function initSearchFeature(jsonPath, recipePath="") {// i bearly worked on this 
  const items = await fetchRecipes(jsonPath);
  const inputElement = document.getElementById("find");
  const container = document.getElementById("input");
  const search = document.getElementById("search");
// just a thing to find out what time level and category
  inputElement.addEventListener("input", () => {
  const query = inputElement.value.toLowerCase();
  container.innerHTML = "";
  container.style.display = "block";
      
  const filteredItems = items.filter(item => item.title.toLowerCase().includes(query));
    if (filteredItems.length) {
      filteredItems.forEach(item => {
        const block = document.createElement("div");
        block.className = "word-block";

		const link = document.createElement("a");
        link.title = item.title;
        link.href = recipePath + "recipe.html?r=" + item.id;

        const img = document.createElement("img");
        img.src = recipePath + item.localImgUrl;
        img.alt = item.title;
        link.appendChild(img);

        const text = document.createElement("span");
        text.textContent = item.title;
        link.appendChild(text);
        
        block.appendChild(link);

        container.appendChild(block);
      });
    } else {
        container.textContent = "No matches found.";
      }
    });
    // i did not do the impressif stuff|
    //the next comment was not my me!! |
    //                                 \/

    // Hide the search results when it loses focus 
    // Make sure search container has tab-index attribute for this to work
  search.addEventListener("focusout", function (e) {
    
    if( !e.relatedTarget || !this.contains(e.relatedTarget)) {
 	  container.style.display = "none";
    }
    	
  });
}

function getXP() {
  var xpCookie = getCookie("xp");
  var xp = 0;
  
  if(xpCookie) {
    xp = Number(xpCookie); 
  }
  
  return xp;
}// oh this was made from the dissainer she did great!!!

function getRecipeList() {
  
  var recipeList = [];	  
  var cookie = getCookie("recipe-list");
  
  if(cookie) {
	recipeList = cookie.split(",");
  }
  
  return recipeList;
}

function initXP() {
  
  var xp = getXP();     
  
  document.getElementById("xp-value").innerHTML = xp;
  
}