import { assetUrl,config,playerSelection,final_fantasy_objects } from './final_fantasy_objects.js';

export default class FinalFantasy {
	init () {
		const _this = this;
		playerSelection.characters = [];
		setTimeout(function () {
			_this.PRELOAD_ASSETS();
			console.log('running final_fantasy.js');
		},250);
	};

	randomNumberGenerator (min,max) {
	  return Math.floor(Math.random()*(max-min+1))+min;
	};

	attachEvents () {
		document.querySelector('.control_area .start').addEventListener('click',this.battleScreenHandler.bind(this));
	};

	handleAudio (fileName, fileType) {
		const audioEl = document.querySelector('.final_fantasy .audio');
		const audioSrc = document.querySelector('#audio_src');
		const url = `${assetUrl}${fileName}.${fileType}`;
		if (fileName && fileType) {
			audioSrc.src = url;
			audioEl.load();
			audioEl.play();
		} 
		else
			audioEl.pause();
	};

	characterSelection () {
		const characterSelect = document.querySelector('.final_fantasy.character_selection .select_area');
		const characterKeys = Object.keys(final_fantasy_objects.characters);
		document.querySelector('.final_fantasy.character_selection').classList.add('active');
		characterKeys.forEach(character => {
			const cont = document.createElement('div');
			const char = document.createElement('div');
			const charName = document.createElement('div');
			cont.classList.add('tile');
			cont.classList.add(character);
			cont.addEventListener('click',this.selectCharacter.bind(this,character));
			char.classList.add('character');
			char.classList.add(character);
			char.style.backgroundImage = `url('${assetUrl}${character}_main.png')`;
			charName.classList.add('name');
			charName.innerHTML = character;
			cont.appendChild(char);
			cont.appendChild(charName);
			characterSelect.appendChild(cont);
		});
		this.handleAudio('prelude','mp3');
	};

	selectCharacter (character) {
		const tile = document.querySelector(`.tile.${character}`);
		const charEl = document.querySelector(`.character.${character}`);
		if (tile.classList.contains(character) && tile.classList.contains('selected')) {
			const filteredSelection = playerSelection.characters.filter(el => el.name !== character);
			tile.classList.remove('selected');
			charEl.style.backgroundImage = `url('${assetUrl}${character}_main.png')`;
			playerSelection.characters = filteredSelection;
			this.checkCanStart();
		}
		if (playerSelection.characters.length < 4) {
			tile.classList.contains('selected') ? tile.classList.remove('selected') : tile.classList.add('selected');
			playerSelection.characters.push(final_fantasy_objects.characters[character]);
			charEl.style.backgroundImage = `url('${assetUrl}${character}_action.png')`;
		}
		this.checkCanStart();
	};

	checkCanStart () {
		const btn = document.querySelector('.control_area .start');
		const allCharacters = Array.from(document.querySelectorAll('.select_area .tile'));
		if (playerSelection.characters.length > 3) {
			const unselectedCharacters = allCharacters.filter(char => !char.classList.contains('selected'));
			unselectedCharacters.forEach(char => {
				char.classList.add('no-border');
			});
			btn.disabled = false;
		} 
		else {
			allCharacters.forEach(char => char.classList.remove('no-border'));
			btn.disabled = true;
		}
	};

	battleScreenHandler () {
		this.handleAudio();
		this.loadBattleWindow();
		this.loadCharacterWindow();
		this.loadEnemyWindow();
		this.loadBattleSprites();
		this.setCtStart();
		this.handleAudio(`${playerSelection.enemy.music}`,'mp3');
	};

	loadBattleWindow () {
		const bgIndex = this.randomNumberGenerator(0,(final_fantasy_objects.backgrounds.length-1));
		const battleWindow = document.querySelector('.battle_screen .battle_window');
		playerSelection.background = final_fantasy_objects.backgrounds[bgIndex];
		battleWindow.style.backgroundImage = `url('${assetUrl}bg_${playerSelection.background}.bmp')`;
		document.querySelector('.final_fantasy.character_selection').classList.remove('active');
		document.querySelector('.final_fantasy.battle_screen').classList.add('active');
	};

	loadCharacterWindow () {
		const characterLines = [...document.querySelectorAll('.character_line')];
		characterLines.forEach((character,index) => {
			character.dataset.name = playerSelection.characters[index].name;
			character.children[0].innerHTML = playerSelection.characters[index].name;
			character.children[1].innerHTML = playerSelection.characters[index].hp;
		});
	};

	loadEnemyWindow () {
		const enEl = document.querySelector('.enemy_window .name');
		const enemies = Object.keys(final_fantasy_objects.enemies);
		const randIndex = this.randomNumberGenerator(0,(enemies.length-1));
		const enemyName = enemies[randIndex];
		const playerEnemy = Object.assign(playerSelection.enemy, final_fantasy_objects.enemies[enemyName]);
		enEl.innerHTML = enemyName;
	};

	loadBattleSprites () {
		const enemySpriteEl = document.querySelector('.battle_window > .enemy_sprite');
		const charSpritesEls = Array.from(document.querySelectorAll('.battle_window > .character_sprite'));
		enemySpriteEl.style.backgroundImage = `url('${assetUrl}${playerSelection.enemy.name}.png')`;
		charSpritesEls.forEach((char, index) => {
			char.style.backgroundImage = `url('${assetUrl}${playerSelection.characters[index].name}_main.png')`;
			char.classList.add(`char-${index + 1}`);
			char.dataset.character = playerSelection.characters[index].name;
		});
	};

	setCtStart () {
		playerSelection.characters.forEach(char => {
			const rand = this.randomNumberGenerator(10,60);
			char.ct = rand;
			document.querySelector(`[data-name="${char.name}"] .ct`).style.width = `${char.ct}%`;
		});
		playerSelection.ctInterval = setInterval(this.ctInterval.bind(this),500);
	};

	ctInterval () {
		console.log('===');
		let escape = false;
		playerSelection.characters.forEach(char => {
			if (!escape) {
				const inc = Math.round(5 * char.ct_growth);
				const newCt = char.ct + inc;
				newCt	>= 100 ? char.ct = 100 : char.ct = newCt;
				document.querySelector(`[data-name="${char.name}"] .ct`).style.width = `${char.ct}%`;
				console.log(char.name + ' ' + char.ct);
				if (char.ct >= 100) {
					console.log('if entered');
					escape = true;
					clearInterval(playerSelection.ctInterval);
					this.actionWindowHandler(char);
				}
			}
		});
		if (escape)
			clearInterval(playerSelection.ctInterval);
	};

	actionWindowHandler (character) {
		this.displayActionWindow();
		this.attachActionEvents(character);
	};

	displayActionWindow () {
		const actionEl = document.querySelector('.action_window');
		if (actionEl.classList.contains('active'))
			actionEl.classList.remove('active');
		else
			actionEl.classList.add('active');
	};

	attachActionEvents (character) {
		const actionObj = {
			fight: document.querySelector('.action_window .fight'),
			special: document.querySelector('.action_window .special'),
			item: document.querySelector('.action_window .item')
		};
		for (let action in actionObj) {
			actionObj[action].dataset.character = character.name;
			const charObj = {
				actionName: action,
				actionElement: actionObj[action],
				characterObj: character
			};
			actionObj[action].addEventListener('click',this.actionEventHandler.bind(this,charObj));
		}
		actionObj.special.innerHTML = Object.keys(character.special);
	};

	actionEventHandler (charObj) {
		if (event.target.dataset.character === charObj.characterObj.name) {
			switch (charObj.actionName) {
				case 'fight':
					this.fightAction(charObj);
					break;
				case 'special':
					break;
				case 'item':
					break
				default:
					break;
			}
			this.displayActionWindow();
		}
	};

	fightAction (charObj) {
		const fightObj = {
			attacker: 'character',
			charObj: charObj
		};
		this.characterSpriteAnim(charObj);
		this.damageHandler(fightObj);
	};

	characterSpriteAnim (params) {
		const charEl = document.querySelector(`.character_sprite[data-character="${params.characterObj.name}"]`);
		charEl.style.backgroundImage = `url('${assetUrl}${params.characterObj.name}_action.png')`;
		charEl.classList.add('active');
		setTimeout(function () {
			charEl.style.backgroundImage = `url('${assetUrl}${params.characterObj.name}_main.png')`;
			charEl.classList.remove('active');
		},2000);
	};

	damageHandler (fightObj) {
		switch (fightObj.attacker) {
			case 'character':
				this.characterFights(fightObj.charObj);
				break;
			case 'enemy':
				this.enemyFights();
				break;
		}
	};

	characterFights (charObj) {
		if (playerSelection.enemy.hp > 0) {
			const enemyEl = document.querySelector('.enemy_sprite');
			const enemyElDmg = document.querySelector('.enemy_sprite > .damage');
			const damage = Math.ceil((charObj.characterObj.attack+((10*10*charObj.characterObj.attack)/256)*3/2)/playerSelection.enemy.defense);
			enemyElDmg.innerHTML = damage;
			playerSelection.enemy.hp = playerSelection.enemy.hp-damage;
			// Start fight phase
			enemyEl.classList.add('attacked');
			enemyElDmg.classList.add('active');
			// End fight phase
			this.characterFightsAnimComplete(enemyEl,enemyElDmg,charObj);
			if (playerSelection.enemy.hp <= 0)
				this.victory();
			else
				playerSelection.ctInterval = setInterval(this.ctInterval.bind(this),500);
		}
	};

	characterFightsAnimComplete (enemyEl,enemyElDmg,charObj) {
		enemyEl.classList.remove('attacked');
		enemyElDmg.classList.remove('active');
		playerSelection.characters.forEach(char => {
			if (char.name === charObj.characterObj.name) {
				const charGauge = document.querySelector(`.character_line[data-name="${char.name}"] .ct`);
				charGauge.style.width = '0%';
				char.ct = 0;
			}
		});
	};

	enemyFights () {
		return;
	};

	victory () {
		console.log('win');
		return;
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
	  const cont = document.querySelector('.final_fantasy.container');
	  div.classList.add('loading_page_div');
	  div.innerHTML = 'Loading audio and image files';
	  cont.appendChild(div);
	};

	DESTROY_LOADING_PAGE () {
		const loading_page = document.querySelector('.loading_page_div');
		loading_page.remove();
		this.attachEvents();
		this.characterSelection();
	};

	PRELOAD_ASSETS () {
	  this.LOADING_PAGE();
	  const preloadEvent = new CustomEvent('preload_event', {detail: {url: null}});
	  const loadDiv = document.createElement('div');
	  let numAssets = config.assets.length;
	  let assetsLoaded = 0;
	  for (let asset of config.assets)
	  	this.LOAD_ASSET(asset, loadDiv, preloadEvent);
	  loadDiv.addEventListener('preload_event',(e) => {
	    ++assetsLoaded;
	    if (numAssets == assetsLoaded)
	    	this.DESTROY_LOADING_PAGE();
	  });
	};
}