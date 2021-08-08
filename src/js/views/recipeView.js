import { allElements } from './base';
import { Fraction } from 'fractional';

export const clearRecipeResults = () => {
	allElements.recipe.innerHTML = '';
};

const formatAmount = (amount) => {
	if (amount) {
		//amount = 1 ki 2 bhayo bhane numerator ra denominator funky huncha
		//amount = 2.5 ---> 2 1/2
		//amount = 0.5 ---> 1/2
		const newAmount = Math.round(amount * 100) / 100;

		const [int, dec] = newAmount
			.toString()
			.split('.')
			.map((el) => parseInt(el, 10));

		if (!dec) return newAmount;

		if (int === 0) {
			//if int is 0, we pass amount into new Fraction object which generates numerator and denominator
			const fr = new Fraction(newAmount);
			return `${fr.numerator}/${fr.denominator}`;
		} else {
			//2.5 //we pass only decimal i.e. 0.5 into new Fraction object
			const fr = new Fraction(newAmount - int);
			return `${int} & ${fr.numerator}/${fr.denominator}`;
		}
	}
	return '?';
};

const createEachIngredient = (ingredient) => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatAmount(ingredient.amount)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.name}
        </div>
    </li>
`;

export const renderRecipe = (recipe, isLiked) => {
	const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>

        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>


        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map((element) => createEachIngredient(element)).join('')}
            </ul>

            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.sourceName}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
    `;
	allElements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const updateServingsUI = (recipe) => {
	//update amount
	document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

	//update ingredients
	const amountElements = Array.from(document.querySelectorAll('.recipe__count'));
	amountElements.forEach((el, i) => {
		el.textContent = formatAmount(recipe.ingredients[i].amount);
	});
};
