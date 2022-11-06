import { wordBank } from './word_bank.js';

export default class ScreenSaver {
	buttonControl = true;

	correctWords = {
		elements: [],
		count: 0
	};

	init () {
		const _this = this;
		setTimeout(function () {
			document.querySelector('.screen_saver.footer .start').addEventListener('click',_this.writeWordsToDOM.bind(_this),false);
			document.querySelector('.screen_saver.footer .results').addEventListener('click',_this.showResults.bind(_this),false);
			console.log('running screen_saver.js');
		}, 1000);
	};

	randomNumberGenerator (min,max) {
	  return Math.floor(Math.random()*(max-min+1))+min;
	};

	writeWordsToDOM () {
		if (this.buttonControl) {
			const resultsContainerEl = document.querySelector('.screen_saver .results-container');
			const resultsBtn = document.querySelector('.screen_saver .results');
			resultsContainerEl.classList.remove('active');
			resultsBtn.classList.remove('active');
			this.correctWords.elements = [];
			this.correctWords.count = 0;
			document.querySelector('#correct_word_count').innerText = this.correctWords.count;
			for (let i = 0; i < wordBank.length; i++) {
				const word = document.createElement('div');
				word.dataset.en = wordBank[i].en;
				word.dataset.kr = wordBank[i].kr;
				word.dataset.lang = 'kr';
				word.dataset.order = i + 1;
				word.classList.add('screen_saver');
				word.classList.add('word');
				word.innerText = wordBank[i].kr;
				word.style.left = `${this.randomNumberGenerator(10,80)}%`;
				word.addEventListener('click',this.typedCorrectWord.bind(this),false);
				document.querySelector('.screen_saver.container').appendChild(word);
			}
			this.startMovingWords();
		} 
		else { 
			const wordEls = document.querySelectorAll('[data-order]');
			window.removeEventListener('keydown',this.keydownListener,true);
			for (let i = 0; i < wordEls.length; i++)
				wordEls[i].remove();
			document.querySelector('.screen_saver.footer .start').innerText = 'Start';
			document.querySelector('.screen_saver.footer .input').value = '';
			document.querySelector('.screen_saver.footer .input').classList.remove('error');
			this.buttonControl = true;
		}
	};

	startMovingWords () { 
		const wordEls = document.querySelectorAll('[data-order]');
		const difficulty = document.querySelector('.screen_saver.footer .difficulty').value;
		const timeInc = difficulty === 'easy' ? 6000 : difficulty === 'medium' ? 3000 : 1500;
		const _this = this;
		let startTime = 0;
		this.buttonControl = false;
		document.querySelector('.screen_saver.footer .start').innerText = 'Stop';
		window.addEventListener('keydown',this.keydownListener.bind(this),true);
		for (let i = 0; i < wordEls.length; i++) {
			setTimeout(function () {
				wordEls[i].classList.add('active');
			}, startTime);
			startTime += timeInc;
			if (i === wordEls.length - 1) {
				setTimeout(function () { 
					const resultsContainerEl = document.querySelector('.screen_saver .results-container');
					const headerCont = document.createElement('div');
					const headerEnWord = document.createElement('div');
					const headerKrWord = document.createElement('div');
					resultsContainerEl.innerHTML = '';
					headerKrWord.innerText = 'Korean';
					headerEnWord.innerText = 'English';
					headerCont.appendChild(headerKrWord);
					headerCont.appendChild(headerEnWord);
					resultsContainerEl.appendChild(headerCont);
					for (let j = 0; j < _this.correctWords.elements.length; j++) {
						let
						cont = document.createElement('div'),
						enWord = document.createElement('div'),
						krWord = document.createElement('div');
						enWord.innerText = _this.correctWords.elements[j].dataset.en;
						krWord.innerText = _this.correctWords.elements[j].dataset.kr;
						cont.appendChild(krWord);
						cont.appendChild(enWord);
						resultsContainerEl.appendChild(cont);
					}
					document.querySelector('.screen_saver.footer .results').classList.add('active');
					_this.writeWordsToDOM();
				},startTime+14000);
			}
		}
	};

	keydownListener () {
		const wordEls = document.querySelectorAll('[data-order');
		if (event.keyCode === 13)
			this.evaluateTypedInput([...wordEls]);
	};

	evaluateTypedInput (wordEls) {
		const input = document.querySelector('#user_input');
		const activeWordEls = wordEls.filter(word => word.classList.contains('active'));
		for (let i = 0; i < activeWordEls.length; i++) {
			if (input.value === activeWordEls[i].innerText) {
				activeWordEls[i].click();
				activeWordEls[i].classList.add('clicked');
				this.correctWords.elements.push(activeWordEls[i]);
				this.correctWords.count = this.correctWords.elements.length;
				document.querySelector('#correct_word_count').innerText = this.correctWords.count;
				input.classList.remove('error');
				input.value = '';
				return;
			} 
			else {
				input.classList.add('error');
				continue;
			}
		}
	};

	typedCorrectWord (evt) {
		if (evt.target.dataset.lang === 'kr') {
			evt.target.innerText = evt.target.dataset.en;
			evt.target.dataset.lang = 'en';
		} 
		else {
			evt.target.innerText = evt.target.dataset.kr;
			evt.target.dataset.lang = 'kr';
		}
	};

	showResults () {
		const resultsBtn  = document.querySelector('.screen_saver.footer .results');
		const resultsCont = document.querySelector('.screen_saver .results-container');
		resultsCont.classList.contains('active') ? resultsBtn.innerText = 'Show Results' : resultsBtn.innerText = 'Hide Results';
		resultsCont.classList.contains('active') ? resultsCont.classList.remove('active') : resultsCont.classList.add('active');
	};
}