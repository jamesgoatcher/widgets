const assetUrl = './assets/final_fantasy/';

const config = {
	assets: [
		`${assetUrl}prelude.mp3`,
		`${assetUrl}battle.mp3`,
		`${assetUrl}boss.mp3`,
		`${assetUrl}ffvi_logo.png`,
		`${assetUrl}trillium.png`,
		`${assetUrl}mammoth.png`,
		`${assetUrl}whelk.png`,
		`${assetUrl}phunbaba.png`,
		`${assetUrl}celes_main.png`,
		`${assetUrl}celes_action.png`,
		`${assetUrl}cyan_main.png`,
		`${assetUrl}cyan_action.png`,
		`${assetUrl}gau_main.png`,
		`${assetUrl}gau_action.png`,
		`${assetUrl}gau_rage.png`,
		`${assetUrl}locke_main.png`,
		`${assetUrl}locke_action.png`,
		`${assetUrl}mog_main.png`,
		`${assetUrl}mog_action.png`,
		`${assetUrl}shadow_main.png`,
		`${assetUrl}shadow_action.png`,
		`${assetUrl}strago_main.png`,
		`${assetUrl}strago_action.png`,
		`${assetUrl}terra_main.png`,
		`${assetUrl}terra_action.png`,
		`${assetUrl}bg_desert.bmp`,
		`${assetUrl}bg_forest.bmp`,
		`${assetUrl}bg_grass.bmp`,
		`${assetUrl}bg_train.bmp`,
		`${assetUrl}bg_veldt.bmp`,
		`${assetUrl}bg_zozo.bmp`
	]
};

const playerSelection = {
	characters: [],
	enemy: {},
	background: ''
};

const final_fantasy_objects = {
	characters: {
		celes: {
			name: 'celes',
			hp: 1100,
			attack: 115,
			defense: 105,
			magic: 115,
			ct: 0,
			ct_growth: 1.05,
			special: {
				runic: {}
			}
		},
		cyan: {
			name: 'cyan',
			hp: 1200,
			attack: 120,
			defense: 110,
			magic: 80,
			ct: 0,
			ct_growth: 1,
			special: {
				swdtech: {}
			}
		},
		gau: {
			name: 'gau',
			hp: 950,
			attack: 110,
			defense: 100,
			magic: 90,
			ct: 0,
			ct_growth: 1.2,
			special: {
				rage: {}
			}
		},
		locke: {
			name: 'locke',
			hp: 1100,
			attack: 105,
			defense: 110,
			magic: 100,
			ct: 0,
			ct_growth: 1.15,
			special: {
				steal: {}
			}
		},
		mog: {
			name: 'mog',
			hp: 1050,
			attack: 100,
			defense: 100,
			magic: 110,
			ct: 0,
			ct_growth: 1.1,
			special: {
				dance: {}
			}
		},
		shadow: {
			name: 'shadow',
			hp: 1150,
			attack: 110,
			defense: 95,
			magic: 80,
			ct: 0,
			ct_growth: 1.2,
			special: {
				throw: {}
			}
		},
		strago: {
			name: 'strago',
			hp: 1050,
			attack: 90,
			defense: 105,
			magic: 120,
			ct: 0,
			ct_growth: 1,
			special: {
				lore: {}
			}
		},
		terra: {
			name: 'terra',
			hp: 1000,
			attack: 98,
			defense: 100,
			magic: 130,
			ct: 0,
			ct_growth: 1.05,
			special: {
				magic: {}
			}
		}
	},
	enemies: {
		trillium: {
			name: 'trillium',
			hp: 1000,
			attack: 100,
			defense: 0.95,
			magic: 130,
			ct: 0,
			ct_growth: 1.1,
			music: 'battle',
			special: {}
		},
		mammoth: {
			name: 'mammoth',
			hp: 1500,
			attack: 150,
			defense: 1.05,
			magic: 130,
			ct: 0,
			ct_growth: 1,
			music: 'battle',
			special: {}
		},
		whelk: {
			name: 'whelk',
			hp: 3000,
			attack: 150,
			defense: 1.15,
			magic: 130,
			ct: 0,
			ct_growth: 1,
			music: 'boss',
			special: {}
		},
		phunbaba: {
			name: 'phunbaba',
			hp: 9000,
			attack: 250,
			defense: 1.25,
			magic: 130,
			ct: 0,
			ct_growth: 1.15,
			music: 'boss',
			special: {}
		}
	},
	backgrounds: [
		'desert',
		'forest',
		'grass',
		'train',
		'veldt',
		'zozo'
	],
	items: {
		potion: {},
		phoenix_down: {}
	}
};

export { assetUrl,config,playerSelection,final_fantasy_objects };