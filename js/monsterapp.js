app = angular.module('monsterApp', ['xeditable']);

app.controller('partyCtrl', function($scope) {
	$scope.party = {
		level: 1,
		count: 3
	};
});

app.controller('encounterCtrl', function($scope, genops) {
	$scope.encounter = {
		difficulty: 0
	};
	
	$scope.monsters = [];
	
	$scope.getDifficulty = function(monsters) {
		$scope.difficulty += 0.3 ;
	};
	
	$scope.addMonster = function() { 
		var newMonster = genops.blankMonster();
		$scope.monsters.push(newMonster);
		console.log($scope.monsters);
	}
});

app.controller('monsterCtrl', function($scope, genops, monsterTables) {

	$scope.monster = genops.blankMonster();
	
	$scope.types = Object.keys(monsterTables.stats);
	$scope.mods = Object.keys(monsterTables.mods);
	$scope.bumps = ['no bumps'].concat( Object.keys(monsterTables.bumps) );
	$scope.levels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
	$scope.defenses = { "PD": "pd", "MD":"md" };
	$scope.speed = { molasses:-1, slow:0, awkward:1, average:2, nible:3, quick:4, fast:5,
		faster:6, "pc fast":7, blinding:8, rogue:9 };
	
	$scope.$watch('[monster.title, monster.description, monster.params.level, monster.params.type, monster.params.defense, monster.params.mod, monster.params.inclFear, monster.params.init, monster.params.bump]', function() {
		genops.updateMonster($scope.monster);
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
			mod: 'troop',
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
			params: this.baseParams(),
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
	
	service.updateMonster = function(monster) {
		var params = angular.extend({}, this.baseParams(), monster.params);
		
		var stats = monsterTables.stats.hasOwnProperty(params.type)
			? monsterTables.stats[params.type][params.level]
			: monsterTables.stats.standard[params.level] ;
			
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

app.run(function(editableOptions) {
  editableOptions.theme = 'default'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
