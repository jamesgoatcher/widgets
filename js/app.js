import Birthday from './birthday.js';
import ScreenSaver from './screen_saver.js';
import RandomNumber from './random_number.js';
import FlashCards from './flashcards.js';
import LittleNemo from './little_nemo.js';
import MadMagazine from './mad_magazine.js';
import FinalFantasy from './final_fantasy.js';

const root = './';
const body = document.querySelector('body');
const main = document.querySelector('#container');
const WIDGET = {
	count: 7,
	imgEl: [],
	copyEl: []
};
const util = {
	clearInterval: (fns) => {
	  clearInterval(fns);
	},
	asciiSignature: () => {
		console.log(`
 ▄▄▄██▀▀▀██▓███    ▄████ 
   ▒██  ▓██░  ██▒ ██▒ ▀█▒
   ░██  ▓██░ ██▓▒▒██░▄▄▄░
▓██▄██▓ ▒██▄█▓▒ ▒░▓█  ██▓
 ▓███▒  ▒██▒ ░  ░░▒▓███▀▒
 ▒▓▒▒░  ▒▓▒░ ░  ░ ░▒   ▒ 
 ▒ ░▒░  ░▒ ░       ░   ░ 
 ░ ░ ░  ░░       ░ ░   ░ 
 ░   ░                 ░ 
 `);
		console.log('http://jamesgoatcher.com');
	},
	loadHTML: async (fileURL,page,optionalData) => {
		const response = await fetch(fileURL);
	  response.text().then(function(body) {
	  	main.innerHTML = '';
	  	main.innerHTML = body;
	  	util.loadHTMLPageLogic(page, optionalData);
	  });
	},
	loadSubHTML: async (fileURL,page) => {
		const response = await fetch(fileURL);
	  response.text().then(function(content) {
	  	page.innerHTML = '';
	  	page.innerHTML = content;
	  });
	},
	loadHTMLPageLogic: (page,optionalData) => {
		switch (page) {
	  	case 'home':
	  		homeInit();
	  		break;
	  	default:
	  		console.log('default hit');
	  		break;
	  }
	}
};

const loadHomePage = () => util.loadHTML(`${root}html/home.html`,'home');

const refreshPage = () => window.location.reload();

const homeInit = () => {
	const scrollEls = [...document.querySelectorAll('[class^="home scroll-"]')];
	for (let i = 0; i < scrollEls.length; i++)
		scrollEls[i].addEventListener('click',pageScrollHandler);
	for (let i = 1; i <= WIDGET.count; i++) {
		new Image(`${root}img/${i}.jpg`);
		const image = document.querySelector(`[data-page="${i}"] .widget-img`);
		const widgetOnClick = document.querySelector(`[data-page="${i}"] .widget-view`);
		image.style.backgroundImage = `url('${root}img/${i}.jpg')`;
		WIDGET.imgEl.push(image);
		WIDGET.copyEl.push(document.querySelector(`[data-page="${i}"] .widget-copy`));
		widgetOnClick.addEventListener('click', widgetInitHandler.bind(this,widgetOnClick.dataset.widget, i));
	}
	window.scrollTo(0,0);
};

const pageScrollHandler = (event) => {
	const scrollToNum = event.target.dataset.scroll;
	const scrollToEl = document.querySelector(`[data-page="${scrollToNum}"`);
	scrollToEl.scrollIntoView({behavior: 'smooth'});
	pageInitHandler(scrollToNum, parseInt(scrollToNum) - 1);
};

const pageInitHandler = (page, arrIndex) => {
	for (let i = 0; i < WIDGET.count; i++) {
		if (i === arrIndex) {
			WIDGET.imgEl[i].classList.add('active');
			WIDGET.copyEl[i].classList.add('active');
		} 
		else {
			WIDGET.imgEl[i].classList = 'home widget-img';
			WIDGET.copyEl[i].classList = 'home widget-copy';
		}
	}
};

const widgetInitHandler = (widgetName, pageNumber) => {
	const parentDiv = document.querySelector(`[data-page='${pageNumber}']`);
	const widgetDiv = document.createElement('div');
	let newInstance;
	widgetDiv.classList.add(`${widgetName}`);
	widgetDiv.classList.add(`container`);
	util.loadSubHTML(`${root}html/${widgetName}.html`,widgetDiv);
	switch (widgetName) {
		case 'birthday':
			newInstance = new Birthday();
			break;
		case 'screen_saver':
			newInstance = new ScreenSaver();
			break;
		case 'random_number':
			newInstance = new RandomNumber();
			break;
		case 'flashcards':
			newInstance = new FlashCards();
			break;
		case 'little_nemo':
			newInstance = new LittleNemo();
			break;
		case 'final_fantasy':
			newInstance = new FinalFantasy();
			break;
		case 'mad_magazine':
			newInstance = new MadMagazine();
			break;
	}
	newInstance.init();
	parentDiv.appendChild(widgetDiv);
	setTimeout(function () {
		widgetDiv.classList.add(`active`);
	},250);
};

document.onreadystatechange = function () {
	if (document.readyState == 'complete') {
		util.asciiSignature();
		loadHomePage();
	}
};