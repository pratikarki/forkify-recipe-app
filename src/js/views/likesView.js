import { allElements } from './base';

export const toggleLikeBtn = (isLiked) => {
	const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined'; //if true, 'icon-heart' else, 'icon-heart-outlined'
	//icons.svg#icon-heart-outline
	document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = (numOfLikes) => {
	allElements.likesMenu.style.visibility = numOfLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = (eachLike) => {
	const markup = `
        <li>
            <a class="likes__link" href="#${eachLike.id}">
                <figure class="likes__fig">
                    <img src="${eachLike.img}" alt="${eachLike.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${eachLike.title}</h4>
                    <p class="likes__author">${eachLike.sourceName}</p>
                </div>
            </a>
        </li>
    `;
	allElements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = (id) => {
	const el = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
	if (el) el.parentElement.removeChild(el);
};

// export const highlightSelectedLike = (id) => {
// 	//first remove active class from each likes
// 	const resultsArr = Array.from(document.querySelectorAll('.likes__link'));
// 	resultsArr.forEach((element) => {
// 		element.classList.remove('likes__link--active');
// 	});
// 	//add active class to selected result
// 	document.querySelector(`a[href="#${id}"]`).classList.add('likes__link--active');
// };
//likes__link--active
