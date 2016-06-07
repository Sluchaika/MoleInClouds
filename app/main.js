'use strict';
var app = angular.module('app', [
    'ngAnimate',
    'idialog'
]);

app.constant('Cnf', {
		'TILE_ORDINARY': 1,
		'TILE_LIGHTNING':  2,
		'TILE_MUSIC': 3,
		'INTERVAL_LIGHTNING': 7,
		'INTERVAL_MUSIC': 10,
		'SIZE_TILE': 40

});

app.value('SIZE', {'x': 20, 'y': 20});

app.factory('field',['SIZE', function(SIZE){ 

		var arr = [];
		var i,j;			    
		for (i = 0; i < SIZE.y; i++){
			arr[i] = [];
			for (j = 0; j < SIZE.x; j++){
				arr[i][j] = 0;
			}
	   }
   
   return {
	   arr: arr,
	   x: 0,
	   y: 0,
       score: 0
   }
}]);

app.factory('Draw', function(){
	return {
		 
		Img: function(x, y, path, ctx){
			var background = new Image();
			background.src = path;
			background.onload = function(){
			   ctx.drawImage(background, x , y);
	       };
        }
	}
});
	
app.controller ('MolePath', ['$scope', '$element' , 'Cnf', 'field','Draw', function ($scope, $element, Cnf , field, Draw){

    $scope.score = 0;
	var collectedMusic = 0;
	$scope.moleStyle = {};

    this.keyDown = function(e){
        switch (e.keyCode){
            case 39:
                if (field.arr[field.y][field.x + 1] > 0){
                    goMole('left', field.x + 1);
                    field.x++;
                    isWin();
                }
                break;
            case 40:
                if (field.arr[field.y + 1] && field.arr[field.y + 1][field.x] > 0){
                    goMole('top', field.y + 1);
                    field.y++;
                    isWin();
                }
                break;
            case 37:
                if (field.arr[field.y][field.x - 1] > 0){
                    goMole('left', field.x - 1);
                    field.x--;
                    isWin();
                }
                break;
            case 38:
                if (field.arr[field.y - 1]&& field.arr[field.y - 1][field.x] > 0){
                    goMole('top', field.y - 1);
                    field.y--;
                    isWin();
                }
                break;
            default:
                break;
        }
    };

    function goMole(direction, coordinate){

        $scope.score++;
		if (direction == 'left'){
			$scope.moleStyle = {'left': coordinate * 40 + 'px', 'top' : $scope.moleStyle.top};
		}
		else{
			$scope.moleStyle = {'top': coordinate * 40 + 'px', 'left' : $scope.moleStyle.left};
		}						
		 
	}
	
	function isWin(){

        if (field.arr[field.y][field.x] == Cnf.TILE_MUSIC ){
			playMusic();
			$scope.ctx.clearRect( field.x * Cnf.SIZE_TILE , field.y * Cnf.SIZE_TILE, Cnf.SIZE_TILE, Cnf.SIZE_TILE);
			field.arr[field.y][field.x] = 1;
			drawPath();
			collectedMusic++;
			if (collectedMusic == $scope.musicAmount){
				 drawPath();
                 sayAboutWin();
			}
	    }
	    else {
		    drawPath();
	    }

        function playMusic(){
           var number = getRandom(1,7);
           $scope.audio = 'music/'+number+'.wav';
        }

        function drawPath(){
            $scope.ctx.clearRect(field.x * Cnf.SIZE_TILE , field.y * Cnf.SIZE_TILE, Cnf.SIZE_TILE, Cnf.SIZE_TILE);
            Draw.Img(field.x * Cnf.SIZE_TILE,  field.y * Cnf.SIZE_TILE, "img/traces.png", $scope.ctx);
        }

	    function getRandom(min, max){
			return Math.floor(Math.random() * (max - min + 1)) + min;
	    }

        function sayAboutWin(){
            field.score = $scope.score;
            $element[0].querySelector('.win').click();
        }
	}

    this.newGame = function(){
        location.reload();
    }
	
}]);

app.controller('LightsCtrl', ['$scope', 'field', 'Cnf', function($scope, field, Cnf){

    var millisecond = 0,
	    second = 0,
		timeLight;

	(function GoTime()
    {
		millisecond += 1;
		timeLight = getRandom(1,9);
		if (millisecond == 10)
		{
		  second += 1;
		  millisecond = 0;
		}
		ControlLightning(true);
		if(second==1)
		{
		  ControlLightning();
		}

		setTimeout(GoTime, 100)
    })();
     
	function getRandom (min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function ControlLightning(first)
    {   
		if ((millisecond == 8))
		{
		    if (first){
			    $scope.light1Style = {'display': 'none'};
		    }
		    else{
			    $scope.light2Style = {'display': 'none'};
		    }
		   
		}
		if ((millisecond == timeLight))
		{
		    second = 0;
		    if (first){
			     drawLightning(first);
		    }
		    else  {
				drawLightning();
			  
		    }
           		  
		   
		}
   }
   
   
   function drawLightning(first)
  {	 
    var numberLightNow = getRandom(1, $scope.lightsAmount),
	    numberLights = 0;
 
    for ( var i = 0; i < field.arr.length; i++){
        for ( var j = 0; j < field.arr[0].length; j++){
			if ((field.arr[i][j]) == Cnf.TILE_LIGHTNING){
			    numberLights += 1;
			    if (numberLightNow == numberLights)
			    {
				    if(first){
					    $scope.light1Style = {'display': 'block', 'position':'absolute', 'left': j * Cnf.SIZE_TILE + 'px' , 'top':i * Cnf.SIZE_TILE + 'px'};
				    }
				    else{
					    $scope.light2Style = {'display': 'block', 'position':'absolute', 'left': j * Cnf.SIZE_TILE + 'px', 'top': i * Cnf.SIZE_TILE + 'px'};
				    }
				     
					if((field.x == j)&&(field.y == i))
					{
					    $scope.audio = 'music/lighting.wav';
					    alert("Увы, вас убила молния.");
					    location.reload();
					}
			    }

			}
        }
    }
  }  
}]);

app.controller( 'ResultCtrl', ['$scope', 'field',  function($scope, field){
    $scope.score = field.score;
        if($scope.score < 50){
            $scope.comment = 'Кажется это рекорд!';
        }
        else if($scope.score < 70){
			$scope.comment = 'Отличный результат!';
		}         
		else if ($scope.score < 80){
			$scope.comment = 'Неплохо, но можно лучше!';
		} 
		else if ($scope.score < 90){
			$scope.comment = 'Ну и пути ты выбираешь!';
		}
		else{
			 $scope.comment = 'Ужасный результат. Но ты не сдавайся!';
		}
}]);



 
