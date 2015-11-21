app = angular.module('monsterApp', []);

app.controller('partyCtrl', function($scope) {
	$scope.party = {
		level: 1,
		count: 3
	};
});

app.controller('encounterCtrl', function($scope) {
	$scope.encounter = {
		difficulty: 0
	};
	
	$scope.getDifficulty = function(monsters) {
		$scope.difficulty += 0.3 ;
	};
});

app.controller('monsterCtrl', function($scope, genops) {

	$scope.monster = genops.blankMonster();
	$scope.params = $scope.monster.params;
	
	$scope.$watch('[params.level, params.type, params.defense, params.mod, params.inclFear, params.init, params.bump]', function() {
		$scope.monster = genops.genMonster($scope.params);
	});
	
});

/*	Requires 'monster' and 'power' scope values. */
app.controller('powerController', function($scope, $interpolate) {
	$scope.toHit = function() {
		return Number($scope.monster.attack) + Number($scope.power.toHitMod);
	};
	$scope.dmg = function(n) {
		return Math.round( Number(n) * Number($scope.monster.damage) );
	};
	$scope.interpolate = function(n) {
		try {
			return $interpolate(n)($scope);
		} catch(ex) {
			return "";
		}
	};
});

app.controller('contribution', function($scope, genops) {
	$scope.getContribution = function(monster, partyLevel) {
		return genops.difficulty(monster, partyLevel);
	};
});

app.factory('genops', function(monsterTables) {
	var service = {};
	
	service.baseParams = function() {
		return {
			type: 'standard',
			level: 1,
			defense: 'pd',
			mod: '',
			inclFear: false,
			init: 3,
			bump: '',
			powers: []
		};
	};
	
	service.expectedDmg = function(dmg, save) {
		dmg = Number(dmg) || 10 ;	// amount of damage
		switch(save) {
			case 'easy': mult = 1.3; break;
			case 'hard': mult = 3.8; break;
			case 'normal':
			default: mult = 2.0; break;
		};
		
		return Math.round(dmg * mult);
	};
	
	service.basePower = function(n) {
		return angular.extend({}, monsterTables.weaponTemplate, monsterTables.weapons[n]);
	};
	
	service.getWeaponList = function() {
		var retval = {};
		angular.forEach(monsterTables.weapons, function(val, key) {
			retval[key] = val.title;
		});
		
		return retval;
	}
	
	service.blankMonster = function() {
		return {
			title: 'monster',
			description: '',
			count: 1,
			params: {
				level: 1,
				size: 'standard',
				speed: +3,
				goodDefense: 'pd',
				skew: null,
				bump: null
			},
			level: null,
			init: null,
			hp: null,
			ac: null,
			pd: null,
			md: null,
			specials: [],
			attacks: []
		};
	};
	
	service.genMonster = function(params) {
		params = angular.extend({}, this.baseParams(), params);
		
		var stats = monsterTables.stats.hasOwnProperty(params.type)
			? monsterTables.stats[params.type][params.level]
			: monsterTables.stats.standard[params.level] ;
			
		var monster = {};
		monster.level = Number(params.level);
		monster.type = params.type;
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
		switch(monster.level) {
			case 0: case 1: case 2: case 3: monster.tier = 'adventurer';
			case 4: case 5: case 6: monster.tier = 'champion';
			default: monster.tier = 'epic';
		}
		
		monster.powers = angular.copy(params.powers);
		console.log(monster);
		return monster;
	};

	service.difficulty = function(monster, partyLevel) {
		var retval = 0;
		
		var difference = Number(monster.level) - Number(partyLevel);
		if(partyLevel >= 4 && partyLevel <= 6)
			difference -= 1; // champion tier characters don't get as much credit for monsters...
		else if(partyLevel >= 7)
			difference -= 2; // and epic characters get even less
		
		if(monsterTables.difficulty.hasOwnProperty(difference)) {
			var values = monsterTables.difficulty[difference];
			if(values.hasOwnProperty(monster.type)) {
				retval = values[monster.type];
			}
		}
		return retval;
	};

	return service;
});

app.directive('oIcon', function($interpolate) {
	function link(scope, element, attrs) {
		var template = '<svg class="oicon"><use xlink:href="img/sprite.min.svg#{{icon}}"></use></svg>';
		var stuff = $interpolate(template)({icon:attrs.name});
		element.html(stuff);
	}

	return {
		link: link
	};
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

app.value('PartyLevel', 1);
