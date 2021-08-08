import axios from 'axios'; //'axios' is an npm library to send HTTP request (just some lines of code)
import { key } from '../config';

export default class Search {
	constructor(query) {
		//parameters required for making an API search
		this.query = query; //query is the main recipe like 'burger' 'pizza' 'tomato pasta'
	}

	async getResult() {
		//this is an asynchronous METHOD of this class //every async method or function automatically returns a promise
		try {
			const res = await axios(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&query=${this.query}&number=37&addRecipeInformation=true&fillIngredients=false`);
			this.result = res.data.results;
		} catch (err) {
			console.log(err);
			alert('Something went wrong :(');
		}
	}
}

// getResult();
