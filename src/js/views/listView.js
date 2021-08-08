import { allElements } from './base';

export const clearListItems = () => {
	allElements.shopping.innerHTML = '';
};

export const renderItem = (eachItem) => {
	const markup = `
        <li class="shopping__item" data-itemid=${eachItem.id}>
            <div class="shopping__count">
                <input type="number" value="${eachItem.amount}" step="${eachItem.amount}" class="shopping__count-value">
                <p>${eachItem.unit}</p>
            </div>
            <p class="shopping__description">${eachItem.name}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
	allElements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const renderClearBtn = () => {
	const markup = `
        <div class="btn-extra">
            <button class="btn-small list-clear__btn">
                <span>Clear List</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </div>
    `;
	allElements.shopping.insertAdjacentHTML('afterend', markup);
};

export const deleteItem = (id) => {
	const item = document.querySelector(`[data-itemid="${id}"]`); //select the UI item based on class 'data-itemid'
	if (item) item.parentElement.removeChild(item); //remove that item from UI
};
