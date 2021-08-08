//this module especially contains codes that are reused across different modules

export const allElements = {
	//all DOM elements will be in this object
	searchField: document.querySelector('.search__field'),
	searchBtn: document.querySelector('.search'),
	searchResult: document.querySelector('.results'),
	searchResultList: document.querySelector('.results__list'),
	searchResultPages: document.querySelector('.results__pages'),
	recipe: document.querySelector('.recipe'),
	shopping: document.querySelector('.shopping__list'),
	likesMenu: document.querySelector('.likes__field'),
	likesList: document.querySelector('.likes__list'),
};

export const loaderElement = {
	className: 'loader',
};

export const renderLoader = (parent) => {
	const newLoader = `
    <div class = "${loaderElement.className}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>
    `;
	parent.insertAdjacentHTML('afterbegin', newLoader);
};

export const clearLoader = () => {
	const oldLoader = document.querySelector(`.${loaderElement.className}`);
	if (oldLoader) {
		oldLoader.parentElement.removeChild(oldLoader);
	}
};
