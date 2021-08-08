import uniqid from 'uniqid';

export default class List {
	constructor() {
		this.items = [];
	}

	addItem(amount, unit, name) {
		const eachItem = {
			id: uniqid(),
			amount,
			unit,
			name,
		};
		this.items.push(eachItem);
		this.persistData();
		return eachItem;
	}

	deleteEachItem(id) {
		const index = this.items.findIndex((el) => el.id === id); //if passed id matches with id of items[]array, findIndex returns indexValue
		//[2,4,5] splice(1, 2) (start index, how many positions to take) returns [4, 5], original array is [2]
		//[2,4,5] slice(1, 2) (start index, end index) returns 4, original array is [2, 4, 5]
		this.items.splice(index, 1); //because we only want to remove 1 element
		this.persistData();
	}

	updateAmount(id, newAmount) {
		this.items.find((el) => el.id === id).amount = newAmount;
		this.persistData();
	}

	deleteAllItems() {
		this.items = [];
		this.persistData();
	}

	persistData() {
		localStorage.setItem('myList', JSON.stringify(this.items)); //JSON.stringify converts to string
	}

	readStorage() {
		const storageData = JSON.parse(localStorage.getItem('myList')); //JSON.parse converts back to the data structure as before

		//Restore likes array from localStorage
		if (storageData) this.items = storageData;
	}
}
