// app controller
import Search from './models/Search'; //importing class Search
import Recipe from './models/Recipe'; //importing class Recipe
import List from './models/List'; //importing class List
import Like from './models/Likes'; //importing class Like
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { allElements, renderLoader, clearLoader } from './views/base';

/** Global state of the app. It will have:
 * - Search object (all data about search i.e. search query and search result)
 * - Shopping list object
 * - Liked recipes
 *
 * all these data will be stored at all times in one central variable 'state'
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
	//1. Get query from the view
	const query = searchView.getInput();

	if (query) {
		//2. Create new Search object and add to the state
		state.newSearch = new Search(query);

		//3. Prepare UI for results like, clear fields, clear previous results, display loading spinner
		searchView.clearFields();
		searchView.clearSearchResults();
		renderLoader(allElements.searchResult);

		try {
			//4. Send request to API and search for recipes
			await state.newSearch.getResult(); //we await until the promise is resolved from getResult()

			//5. Render results on UI after removing the loader
			clearLoader();
			searchView.renderResults(state.newSearch.result);
		} catch (err) {
			console.log(err);
			alert('Error while searching data from server API :(');
			clearLoader();
		}
	}
};

allElements.searchBtn.addEventListener('submit', (event) => {
	event.preventDefault(); //preventing page reload
	if (state.thatRecipe) recipeView.clearRecipeResults(); //clear recipe contents if any
	controlSearch();
});

allElements.searchResultPages.addEventListener('click', (event) => {
	const btn = event.target.closest('.btn-inline'); //closest method will find the closest element with '.btn-inline' class //we use closest method to say we are only interested in the elements within 'btn-inline' class
	if (btn) {
		document.documentElement.scrollTop = 0;
		const goToPage = +btn.dataset.goto;
		searchView.clearSearchResults();
		searchView.renderResults(state.newSearch.result, goToPage);
	}
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
	const id = window.location.hash.replace('#', ''); //window.location is the entire URL //we replace hash symbol with nothing to remove it

	if (id) {
		//1. Create new Recipe object and add to the state
		state.thatRecipe = new Recipe(id);

		//2. Prepare UI for results like, clear previous results, display loading spinner, highlight the selected item
		recipeView.clearRecipeResults();
		renderLoader(allElements.recipe);
		if (state.newSearch) searchView.highlightSelectedSearch(id);

		try {
			//3. Send request to API and search for recipe data. Then parse the ingredients
			await state.thatRecipe.getRecipe();
			state.thatRecipe.parseIngredients();

			//4. Render recipe data on UI after removing the loader
			clearLoader();
			recipeView.renderRecipe(state.thatRecipe, state.myLikes.isLiked(id));
			//
		} catch (err) {
			console.log(err);
			alert('Error processing recipe data from server API :(');
		}
	}
};

// window.addEventListener('hashchange', controlRecipe);
//adding same event listeners to multiple events (hashchange and page load)
['hashchange', 'load'].forEach((event) => {
	window.addEventListener(event, controlRecipe);
});

// window.addEventListener('load', controlRecipe); //in case page reloads
// window.addEventListener('hashchange', () => {
// 	listView.clearListResults(); //clear list in UI
// 	if (state.myList) state.myList.deleteAllItems(); //if previous shopping list exist, clear that list in state
// 	controlRecipe();
// });

/**
 * LIST CONTROLLER
 */
const controlList = () => {
	//1. Create a new List object if there is none
	if (!state.myList) state.myList = new List();

	//2. Add each ingredient to the array and UI (but first lets clear previous results (extra feature maile thapeko)
	// listView.clearListItems();
	// state.myList.deleteAllItems();

	state.thatRecipe.ingredients.forEach((el) => {
		const eachItem = state.myList.addItem(el.amount, el.unit, el.name);
		listView.renderItem(eachItem);
	});

	//3. Render clear list button only if it doesnot exist
	if (!document.querySelector('.list-clear__btn')) {
		listView.renderClearBtn();
	}
};

//handling button clicks inside shopping list
allElements.shopping.addEventListener('click', (event) => {
	const id = event.target.closest('.shopping__item').dataset.itemid;

	if (event.target.matches('.shopping__delete, .shopping__delete *')) {
		//delete from state
		state.myList.deleteEachItem(id);

		//delete from UI
		listView.deleteItem(id);

		//handle amount change
	} else if (event.target.matches('.shopping__count-value')) {
		const value = parseFloat(event.target.value, 10);
		state.myList.updateAmount(id, value);
	}
});

document.querySelector('.shopping').addEventListener('click', (event) => {
	if (event.target.matches('.list-clear__btn, .list-clear__btn *')) {
		listView.clearListItems();
		state.myList.deleteAllItems();

		const a = document.querySelector('.btn-extra');
		a.parentElement.removeChild(a);
	}
});

/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
	//1. Create a new Like object if there is none
	if (!state.myLikes) state.myLikes = new Like();

	//2. Get the recipe id
	const currentID = state.thatRecipe.id;

	// if (state.myLikes) likesView.highlightSelectedLike(currentID);

	//2. Check if that recipe is already liked or not
	if (state.myLikes.isLiked(currentID)) {
		//if true i.e. already liked,
		//remove recipe from the state (array)
		state.myLikes.deleteEachLike(currentID);
		// Toggle like button
		likesView.toggleLikeBtn(false);
		// Remove recipe from the UI
		likesView.deleteLike(currentID);
	} else {
		//if false i.e. not liked,
		//add recipe to the state (array)
		const newLike = state.myLikes.addLike(currentID, state.thatRecipe.title, state.thatRecipe.sourceName, state.thatRecipe.img);
		// Toggle like button
		likesView.toggleLikeBtn(true);
		// Add recipe to the UI
		likesView.renderLike(newLike);
	}
	likesView.toggleLikeMenu(state.myLikes.getNumOfLikes());
};

//handling the localStorage when page loads
window.addEventListener('load', () => {
	//Create new Like object and List object
	state.myLikes = new Like();
	state.myList = new List();

	//Restore likes and list data
	state.myLikes.readStorage();
	state.myList.readStorage();

	//Toggle like menu button
	likesView.toggleLikeMenu(state.myLikes.getNumOfLikes());

	//Render the restored likes and list
	state.myLikes.likes.forEach((el) => likesView.renderLike(el));
	state.myList.items.forEach((el) => listView.renderItem(el));

	if (state.myList.items.length > 0) {
		listView.renderClearBtn();
	}
});

//handling button clicks inside recipe details i.e. most of the buttons
allElements.recipe.addEventListener('click', (event) => {
	/** asterick means including any child of btn-decrease */
	if (event.target.matches('.btn-decrease, .btn-decrease *')) {
		//decrease button
		if (state.thatRecipe.servings > 1) {
			state.thatRecipe.updateServings('dec');
			recipeView.updateServingsUI(state.thatRecipe);
		}
	} else if (event.target.matches('.btn-increase, .btn-increase *')) {
		//increase button
		state.thatRecipe.updateServings('inc');
		recipeView.updateServingsUI(state.thatRecipe);
	} else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		//add to shopping list button
		controlList();
	} else if (event.target.matches('.recipe__love, .recipe__love *')) {
		//like button
		controlLike();
	}
});
