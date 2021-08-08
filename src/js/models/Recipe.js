import axios from 'axios';
import { key } from '../config';

export default class Recipe {
	constructor(id) {
		this.id = id;
	}

	async getRecipe() {
		try {
			const res = await axios(`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}&includeNutrition=false`);
			this.title = res.data.title;
			this.sourceName = res.data.sourceName;
			this.img = res.data.image;
			this.url = res.data.sourceUrl;
			this.ingredients = res.data.extendedIngredients;
			this.cookingTime = res.data.readyInMinutes;
			this.servings = res.data.servings;

			//for viewing elements of each ingredient
			// for (let i = 0; i < this.ingredients.length; i++) {
			// 	let a = this.ingredients[i].amount;
			// 	let b = this.ingredients[i].unit;
			// 	let c = this.ingredients[i].name;
			// 	console.log(typeof a, b, c);
			// }
		} catch (err) {
			console.log(err);
			alert('Something went wrong :(');
		}
	}

	parseIngredients() {
		const unitsLong = ['cups', 'pinchs', 'servings', 'serving', 'tablespoons', 'tablespoon', 'tbsps', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'g', 'pounds', 'lb'];
		const unitsShort = ['cup', 'pinch', 'pinch', 'pinch', 'tbsp', 'tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'gram', 'pound', 'pound'];

		const eachIngredient = this.ingredients.map((element) => {
			//1. Get required fields
			const eachAmount = element.amount;
			let eachUnit = element.unit.toLowerCase();
			const eachName = element.name.toLowerCase();

			//2. Make uniform units
			unitsLong.forEach((element, i) => {
				eachUnit = eachUnit.replace(element, unitsShort[i]);
			});

			//3. Parse ingredients into amount, unit and name
			let finalString;
			finalString = {
				amount: eachAmount,
				unit: eachUnit,
				name: eachName,
			};
			return finalString;
			// if (eachUnit === '') {
			// 	finalString = `${eachAmount} ${eachName}`;
			// } else {
			// 	finalString = `${eachAmount} ${eachUnit} ${eachName}`;
			// }
		});

		this.ingredients = eachIngredient;
	}

	//type = 'inc' or 'dec'
	updateServings(type) {
		//update Servings
		const newServing = type === 'dec' ? this.servings - 1 : this.servings + 1;

		//update Ingredients
		this.ingredients.forEach((element) => {
			element.amount = element.amount * (newServing / this.servings);
		});

		this.servings = newServing;
	}
}
