angular.module('mathApp', [])
.controller('QuizCtrl', function(){
    this.current = 1;
    this.questions = [
        {number1: 1, number2: 2, operator: '+', options: [2,3,4,5,6]},
        {number1: 2, number2: 4, operator: '+', options: [2,3,4,5,6]}
    ];
    this.time = "00:00";
});