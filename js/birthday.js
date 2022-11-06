export default class Birthday {
	user = {
		year1: '',
		year2: '',
		year3: '',
		year4: '',
		outputCalc: () => parseInt(`${this.user.year1}${this.user.year2}${this.user.year3}${this.user.year4}`)
	};

	init () {
		window.addEventListener('keydown',this.registerListener.bind(this),true);
		console.log('running birthday.js');
	};

	registerListener () {
		if (event.keyCode >= 48 && event.keyCode <= 57)
			this.yearInputHandler(event,'number');
		else if (event.keyCode === 8 || event.keyCode === 13 || event.keyCode === 46)
			this.yearInputHandler(event,'delete');
	};

	yearInputHandler (evt,cmd) {
		const containerEl = [...document.querySelector('.birthday .year-container').children];
		let noActiveInputs;
		for (let i = 0; i < containerEl.length; i++) {
			if (containerEl[i].classList.contains('active')) {
				this.yearInputUpdate(cmd,containerEl[i],containerEl[i].children[0].children[0],evt.key);
				noActiveInputs = true;
				return;
			}
		}
		if (!noActiveInputs && cmd === 'delete') 
			this.yearInputUpdate('reset',containerEl);
	};

	yearInputUpdate (cmd,parentEl,activeInput,userInput) {
		if (cmd === 'number')
			this.isNumber(parentEl,activeInput,userInput);
		else if (cmd === 'delete')
			this.isDelete(parentEl);
		else if (cmd === 'reset')
			this.isReset(parentEl);
	};

	isNumber (parentEl,activeInput,userInput) {
		if (parentEl.nextElementSibling != null) {
			this.user[`year${parentEl.dataset.yearIndex}`] = userInput;
			activeInput.nextElementSibling.classList.add('hidden');
			activeInput.innerText = userInput;
			parentEl.classList.remove('active');
			parentEl.nextElementSibling.classList.add('active');
		} 
		else {
			this.user[`year${parentEl.dataset.yearIndex}`] = userInput;
			activeInput.nextElementSibling.classList.add('hidden');
			activeInput.innerText = userInput;
			parentEl.classList.remove('active');
			if (this.evalYear(this.user.outputCalc())) {
				document.querySelector('.birthday .error-message').classList.add('active');
				document.querySelector('.birthday .year-container').classList.add('error');
			} 
			else {
				document.querySelector('.birthday .success').classList.add('active');
				setTimeout(() => this.clearData(parentEl,true),500);
			}
		}
	};

	isDelete (parentEl) {
		if (parentEl.previousElementSibling === null)
			return;
		else {
			this.user[`year${parseInt(parentEl.dataset.yearIndex)-1}`] = '';
			parentEl.classList.remove('active');
			parentEl.previousElementSibling.classList.add('active');
			parentEl.previousElementSibling.children[0].children[0].innerText = '';
			parentEl.previousElementSibling.children[0].children[1].classList.remove('hidden');
		}
	};

	isReset (parentEl) {
		this.clearData(parentEl);
		parentEl[0].classList.add('active');
	};

	clearData (parentEl,reset) {
		parentEl = reset ? [...parentEl.parentElement.children] : parentEl;
		this.user.year1 = '';
		this.user.year2 = '';
		this.user.year3 = '';
		this.user.year4 = '';
		document.querySelector('.birthday .error-message').classList.remove('active');
		document.querySelector('.birthday .year-container').classList.remove('error');
		for (let i = 0; i < parentEl.length; i++) {
			parentEl[i].children[0].children[0].innerText = '';
			parentEl[i].children[0].children[1].classList.remove('hidden');
		}
	}

	evalYear (year) {
		const todaysYear = new Date().getFullYear();
		return year < 1900 || year > todaysYear || todaysYear % year < 21;
	};
}