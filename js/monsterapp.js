app = angular.module('monsterApp', []);

app.controller('builder', function($scope, genops) {

	$scope.params = genops.baseParams();
		
	$scope.$watch('[params.level, params.type, params.defense, params.mod, params.inclFear, params.init, params.bump]', function() {
		console.log($scope.params);
		$scope.monster = genops.genMonster($scope.params);
	});
	
});

app.controller('contribution', function($scope, genops) {
	$scope.contribution = 1;

	$scope.$watch('[PartyLevel, monster.level]', function() {
		$scope.contribution = genops.difficulty($scope.monster, $scope.PartyLevel);
	});
});

app.factory('genops', function(monsterTables) {
	var service = {};
	
	service.baseParams = function() {
		return {
			type: 'standard',
			level: 0,
			defense: 'pd',
			mod: '',
			inclFear: false,
			init: 3,
			bump: ''
		};
	};
	
	service.genMonster = function(params) {
		params = angular.extend({}, this.baseParams(), params);
		
		var stats = monsterTables.stats.hasOwnProperty(params.type)
			? monsterTables.stats[params.type][params.level]
			: monsterTables.stats.standard[params.level] ;
			
		var monster = {};
		monster.level = Number(params.level);
		monster.attack = stats[1];
		monster.damage = stats[2];
		monster.hp = stats[3];
		monster.ac = stats[4];
		if(params.defense == 'pd') {
			monster.pd = stats[5];
			monster.md = stats[6];
		} else {
			monster.pd = stats[6];
			monster.md = stats[5];
		}
		monster.fear = params.inclFear ? stats[7] : 0;
		
		if(params.mod && monsterTables.mods.hasOwnProperty(params.mod))
			monsterTables.mods[params.mod](monster);

		if(params.bump && monsterTables.bumps.hasOwnProperty(params.bump))
			monsterTables.bumps[params.bump](monster);

		monster.init = Number(monster.level) + Number(params.init);

		return monster;
	};

	service.difficulty = function(monster, partyLevel) {
		var retval = 0;
		console.log(monster, partyLevel);
		
		var difference = Number(monster.level) - Number(partyLevel);
		if(partyLevel >= 4 && partyLevel <= 6)
			difference -= 1; // champion tier characters don't get as much credit for monsters...
		else if(partyLevel >= 7)
			difference -= 2; // and epic characters get even less
		
		if(monsterTables.difficulty.hasOwnProperty[difference])
			if(monsterTables.difficulty[difference].hashOwnProperty[monster.type])
				retval = monsterTables.difficulty[difference][monster.type];

		return retval;
	};

	return service;
});

app.filter('bonus', function() {
	return function(input) {
		var n = Number(input);
		if(n >= 0)
			return '+'+n.toString();
		else
			return n.toString();
	};
});

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
		]
	},
	mods: {
		offensive: function(m) {
			m.attack += 3;
			m.ac -= 3; m.pd -= 3; m.pd -= 3;
		},
		defensive: function(m) {
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
		},
		brittle: function(m) {
			m.ac += 3;
			m.hp = Math.round(m.hp * .7);
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
	}
});

app.value('PartyLevel', 1);
