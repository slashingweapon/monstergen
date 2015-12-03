app.constant('monsterTables', {
	/*	Each of these tables has the following columns:
		level, attack, damage, HP, AC, better defense, lesser defense, fear threshold
	*/
	stats: {
		mook: [
			[0, 5, 3, 5, 16, 14, 10, 0],
			[1, 6, 4, 7, 17, 15, 11, 0],
			[2, 7, 5, 9, 18, 16, 12, 0],
			[3, 8, 6, 11, 19, 17, 13, 0],
			[4, 9, 7, 14, 20, 18, 14, 0],
			[5, 10, 9, 18, 21, 19, 15, 0],
			[6, 11, 12, 23, 22, 20, 16, 0],
			[7, 12, 18, 27, 23, 21, 17, 0],
			[8, 13, 12, 36, 24, 22, 18, 0],
			[9, 14, 31, 45, 25, 23, 19, 0],
			[10, 15, 37, 54, 26, 24, 20, 0],
			[11, 16, 46, 72, 27, 25, 21, 0],
			[12, 17, 60, 90, 28, 26, 22, 0],
			[13, 18, 74, 108, 29, 27, 23, 0],
			[14, 19, 90, 144, 30, 28, 24, 0]
		], standard: [
			[0, 5, 4, 20, 16, 14, 10, 7],
			[1, 6, 5, 27, 17, 15, 11, 9],
			[2, 7, 7, 36, 18, 16, 12, 12],
			[3, 8, 10, 45, 19, 17, 13, 15],
			[4, 9, 14, 54, 20, 18, 14, 18],
			[5, 10, 18, 72, 21, 19, 15, 24],
			[6, 11, 21, 90, 22, 20, 16, 30],
			[7, 12, 28, 108, 23, 21, 17, 36],
			[8, 13, 38, 144, 24, 22, 18, 48],
			[9, 14, 50, 180, 25, 23, 19, 60],
			[10, 15, 58, 216, 26, 24, 20, 72],
			[11, 16, 70, 288, 27, 25, 21, 96],
			[12, 17, 90, 360, 28, 26, 22, 120],
			[13, 18, 110, 432, 29, 27, 23, 144],
			[14, 19, 135, 576, 30, 28, 24, 192]
		], large: [
			[0, 5, 9, 41, 16, 14, 10, 7],
			[1, 6, 10, 54, 17, 15, 11, 9],
			[2, 7, 14, 72, 18, 16, 12, 12],
			[3, 8, 21, 90, 19, 17, 13, 15],
			[4, 9, 28, 108, 20, 18, 14, 18],
			[5, 10, 36, 144, 21, 19, 15, 24],
			[6, 11, 42, 180, 22, 20, 16, 30],
			[7, 12, 56, 216, 23, 21, 17, 36],
			[8, 13, 76, 288, 24, 22, 18, 48],
			[9, 14, 100, 360, 25, 23, 19, 60],
			[10, 15, 116, 432, 26, 24, 20, 72],
			[11, 16, 140, 576, 27, 25, 21, 96],
			[12, 17, 180, 720, 28, 26, 22, 120],
			[13, 18, 220, 864, 29, 27, 23, 144],
			[14, 19, 270, 1152, 30, 28, 24, 192]
		], huge: [
			[ 0,  5,  12,   60, 16, 14, 10,   7],
			[ 1,  6,  15,   81, 17, 15, 11,   0],
			[ 2,  7,  21,  108, 18, 16, 12,  12],
			[ 3,  8,  30,  135, 19, 17, 13,  15],
			[ 4,  9,  42,  162, 20, 18, 14,  18],
			[ 5, 10,  54,  216, 21, 19, 15,  24],
			[ 6, 11,  63,  270, 22, 20, 16,  30],
			[ 7, 12,  84,  324, 23, 21, 17,  36],
			[ 8, 13, 114,  432, 24, 22, 18,  48],
			[ 9, 14, 150,  540, 25, 23, 19,  60],
			[10, 15, 174,  648, 26, 24, 20,  72],
			[11, 16, 210,  864, 27, 25, 21,  96],
			[12, 17, 270, 1080, 28, 26, 22, 120],
			[13, 18, 330, 1296, 29, 27, 23, 144],
			[14, 19, 405, 1728, 30, 28, 24, 192]
		]
	},
	mods: {
		troop: function(m) { },
		offender: function(m) {
			m.attack += 3;
			m.ac -= 3; m.pd -= 3; m.pd -= 3;
		},
		defender: function(m) {
			m.ac += 3;
			m.hp = Math.round(m.hp * .7);
		},
		scrapper: function(m) {
			m.attack += 3;
			m.hp = Math.round(m.hp * .7);
		},
		oaf: function(m) {
			m.ac += 3;
			m.attack -= 3;
		},
		lunk: function(m) {
			m.hp = Math.round(m.hp * 1.4);
			m.ac -= 3; m.pd -= 3; m.md -= 3;
		}
	},
	bumps: {
		attack: function(m) { m.level += 1; m.attack += 6; },
		ac: function(m) { m.level += 1; m.ac += 6; },
		hp: function(m) { m.level += 1; m.hp *= 2; },
		dmg: function(m) { m.level += 1; m.damage *= 2; },
		balanced: function(m) { 
			m.level += 1; 
			m.ac += 1;
			m.pd += 1;
			m.md += 1;
			m.damage = Math.round(m.damage * 1.25);
			m.hp = Math.round(m.hp * 1.25);
		}
	},
	difficulty: {
		'-2': { standard:0.5, mook:0.1, large:1, huge:1.5 },
		'-1': { standard:0.7, mook:0.15, large:1.5, huge:2 },
		'0': { standard:1, mook:.2, large:2, huge:3 },
		'1': { standard:1.5, mook:.3, large:3, huge:4 },
		'2': { standard:2, mook:.4, large:4, huge:6 },
		'3': { standard:3, mook:.6, large:6, huge:8 },
		'4': { standard:4, mook:.8, large:8, huge:12 }
	},
	weaponTemplate: {
		title: 'basic attack',
		'class': 'melee', // melee, close, ranged
		num: 1,
		toHitMod: 0,
		vs: 'ac', 	// ac, pd, md
		targets: null,	// assume one engaged target
		effect: '{{dmg(1)}} damage',
		miss: '',
		extra: null,
		limited: null,
	},
	weapons: [
		{ title: 'basic attack' },
		{ title: 'double ranged', targets:2, effect:'{{dmg(0.5)}} damage', rng:'one nearby or far target' },
		{ title: 'ongoing dmg (easy)', targets:1, effect: '{{dmg(.60)}} damage, {{dmg(.30)}} ongoing' },
		{ title: 'ongoing dmg (normal)', targets:1, effect: '{{dmg(.60)}} damage, {{dmg(.20)}} ongoing' },
		{ title: 'ongoing dmg (hard)', targets:1, effect: '{{dmg(.60)}} damage, {{dmg(.11)}} ongoing' },
		{ title: 'close attack', 'class':'close', targets:'1d3 nearby enemies in a group', effect:'{{dmg(0.5)}} damage' },
		{ title: 'follow-on', effect:'{{dmg(.75)}}', special:'natural 16+ take another attack for .75 damage'}
	]
});
