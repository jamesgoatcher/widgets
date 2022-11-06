const LOADING_LABEL = 'Loading audio, image, and video files';
const SOUND_OFF = 'SOUND OFF';
const SOUND_ON = 'SOUND ON';
const GAME_OVER = 'GAME OVER';

export default class LittleNemo {
	config = {
		assets: [
			`./assets/nemo/little_nemo_intro--2.mp4`,
			`./assets/nemo/silence.mp3`,
			`./assets/nemo/little_nemo--flower_garden.mp3`,
			`./assets/nemo/little_nemo_bg.png`,
			`./assets/nemo/little_nemo_intro--sfx.mp3`,
			`./assets/nemo/little_nemo--bottom_dialogue.png`,
			`./assets/nemo/little_nemo_sprite--stand.png`,
			`./assets/nemo/little_nemo_sprite--run_1.png`,
			`./assets/nemo/little_nemo_sprite--run_2.png`,
			`./assets/nemo/little_nemo_sprite--run_3.png`,
			`./assets/nemo/little_nemo_sprite--friend.png`,
			`./assets/nemo/little_nemo--log.png`
		],
		animation: {
			startingAnim: 0,
			spriteImgCounter: 1,
			spriteImgStanding: true,
			interactionSequence: false
		},
		dialogue: {
			lineCount: 0,
			lineNum: 0,
			lines: [
				`Hi Nemo. This is the Magic Flower Garden.`,
				`You know, my friend Oompi wants to meet you.`,
				`He lives under the Water.`
			]
		},
		soundBoolean: true
	};

	LOAD_ASSET (url,loadDiv,evt) {
	  const file = new Image();
	  file.src = url;
	  file.onload = () => {
	    evt.detail.url = url;
	    loadDiv.dispatchEvent(evt);
	  };
	  file.onerror = () => {
	    evt.detail.url = url;
	    loadDiv.dispatchEvent(evt);
	  };
	};

	LOADING_PAGE () {
	  const div = document.createElement('div');
	  const cont = document.querySelector('.little_nemo.container');
	  div.classList.add('loading_page_div');
	  div.innerHTML = LOADING_LABEL;
	  cont.appendChild(div);
	};

	PRELOAD_ASSETS () {
	  this.LOADING_PAGE();
	  const preloadEvent = new CustomEvent('preload_event', {detail: {url: null}});
	  const loadDiv = document.createElement('div');
	  let numAssets = this.config.assets.length;
	  let assetsLoaded = 0;
	  for (let asset of this.config.assets)
	  	this.LOAD_ASSET(asset,loadDiv,preloadEvent);
	  loadDiv.addEventListener('preload_event', (e) => {
	    ++assetsLoaded;
	    console.log(`${assetsLoaded}/${numAssets}: ${e.detail.url}`);
	    if (numAssets == assetsLoaded)
	    	this.loadIntro();
	  });
	};

	init () {
		const _this = this;
		setTimeout(function () {
			_this.PRELOAD_ASSETS();
			console.log('running little_nemo.js');
		},250);
	};

	loadIntro () {
		const _this = this;
		const loadingPage = document.querySelector('.loading_page_div');
		const sfxEl = document.querySelector('.little_nemo .audio_sfx');
		const sfxElSource = document.querySelector('.little_nemo #audio_sfx_src');
		const videoEl = document.querySelector('.little_nemo #intro_video');
		const videoElSource = document.querySelector('.little_nemo #intro_video source');
		const soundBool = document.querySelector('.little_nemo #sound_toggle');
		loadingPage.classList.add('hide');
		videoEl.addEventListener('ended',this.loadScene.bind(this));
		soundBool.addEventListener('click',this.soundToggle.bind(this,soundBool));
		setTimeout(function () {
			loadingPage.remove();
			videoElSource.src = _this.config.assets[0];
			sfxElSource.src = _this.config.assets[4];
			sfxEl.load();
			sfxEl.play();
			videoEl.load();
			videoEl.play();
		},600);
	};

	loadScene () {
		const holderDiv = document.querySelector('.little_nemo .holder');
		const audioEl = document.querySelector('.little_nemo .audio');
		const audioElSource = document.querySelector('.little_nemo #audio_src');
		const sprite = document.querySelector('.little_nemo #sprite');
		const friend = document.querySelector('.little_nemo #friend');
		const intSeq = document.querySelector('.little_nemo #interaction_sequence');
		const logo = document.querySelector('.little_nemo .logo');
		const controls = document.querySelector('.little_nemo .controller');
		sprite.style.backgroundImage = `url(${this.config.assets[6]})`;
		friend.style.backgroundImage = `url(${this.config.assets[10]})`;
		intSeq.style.backgroundImage = `url(${this.config.assets[5]})`;
		holderDiv.style.backgroundImage = `url(${this.config.assets[3]})`;
		holderDiv.classList.add('active');
		logo.style.backgroundImage = `url(${this.config.assets[11]})`;
		logo.classList.add('active');
		controls.classList.add('active');
		audioElSource.src = this.config.assets[2];
		audioEl.load();
		audioEl.play();
		window.addEventListener('keydown',this.keydownEventListener.bind(this));
		window.addEventListener('keyup',this.keyupEventListener.bind(this,sprite,friend,intSeq));
	};

	keydownEventListener () {
		const leftArr = document.querySelectorAll('.little_nemo .left-control');
		const rightArr = document.querySelectorAll('.little_nemo .right-control');
		const sprite = document.querySelector('.little_nemo #sprite');
		this.config.animation.spriteImgStanding = false;
		if (event.keyCode === 68 || event.keyCode === 39) {
			rightArr[0].classList.add('active');
			rightArr[1].classList.add('active');
			this.animStep('right', sprite);
		} 
		else if (event.keyCode === 65 || event.keyCode === 37) {
			leftArr[0].classList.add('active');
			leftArr[1].classList.add('active');
			this.animStep('left', sprite);
		}
	};

	keyupEventListener (sprite,friend,intSeq) {
		const leftArr = document.querySelectorAll('.little_nemo .left-control');
		const rightArr = document.querySelectorAll('.little_nemo .right-control');
		if (event.keyCode === 65 || event.keyCode === 37 || event.keyCode === 68 || event.keyCode === 39) {
			this.config.animation.spriteImgStanding = true;
			sprite.style.backgroundImage = `url(${this.config.assets[6]})`;
			rightArr[0].classList.remove('active');
			rightArr[1].classList.remove('active');
			leftArr[0].classList.remove('active');
			leftArr[1].classList.remove('active');
			if (this.config.animation.startingAnim > 370 && !this.config.animation.interactionSequence)
				this.initInteractionSeq(friend,intSeq);
		}
	};

	animStep (direction,sprite) {
		if (!this.config.animation.interactionSequence) {
			if (direction === 'right') {
		  	if (this.config.animation.startingAnim < 380) {
			  	this.config.animation.startingAnim += 10;
			  	this.setSpriteImg(sprite);
				  sprite.style.transform = `translateX(${this.config.animation.startingAnim}px) scaleX(1)`;
			  } 
			  else {
			  	this.config.animation.spriteImgStanding = true;
					sprite.style.backgroundImage = `url(${this.config.assets[6]})`;
			  }
		  } 
		  else if (direction === 'left') {
		  	if (this.config.animation.startingAnim > -50) {
			  	this.config.animation.startingAnim -= 10;
			  	this.setSpriteImg(sprite);
				  sprite.style.transform = `translateX(${this.config.animation.startingAnim}px) scaleX(-1)`;
			  } 
			  else {
			  	this.config.animation.spriteImgStanding = true;
					sprite.style.backgroundImage = `url(${this.config.assets[6]})`;
			  }
		  }
		} 
		else {
			if (direction === 'right') {
		  	if (this.config.animation.startingAnim < 590) {
			  	this.config.animation.startingAnim += 10;
			  	this.setSpriteImg(sprite);
				  sprite.style.transform = `translateX(${this.config.animation.startingAnim}px) scaleX(1)`;
			  } 
			  else {
			  	this.config.animation.spriteImgStanding = true;
					sprite.style.backgroundImage = `url(${this.config.assets[6]})`;
			  }
		  } else if (direction === 'left') {
		  	if (this.config.animation.startingAnim > -50) {
			  	this.config.animation.startingAnim -= 10;
			  	this.setSpriteImg(sprite);
				  sprite.style.transform = `translateX(${this.config.animation.startingAnim}px) scaleX(-1)`;
			  } 
			  else {
			  	this.config.animation.spriteImgStanding = true;
					sprite.style.backgroundImage = `url(${this.config.assets[6]})`;
			  }
		  }
		}
	};

	setSpriteImg (sprite) { 
		if (this.config.animation.spriteImgCounter > 4)
			this.config.animation.spriteImgCounter = 1;
		switch (this.config.animation.spriteImgCounter) {
			case 1:
				sprite.style.backgroundImage = `url(${this.config.assets[7]})`;
				break;
			case 2:
				sprite.style.backgroundImage = `url(${this.config.assets[8]})`;
				break;
			case 3:
				sprite.style.backgroundImage = `url(${this.config.assets[9]})`;
				break;
			case 4:
				sprite.style.backgroundImage = `url(${this.config.assets[8]})`;
				break;
		}
		if (this.config.animation.spriteImgCounter < 5)
			this.config.animation.spriteImgCounter++;
	};

	initInteractionSeq (friend,intSeq) {
		const _this = this;
		const curtain = document.querySelector('.little_nemo #interaction_curtain');
		this.config.animation.interactionSequence = true;
		intSeq.classList.add('active');
		window.removeEventListener('keydown',this.keydownEventListener.bind(this));
		setTimeout(function () {
			curtain.classList.add('inactive');
		},1000);
		setTimeout(function () {
			_this.typeDialogueHandler();
		},1500);
	};

	typeDialogueHandler () {
		console.log('dfdfd')
		const _this = this;
		const controlNext = document.querySelector('.little_nemo .controller .message');
		const dialogueBox = document.querySelector('.little_nemo #dialogue_box');
		window.removeEventListener('keydown',this.keydownDialogue.bind(this),true);
		switch (this.config.dialogue.lineNum) {
			case 0:
				this.typeDialogue(dialogueBox, this.config.dialogue.lines[0].split(''));
				break;
			case 1:
				dialogueBox.innerHTML = '';
				this.typeDialogue(dialogueBox, this.config.dialogue.lines[1].split(''));
				break;
			case 2:
				dialogueBox.innerHTML = '';
				this.typeDialogue(dialogueBox, this.config.dialogue.lines[2].split(''));
				break;
			case 3:
			default:
				dialogueBox.innerHTML = '';
				document.querySelector('.little_nemo #interaction_curtain').classList.remove('inactive');
				setTimeout(function () {
					document.querySelector('.little_nemo #interaction_sequence').classList.remove('active');
					document.querySelector('.little_nemo #friend').classList.add('phase-out');
					window.addEventListener('keydown',_this.keydownEventListener.bind(_this));
				},1000);
				setTimeout(function () {
					document.querySelector('.little_nemo #friend').remove();
					controlNext.innerHTML = GAME_OVER;
					controlNext.classList.add('active');
				},2000);
				break;
		}
	};

	typeDialogue (dialogueBox,line) {
		const controlNext = document.querySelector('.little_nemo .controller .message');
		this.config.dialogue.lineCount = 0;
		const dialogueInterval = (dialogueBox, line) => {
			if (this.config.dialogue.lineCount < line.length) {
				line[this.config.dialogue.lineCount] = line[this.config.dialogue.lineCount] === ' ' ? '&#160;' : line[this.config.dialogue.lineCount];
				if (line[this.config.dialogue.lineCount] === 'M')
					dialogueBox.innerHTML += `<br>${line[this.config.dialogue.lineCount]}`;
				else if (line[this.config.dialogue.lineCount] === 'O')
					dialogueBox.innerHTML += `<br>${line[this.config.dialogue.lineCount]}`;
				else if (line[this.config.dialogue.lineCount] === 'W')
					dialogueBox.innerHTML += `<br>${line[this.config.dialogue.lineCount]}`;
				else
					dialogueBox.innerHTML += line[this.config.dialogue.lineCount];
			} 
			else {
				window.addEventListener('keydown',this.keydownDialogue.bind(this),true);
				this.config.dialogue.lineNum++;
				clearInterval(intVar);
				controlNext.classList.add('active');
			}
			this.config.dialogue.lineCount++;
		};
		let intVar = setInterval(dialogueInterval.bind(this,dialogueBox,line),100);
	};

	keydownDialogue (e) {
		if (event.keyCode === 13) {
			const controlNext = document.querySelector('.little_nemo .controller .message');
			this.typeDialogueHandler();
			controlNext.classList.remove('active');
		}
	};

	soundToggle (el) {
		const musicPlayer = document.querySelector('.little_nemo .audio')
		if (this.config.soundBoolean) {
			this.config.soundBoolean = false;
			el.innerHTML = SOUND_OFF;
			musicPlayer.pause();
		} 
		else {
			this.config.soundBoolean = true;
			el.innerHTML = SOUND_ON;
			musicPlayer.play();
		}
	};
}