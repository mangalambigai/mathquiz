angular.module('mathApp')
.controller('QuizCtrl', ['settings', function(settings){
    this.current = 1;
    this.questions = [];
    var allowedOperations=[];
    settings.operationList.forEach(function(oper){
        if (oper.enabled) {
            allowedOperations.push(oper);
        }
    });

    for (var i=0; i<settings.questionCount; i++)
    {
        var question = {};

        //choose an operation
        var operindex = Math.floor(Math.random()*allowedOperations.length);
        var oper = allowedOperations[operindex];
        //choose operation
        question.operation = oper.operation;
        //choose numbers
        question.number1 = Math.floor(Math.random()*(oper.maximum - oper.minimum))
             + oper.minimum;
        question.number2 = Math.floor(Math.random()*(oper.maximum - oper.minimum))
             + oper.minimum;
        //now select options
        question.options = [2,3,4,5,6];
        this.questions.push(question);
    }
    this.time = "00:00";

    //on button clicked
    this.optionClicked = function() {
        this.current++;
    };

}]);