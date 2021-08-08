import { allElements } from './base';

export const getInput = () => allElements.searchField.value; //single line arrow function has implicit return i.e. we dont need to write 'return'

export const clearFields = () => {
	allElements.searchField.value = '';
};

export const clearSearchResults = () => {
	allElements.searchResultList.innerHTML = ''; //all HTML codes inside it will be empty
	allElements.searchResultPages.innerHTML = '';
};

export const highlightSelectedSearch = (id) => {
	//first remove active class from each result
	const resultsArr = Array.from(document.querySelectorAll('.results__link'));
	resultsArr.forEach((element) => {
		element.classList.remove('results__link--active');
	});
	//add active class to selected result
	document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

const renderOneRecipe = (recipe) => {
	//this function prints one single recipe to UI
	const markup = `
        <li>
            <a class="results__link" href="#${recipe.id}">
                <figure class="results__fig">
                    <img src="${recipe.image}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipe.title}</h4>
                    <p class="results__author">${recipe.sourceName}</p>
                </div>
            </a>
        </li>
    `;
	allElements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

//type: 'prev' or 'next'
//currentPage = 4
const createButton = (currentPage, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? currentPage - 1 : currentPage + 1}>
    <span>Page ${type === 'prev' ? currentPage - 1 : currentPage + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

//4, 35, 10
const renderButtons = (currentPage, totalResults, resultPerPage) => {
	const noOfPages = Math.ceil(totalResults / resultPerPage); //Math.ceil rounds to the next integer. if 4.1 then rounds to 5

	let button;
	if (currentPage === 1 && noOfPages >= 1) {
		//if it is first page and there are more than 1 pages or equal
		//render only next button
		button = createButton(currentPage, 'next');
	} else if (currentPage > 1 && currentPage < noOfPages) {
		//if current page is somewhere between first & last
		//render both buttons
		button = `
        ${createButton(currentPage, 'prev')}
        ${createButton(currentPage, 'next')}
        `;
	} else if (currentPage === noOfPages && noOfPages > 1) {
		//if it is last page and there are more than 1 pages
		//render only previous button
		button = createButton(currentPage, 'prev');
	}

	allElements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resultPerPage = 10) => {
	//this function displays all results from API to the UI //recipes is an array of our results

	//renders result of current page
	//first 10 results if page=1 //next 10 results if page=2 //next 10 results if page=3
	const start = (page - 1) * resultPerPage;
	const end = page * resultPerPage;
	recipes.slice(start, end).forEach(renderOneRecipe); //slice returns a copy of portion of array. It extracts upto but not including end. //forEach will pass each element to renderOneRecipe

	//renders pagination buttons
	if (recipes.length > resultPerPage) {
		renderButtons(page, recipes.length, resultPerPage);
	}
};
