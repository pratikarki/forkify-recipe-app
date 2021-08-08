export default class Like {
	constructor() {
		this.likes = [];
	}

	addLike(id, title, sourceName, img) {
		const eachLike = { id, title, sourceName, img };
		this.likes.push(eachLike);

		//Persist data in localStorage
		this.persistData();

		return eachLike;
	}

	deleteEachLike(id) {
		const index = this.likes.findIndex((el) => el.id === id); //if passed id matches with id of likes[]array, findIndex returns indexValue
		this.likes.splice(index, 1); //because we only want to remove 1 element

		//Persist data in localStorage
		this.persistData();
	}

	isLiked(id) {
		const check = this.likes.findIndex((el) => el.id === id); //check is -1 if index not found
		return check !== -1; //returns true if that id is liked, false if not liked
	}

	getNumOfLikes() {
		return this.likes.length;
	}

	persistData() {
		localStorage.setItem('myLikes', JSON.stringify(this.likes)); //JSON.stringify converts to string
	}

	readStorage() {
		const storageData = JSON.parse(localStorage.getItem('myLikes')); //JSON.parse converts back to the data structure as before

		//Restore likes array from localStorage
		if (storageData) this.likes = storageData;
	}
}
