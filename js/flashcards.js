import { wordBank } from './word_bank.js';

export default class FlashCards {
	savedWordsArr  = [];
	showSavedBool  = false;
	savedWordsPage = false;
	reversedBool   = false;
	appStorage;

	init () {
		const _this = this;
		localStorage.length ? this.appStorage = JSON.parse(localStorage.getItem('flashcards')) : localStorage.setItem('flashcards', JSON.stringify(wordBank));
		localStorage.length ? this.appStorage = JSON.parse(localStorage.getItem('flashcards')) : null;
		setTimeout(function () {
			_this.createCards();
			console.log('running flashcards.js');
		},250);
	};

	createCards () {
		const flashcardsParent = document.querySelector('.flashcards #parent');
		for (let i = 0; i < this.appStorage.length; i++) {
			const tempCard = document.createElement('div');
			const tempContentEn = document.createElement('div');
			const tempContentKr = document.createElement('div');
			const tempSaved = document.createElement('div');
			tempCard.classList.add('card');
			tempCard.setAttribute('data-word', i);
			tempCard.addEventListener('click', this.changeLang.bind(this));
			tempContentEn.classList.add('contentEn');
			tempContentEn.setAttribute('data-en', i);
			tempContentEn.innerHTML = this.appStorage[i].en;
			tempContentKr.classList.add('contentKr');
			tempContentKr.setAttribute('data-kr', i);
			tempContentKr.innerHTML = this.appStorage[i].kr;
			tempSaved.classList.add('word_saved');
			this.appStorage[i].saved === true ? tempSaved.classList.add('active') : null;
			tempSaved.setAttribute('data-saved', i);
			tempSaved.addEventListener('click', this.saveWord.bind(this));
			tempCard.appendChild(tempContentEn);
			tempCard.appendChild(tempContentKr);
			tempCard.appendChild(tempSaved);
			flashcardsParent.appendChild(tempCard);
		}
		this.setEventListeners();
	};

	setEventListeners () {
		document.querySelector('.flashcards #reverse').addEventListener('click',this.reverseLanguages.bind(this));
		document.querySelector('.flashcards #sort').addEventListener('click',this.showCategory.bind(this));
		document.querySelector('.flashcards #saved').addEventListener('click',this.showSaved.bind(this));
	};

	changeLang (evt) {
		const elem = evt.target;
		const dataValue = elem.getAttribute('data-word');
		const elemEn = document.querySelector('div[data-en="' + dataValue +'"]');
		const elemKr = document.querySelector('div[data-kr="' + dataValue +'"]');
		if (this.appStorage[dataValue].boolean === false) {
			this.appStorage[dataValue].boolean = true;
			elemEn.classList.add('hide');
			elemKr.classList.add('active');
		} 
		else {
			this.appStorage[dataValue].boolean = false;
			elemEn.classList.remove('hide');
			elemKr.classList.remove('active');
		}
	};

	saveWord (evt) {
		const elem = parseInt(evt.target.getAttribute('data-saved'));
		const tempSavedActive = document.querySelector(`.word_saved[data-saved="${elem}"`);
		if (this.appStorage[elem].saved == false) {
			this.savedWordsArr.push(elem);
			tempSavedActive.classList.add('active');
			this.appStorage[elem].saved = true;
		} 
		else {
			const indexArr = this.savedWordsArr.indexOf(elem);
			this.savedWordsArr.splice(indexArr,1);
			tempSavedActive.classList.remove('active');
			this.appStorage[elem].saved = false;
		}
		localStorage.setItem('flashcards',JSON.stringify(this.appStorage));
		evt.stopPropagation();
	};

	reverseLanguages () {
		if (!this.reversedBool) {
			this.reversedBool = true;
			document.querySelector('.flashcards #reverse').innerHTML = 'English to Korean';
			for (let i = 0; i < this.appStorage.length; i++) {
				const tempCardEn = document.getElementsByClassName('contentEn')[i];
				const tempCardKr = document.getElementsByClassName('contentKr')[i];
				tempCardEn.classList.add('hide');
				tempCardKr.classList.add('active');
			}
		} 
		else {
			this.reversedBool = false;
			document.querySelector('.flashcards #reverse').innerHTML = 'Korean to English';
			for (let i = 0; i < this.appStorage.length; i++) {
				const tempCardEn = document.getElementsByClassName('contentEn')[i];
				const tempCardKr = document.getElementsByClassName('contentKr')[i];
				tempCardEn.classList.remove('hide');
				tempCardKr.classList.remove('active');
			}
		}
	};

	showSaved () {
		const _this = this;
		const selectionDropdown = document.querySelector('.flashcards #selection_dropdown');
		const parentSaved = document.querySelector('.flashcards #parent');
		selectionDropdown.value = 'no_filter';
		if (this.showSavedBool === false) {
			const parentDiv = document.createElement('div');
			parentDiv.setAttribute('id', 'parent');
			parentSaved.remove();
			document.querySelector('.flashcards#main').appendChild(parentDiv);
			document.querySelector('.flashcards #saved').innerHTML = 'Hide Saved Words';
			this.showSavedBool = true;
			this.savedWordsPage = true;
			setTimeout(function() {
				for (let i = 0; i < _this.appStorage.length; i++) {
					if (_this.appStorage[i].saved == true) {
						const tempCard = document.createElement('div');
						const tempContentEn = document.createElement('div');
						const tempContentKr = document.createElement('div');
						const tempSaved = document.createElement('div');
						const tempRemove = document.createElement('div');
						tempCard.classList.add('card');
						tempCard.setAttribute('data-word', i);
						tempCard.addEventListener('click', _this.changeLang.bind(_this));
						tempContentEn.classList.add('contentEn');
						tempContentEn.setAttribute('data-en', i);
						tempContentEn.innerHTML = _this.appStorage[i].en;
						tempContentKr.classList.add('contentKr');
						tempContentKr.setAttribute('data-kr', i);
						tempContentKr.innerHTML = _this.appStorage[i].kr;
						tempRemove.classList.add('word_remove');
						tempRemove.setAttribute('data-remove', i);
						tempRemove.innerHTML = 'X';
						tempRemove.addEventListener('click', _this.destroySaved.bind(_this));
						tempCard.appendChild(tempContentEn);
						tempCard.appendChild(tempContentKr);
						tempCard.appendChild(tempSaved);
						tempCard.appendChild(tempRemove);
						parentDiv.appendChild(tempCard);
					}
				}
			},100);
		}
		else {
			const _this = this;
			const parentDiv = document.createElement('div');
			parentDiv.setAttribute('id', 'parent');
			parentSaved.remove();
			document.querySelector('.flashcards#main').appendChild(parentDiv);
			document.querySelector('.flashcards #saved').innerHTML = 'Show Saved Words';
			this.showSavedBool = false;
			this.savedWordsPage = false;
			setTimeout(function() {
				for (let i = 0; i < _this.appStorage.length; i++) {
					const tempCard = document.createElement('div');
					const tempContentEn = document.createElement('div');
					const tempContentKr = document.createElement('div');
					const tempSaved = document.createElement('div');
					tempCard.classList.add('card');
					tempCard.setAttribute('data-word', i);
					tempCard.addEventListener('click', _this.changeLang.bind(_this));
					tempContentEn.classList.add('contentEn');
					tempContentEn.setAttribute('data-en', i);
					tempContentEn.innerHTML = _this.appStorage[i].en;
					tempContentKr.classList.add('contentKr');
					tempContentKr.setAttribute('data-kr', i);
					tempContentKr.innerHTML = _this.appStorage[i].kr;
					tempSaved.classList.add('word_saved');
					_this.appStorage[i].saved === true ? tempSaved.classList.add('active') : null;
					tempSaved.setAttribute('data-saved', i);
					tempSaved.addEventListener('click', _this.saveWord.bind(_this));
					tempCard.appendChild(tempContentEn);
					tempCard.appendChild(tempContentKr);
					tempCard.appendChild(tempSaved);
					parentDiv.appendChild(tempCard);
				}
			}, 100);
		}
	};

	destroySaved (evt) {
		const elem = evt.currentTarget;
		const dataValue = elem.getAttribute('data-remove');
		const getCard = document.querySelector('div[data-word="' + dataValue +'"]');
		const indexArr = this.savedWordsArr.indexOf(elem);
		this.savedWordsArr.splice(indexArr, 1);
		this.appStorage[dataValue].saved = false;
		localStorage.setItem('flashcards', JSON.stringify(this.appStorage));
		getCard.remove();
		evt.stopPropagation();
	};

	showCategory = () => {
		const _this = this;
		const parentDiv = document.createElement('div');
		const selectionDropdown = document.querySelector('.flashcards #selection_dropdown');
		const parentSaved = document.querySelector('.flashcards #parent');
		const selection = selectionDropdown.value;
		parentSaved.remove();
		parentDiv.setAttribute('id', 'parent');
		document.querySelector('.flashcards#main').appendChild(parentDiv);
		setTimeout(function() {
			if (selection === 'no_filter') {
				for (let i = 0; i < _this.appStorage.length; i++) {
					let 
					tempCard = document.createElement('div'),
					tempContentEn = document.createElement('div'),
					tempContentKr = document.createElement('div'),
					tempSaved = document.createElement('div');
					tempCard.classList.add('card');
					tempCard.setAttribute('data-word', i);
					tempCard.addEventListener('click', _this.changeLang.bind(_this));
					tempContentEn.classList.add('contentEn');
					tempContentEn.setAttribute('data-en', i);
					tempContentEn.innerHTML = _this.appStorage[i].en;
					tempContentKr.classList.add('contentKr');
					tempContentKr.setAttribute('data-kr', i);
					tempContentKr.innerHTML = _this.appStorage[i].kr;
					tempSaved.classList.add('word_saved');
					_this.appStorage[i].saved === true ? tempSaved.classList.add('active') : null;
					tempSaved.setAttribute('data-saved', i);
					tempSaved.addEventListener('click', _this.saveWord.bind(_this));
					tempCard.appendChild(tempContentEn);
					tempCard.appendChild(tempContentKr);
					tempCard.appendChild(tempSaved);
					parentDiv.appendChild(tempCard);
				} 
			} 
			else {
				for (let i = 0; i < _this.appStorage.length; i++) {
					if (_this.appStorage[i].category === selection) {
						let 
						tempCard = document.createElement('div'),
						tempContentEn = document.createElement('div'),
						tempContentKr = document.createElement('div'),
						tempSaved = document.createElement('div');
						tempCard.classList.add('card');
						tempCard.setAttribute('data-word', i);
						tempCard.addEventListener('click', _this.changeLang.bind(_this));
						tempContentEn.classList.add('contentEn');
						tempContentEn.setAttribute('data-en', i);
						tempContentEn.innerHTML = _this.appStorage[i].en;
						tempContentKr.classList.add('contentKr');
						tempContentKr.setAttribute('data-kr', i);
						tempContentKr.innerHTML = _this.appStorage[i].kr;
						tempSaved.classList.add('word_saved');
						_this.appStorage[i].saved === true ? tempSaved.classList.add('active') : null;
						tempSaved.setAttribute('data-saved', i);
						tempSaved.addEventListener('click', _this.saveWord.bind(_this));
						tempCard.appendChild(tempContentEn);
						tempCard.appendChild(tempContentKr);
						tempCard.appendChild(tempSaved);
						parentDiv.appendChild(tempCard);
					} 
				}
			}
		},100);
	};
}