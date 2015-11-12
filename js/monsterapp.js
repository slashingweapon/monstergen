app = angular.module('monsterApp', []);

app.controller('builder', function($scope) {
	var builder = this;
	
	builder.type = 'single';
	builder.level = 0;
	builder.defense = 'pd';
	builder.mod = 'none';
	builder.inclFear = false;
	builder.attack = 1;
	builder.damage = 1;
	builder.ac = 10;
	builder.pd = 10;
	builder.md = 10;
	builder.hp = 5;
	builder.fear = 0;
	
	builder.recompute = function() {
		var stats;
		switch(builder.type) {
			case 'mook': stats = mookStats[builder.level]; break;
			case 'single':
			default: stats = singleStats[builder.level];
		}
		
		builder.attack = stats[1];
		builder.damage = stats[2];
		builder.hp = stats[3];
		builder.ac = stats[4];
		if(builder.defense == 'pd') {
			builder.pd = stats[5];
			builder.md = stats[6];
		} else {
			builder.pd = stats[6];
			builder.md = stats[5];
		}
		builder.fear = stats[7];
	};

	$scope.$watch('b.level', function() { 
		console.log("got called! " + Math.random()); 
		builder.recompute();
	});
	
});

/*	Each of these tables has the following columns:
	level
	attack bonus
	strike damage
	hip points
	AC
	better defense
	lesser defense
	fear threshold
*/
var mookStats = [
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
];

var singleStats = [
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
];

var doubleStats = [
	
];

var trippleStats = [
	
];

