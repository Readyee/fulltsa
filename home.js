document.addEventListener("DOMContentLoaded", async () => {
  // the next commant is not from me (the github dude) I did none of this :\
  
  // randomize the featured recipes
  async function resapeaces(){
  
    var recipes = await fetchRecipes("result/data.json");
    
    const level = getCookie("level") ? parseInt(getCookie("level"), 10) : 0;	
	
	const filteredRecipes = recipes.filter(recipe =>
        (level == 0 || recipe.level == level)
    );
	
    const shuffledRecipes = filteredRecipes.sort(() => Math.random() - 0.5);
    
    const imgElements = document.querySelectorAll(".recipe-images img");
    
    imgElements.forEach((img, index) => {
      if (shuffledRecipes[index]) {
        img.src = 'result/' + shuffledRecipes[index].localImgUrl;
        img.alt = shuffledRecipes[index].title;
        img.id = shuffledRecipes[index].id;
        var link = img.parentNode;
        link.href = "result/recipe.html?r=" + shuffledRecipes[index].id;
        var caption = link.nextSibling;
        caption.innerHTML = `<a href="${shuffledRecipes[index].sourceUrl}">${shuffledRecipes[index].title}</a> (via <a href="${shuffledRecipes[index].sourceWebsiteUrl}">${shuffledRecipes[index].sourceWebsite}</a>)`;
      }
    });
    
  }
  
  resapeaces();
  addFormListener("result/index.html");
  initSearchFeature("result/data.json", "result/");
  initXP();
});