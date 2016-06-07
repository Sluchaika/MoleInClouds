app.directive('moleField',['field', 'Cnf', 'Draw', function(field, Cnf , Draw){
    return{
        restrict:'EA',
        controller: 'MolePath',
        link: function (scope, element){

            var context = element[0].getContext('2d');

            var fieldDraftsman = {
                init: function (ctx){
                    var l = 0,
                        lineNumber = 50;
                    scope.musicAmount = 0;
                    scope.lightsAmount = 0;
                    scope.ctx = ctx;
                    this.currentX = 0;
                    this.currentY = 0;
                    this.fieldSizeX = field.arr[0].length;
                    this.fieldSizeY = field.arr.length;
                    this.ordinaryNumber = 0;

                    for (l; l < lineNumber; l++){
                        this.drawField();
                    }

                },
                drawField: function (){
                    var direction = this.getDirection();

                    switch (direction){
                        case 'up':
                            this.fillField("column", "");
                            break;
                        case 'down':
                            this.fillField("column", "+");
                            break;
                        case 'right':
                            this.fillField("row", "+");
                            break;
                        case 'left':
                            this.fillField("row", "");
                            break;
                        default:
                            window.alert('Невозможно определить направление!');
                    }

                },
                getDirection: function() {
                    var directions = [],
                        that = this;
                    this.stepsNumber = this.getRandom(1, 10);
                    if (this.currentX + this.stepsNumber < this.fieldSizeX)
                    {
                        directions.push("right");
                    }
                    if (this.currentY + this.stepsNumber < this.fieldSizeY)
                    {
                        directions.push("down");
                    }
                    if (this.currentY - this.stepsNumber > 0)
                    {
                        directions.push("up");
                    }
                    if (this.currentX - this.stepsNumber > 0)
                    {
                        directions.push("left");
                    }
                    if (directions.length == 0){
                        this.getDirection();
                    }

                    function getOneDirection(min, max){
                        var nom_elem = that.getRandom(min, max);
                        return directions[nom_elem];
                    }
                    return getOneDirection(0, directions.length - 1);

                },

                fillField: function (line, sign){
                    var  that = this;

                    if (line === 'row'){
                        fillX(sign);
                    }
                    else {
                        fillY (sign);
                    }

                    function fillY(sign){
                        var i = that.currentY;
                        if (sign){
                            for (i; i < that.currentY + that.stepsNumber; i++){
                                setOrdinaryField(i, that.currentX);
                            }
                            that.currentY = i;
                        }
                        else {
                            for (i; i > (that.currentY - that.stepsNumber); i--){
                                setOrdinaryField(i, that.currentX);
                            }
                            that.currentY = i;
                        }
                    }
                    function fillX(sign){
                        var j = that.currentX;
                        if (sign){
                            for (j; j < that.currentX + that.stepsNumber; j++){
                                setOrdinaryField(that.currentY,j);
                            }
                            that.currentX = j;
                        }
                        else {
                            for (j; j > (that.currentX - that.stepsNumber); j--){
                                setOrdinaryField(that.currentY, j);
                            }
                            that.currentX = j;
                        }
                    }
                    function setOrdinaryField(i,j){

                        var x = j * Cnf.SIZE_TILE,
                            y =  i * Cnf.SIZE_TILE;

                        if (field.arr[i][j] == 0){

                            field.arr[i][j] = Cnf.TILE_ORDINARY;

                            if (that.ordinaryNumber == Cnf.INTERVAL_LIGHTNING)
                            {
                                field.arr[i][j] = Cnf.TILE_LIGHTNING;
                                scope.lightsAmount += 1;
                            }
                            if (that.ordinaryNumber == Cnf.INTERVAL_MUSIC)
                            {
                                scope.musicAmount++;
                                field.arr[i][j] = Cnf.TILE_MUSIC;
                                that.ordinaryNumber = 0;
                                Draw.Img(x, y,  "img/note.png", scope.ctx);

                            }
                            else{
                                Draw.Img(x, y, "img/cloud.png", scope.ctx);
                            }

                            that.ordinaryNumber++;

                        }
                    }

                },
                getRandom: function(min, max){
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
            };
            fieldDraftsman.init(context);

        }
    };
}]);/**
 * Created by Ника on 07.06.2016.
 */
