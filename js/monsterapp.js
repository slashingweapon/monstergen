app = angular.module('monsterApp', []);

app.controller('builder', function($scope, monsterTables) {
		
	$scope.type = 'single';
	$scope.level = 0;
	$scope.defense = 'pd';
	$scope.mod = 'none';
	$scope.inclFear = false;
	$scope.init = 3;
	
	$scope.recompute = function() {
		var stats = monsterTables.stats.hasOwnProperty($scope.type)
			? monsterTables.stats[$scope.type][$scope.level]
			: monsterTables.stats.single[$scope.level] ;
			
		var monster = {};
		monster.level = $scope.level;
		monster.attack = stats[1];
		monster.damage = stats[2];
		monster.hp = stats[3];
		monster.ac = stats[4];
		if(monster.defense == 'pd') {
			monster.pd = stats[5];
			monster.md = stats[6];
		} else {
			monster.pd = stats[6];
			monster.md = stats[5];
		}
		monster.fear = stats[7];
		
		switch($scope.mod) {
			case 'offensive':
				monster.attack += 3;
				monster.ac -= 3;
				monster.pd -= 3;
				monster.md -= 3;
				break;
			case 'defensive':
				monster.ac += 3;
				monster.hp = Math.round(monster.hp * .7);
				break;
			case 'scrapper':
				monster.attack += 3;
				monster.hp = Math.round(monster.hp * .7);
				break;
			case 'oaf':
				monster.ac += 3;
				monster.attack -= 3;
				break;
			case 'lunk':
				monster.hp = Math.round(monster.hp * 1.4);
				monster.ac -= 3;
				monster.pd -= 3;
				monster.md -= 3;
				break;
			case 'brittle':
				monster.ac += 3;
				monster.hp = Math.round(monster.hp * .7);
				break;		
		}
		monster.init = Number(monster.level) + Number($scope.init);
		$scope.monster = monster;
	};

	$scope.$watch('[level, type, defense, mod, inclFear, init]', function() {
		$scope.recompute();
	});
	
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
		level, attack bonus, strike damage, hit points, AC, better defense, lesser defense, fear threshold
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
		], single: [
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
		]
	}
});

