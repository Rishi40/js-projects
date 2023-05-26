// const imageContainer = document.getElementById('image-container');
// const loader = document.getElementById('loader');

// let photosArray = [];

// // Unsplash API
// const count = 10;
// const apiKey = 'PASTE_YOUR_API_KEY_HERE';
// const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

// // Helper Function to Set Attributes on DOM Elements
// function setAttributes(element, attributes) {
//   for (const key in attributes) {
//     element.setAttribute(key, attributes[key]);
//   }
// }

// // Create Elements For Links & Photos, Add to DOM
// function displayPhotos() {
//   // Run function for each object in photosArray
//   photosArray.forEach((photo) => {
//     // Create <a> to link to Unsplash
//     const item = document.createElement('a');
//     setAttributes(item, {
//       href: photo.links.html,
//       target: '_blank',
//     });
//     // Create <img> for photo
//     const img = document.createElement('img');
//     setAttributes(img, {
//       src: photo.urls.regular,
//       alt: photo.alt_description,
//       title: photo.alt_description,
//     });
//     // Put <img> inside <a>, then put both inside imageContainer Element
//     item.appendChild(img);
//     imageContainer.appendChild(item);
//   });
// }


// // Get photos from Unsplash API
// async function getPhotos() {
//   try {
//     const response = await fetch(apiUrl);
//     photosArray = await response.json();
//     displayPhotos();
//   } catch (error) {
//     // Catch Error Here
//   }
// }

// // Check to see if scrolling near bottom of page, Load More Photos
// window.addEventListener('scroll', () => {
//   if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
//     getPhotos();
//     console.log('load more');
//   }
// });

// // On Load
// getPhotos();

const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

const count = 30;
const apiKey = 'UreELNZSSlXgQoYeWm3chH70W1Htqy4K5VfimP84ajA';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

function imageLoaded() {
	imagesLoaded++;
	if (totalImages === imagesLoaded) {
		ready = true;
	}
}

function setAttributes(element, attributes) {
	for (const key in attributes) {
		element.setAttribute(key,attributes[key]);
	}
}

function displayPhotos() {
	totalImages = photosArray.length;
	imagesLoaded = 0;
	photosArray.forEach((photo) => {
		const item = document.createElement('a');
		setAttributes(item, {
			href: photo.links.html,
			target: '_blank',
		})
		const img = document.createElement('img');
		setAttributes(img, {
			src: photo.urls.regular,
			alt: photo.alt_description,
			title: photo.alt_description,
		})
		img.addEventListener('load',imageLoaded);
		item.appendChild(img);
		imageContainer.appendChild(item);
	})
}

async function getPhotos() {
	try {
		const response = await fetch(apiUrl);
		photosArray = await response.json();
		displayPhotos();
	} catch (error) {
		// Catch Error
	}
}

window.addEventListener('scroll',() => {
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
		ready = false;
		getPhotos();
	}
})
// onLoad
getPhotos();