const BTN_LABEL_RAINY = 'Make it rainy';
const BTN_LABEL_SUNNY = 'Make it sunny';

export default class RandomNumber {
	isRaining = false;

	init () {
		const _this = this;
		setTimeout(function () {
			_this.setEventListeners();
			console.log('running random_number.js');
		},300);
	};

	setEventListeners () {
		document.querySelector('.random_number #init').addEventListener('click',this.initWeatherHandler.bind(this));
	};

	initWeatherHandler () {
		const rangeVal = parseInt(document.querySelector('.random_number #rain_amount').value);
		const userIncrementor = (rangeVal/5) > .5 ? (rangeVal/5) : .5;
		if (!this.isRaining) {
			this.isRaining = true;
			this.initRain(userIncrementor);
		} 
		else {
			this.isRaining = false;
			this.initSunny();
		}
	};

	initRain (userIncrementor) {
		const rainDivs = document.querySelectorAll('.rain');
		const holderEl = document.querySelector('.random_number.holder');
		const btn = document.querySelector('.random_number #init');
		const close = document.querySelector('.random_number .close_page');
		let increment = 0;
	  let dropsFront = '';
	  let dropsBack = '';
	  rainDivs.forEach(rain => rain.innerHTML = '');
	  holderEl.classList.remove('sunny');
	  btn.innerText = BTN_LABEL_SUNNY;
	  close.classList.remove('inverse');
	  while (increment < 100) {
	    const randAnimSeconds = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
	    const randVertEnd = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
	    increment += userIncrementor;
	    dropsFront += `
	    <div class="droplet" style="left: ${increment}%; bottom: ${(randVertEnd + randVertEnd - 1 + 85)}%; animation-delay: 0.${randAnimSeconds}s; animation-duration: 0.5${randAnimSeconds}s;">
	    	<div class="tail" style="animation-delay: 0.${randAnimSeconds}s; animation-duration: 0.5${randAnimSeconds}s;"></div>
	    	<div class="splash" style="animation-delay: 0.${randAnimSeconds}s; animation-duration: 0.5${randAnimSeconds}s;"></div>
	    </div>`;
	    dropsBack += `
	    <div class="droplet" style="right: ${increment}%; bottom: ${(randVertEnd + randVertEnd - 1 + 85)}%; animation-delay: 0.${randAnimSeconds}s; animation-duration: 0.5${randAnimSeconds}s;">
	    	<div class="tail" style="animation-delay: 0.${randAnimSeconds}s; animation-duration: 0.5${randAnimSeconds}s;"></div>
	    	<div class="splash" style="animation-delay: 0.${randAnimSeconds}s; animation-duration: 0.5${randAnimSeconds}s;"></div>
	    </div>`;
	  }
	  document.querySelector('.rain.front').innerHTML = dropsFront;
	  document.querySelector('.rain.back').innerHTML = dropsBack;
	};

	initSunny () {
		const rainDivs = document.querySelectorAll('.rain');
		const holderEl = document.querySelector('.random_number.holder');
		const btn = document.querySelector('.random_number #init');
		const close = document.querySelector('.random_number .close_page');
	  rainDivs.forEach(rain => rain.innerHTML = '');
	  holderEl.classList.add('sunny');
	  btn.innerText = BTN_LABEL_RAINY;
	  close.classList.add('inverse');
	};
}