import { NASA_API_KEY } from '../credentials.js';

const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

const count = 10;
const apiKey = NASA_API_KEY;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};

function showContent(page) {
	window.scrollTo({ top: 0, behavior: 'instant'});
	loader.classList.add('hidden');
	if (page === 'results') {
		resultsNav.classList.remove('hidden');
		favoritesNav.classList.add('hidden');
	} else {
		resultsNav.classList.add('hidden');
		favoritesNav.classList.remove('hidden');
	}
}

function createDOMNodes(page) {
	const currentArray = page === 'results' ? resultsArray : Object.values(favourites);
	
	currentArray.forEach((result) => {
		const card = document.createElement('card');
		card.classList.add('card');

		const link = document.createElement('a');
		link.href = result.hdurl;
		link.target = '_blank';
		link.title = 'View Full Image';

		const image = document.createElement('img');
		image.src = result.url;
		image.alt = 'NASA Picture of the Day';
		image.loading = 'lazy';
		image.classList.add('card-img-top');

		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');

		const cardTitle = document.createElement('h5');
		cardTitle.classList.add('card-title');
		cardTitle.textContent = result.title;

		const saveText = document.createElement('p');
		saveText.classList.add('clickable');

		if (page === 'results') {
			saveText.textContent = 'Add to Favourites';
			saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
		} else {
			saveText.textContent = 'Remove Favourite';
			saveText.setAttribute('onclick', `removeFavourite('${result.url}')`);
		}

		const cardText = document.createElement('p');
		cardText.textContent = result.explanation;

		const footer = document.createElement('small');
		footer.classList.add('text-muted');

		const date = document.createElement('strong');
		date.textContent = result.date;

		const copyrightResult = result.copyright === undefined ? '' : result.copyright;
		const copyright = document.createElement('span');
		copyright.textContent = ` ${copyrightResult}`;

		footer.append(date, copyright);
		cardBody.append(cardTitle, saveText, cardText, footer);
		link.appendChild(image);
		card.append(link, cardBody);
		imagesContainer.appendChild(card);
	})
}

function updateDOM(page) {
	if (localStorage.getItem('nasaFavourites')) {
		favourites = JSON.parse(localStorage.getItem('nasaFavourites'));
	}
	imagesContainer.textContent = '';
	createDOMNodes(page);
	showContent(page);
}
window.updateDOM = updateDOM;

function saveFavourite(itemUrl) {
	resultsArray.forEach((item) => {
		if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
			favourites[itemUrl] = item;
			saveConfirmed.hidden = false;
			setTimeout(() => {
				saveConfirmed.hidden = true;
			}, 2000);

			localStorage.setItem('nasaFavourites',JSON.stringify(favourites));
		}
	})
}
window.saveFavourite = saveFavourite;

function removeFavourite(itemUrl) {
	if (favourites[itemUrl]) {
		delete favourites[itemUrl];
		localStorage.setItem('nasaFavourites',JSON.stringify(favourites));
	}
	updateDOM('favourites');
}
window.removeFavourite = removeFavourite;

async function getNasaPictures() {
	loader.classList.remove('hidden');
	try {
		const response = await fetch(apiUrl);
		resultsArray = await response.json();
		updateDOM('results');
	} catch (error) {
		// Catch Error
	}
}
window.getNasaPictures = getNasaPictures;

getNasaPictures();