angular.module('mathApp')
.controller('QuizCtrl', ['settings', function (settings) {
    vm = this;
    this.current = 1;
    this.questions = [];

    this.shuffle = function (arr) {
        var len = arr.length;
        var randomArr = [];
        for (var i = 0; i < len; i++) {
            var index = Math.floor(Math.random() * arr.length);
            randomArr.push(arr[index]);
            arr.splice(index, 1);
        }
        return randomArr;
    };

    this.exec = function (operation, num1, num2) {
        var ret;
        switch (operation) {
        case '+':
            ret = num1 + num2;
            break;
        case 'x':
            ret = num1 * num2;
            break;
        case '-':
            ret = num1 - num2;
            break;
        case '/':
            ret = num1 / num2;
            break;
        }
        return ret;
    };

    this.getQuestions = function () {
        var allowedOperations = [];
        settings.operationList.forEach(function (oper) {
            if (oper.enabled) {
                allowedOperations.push(oper);
                if (oper.operation == '+' || oper.operation ==
                    'x') {
                    oper.answerminimum = vm.exec(oper.operation,
                        oper.minimum, oper.minimum);
                    oper.answermaximum = vm.exec(oper.operation,
                        oper.maximum, oper.maximum);
                } else if (oper.operation == '-' ||
                    oper.operation == '/') {
                    oper.answerminimum = 0;
                    oper.answermaximum = vm.exec(oper.operation,
                        oper.maximum, oper.minimum);
                }
            }
        });

        for (var i = 0; i < settings.questionCount; i++) {
            var question = {};

            //choose an operation
            var operindex = Math.floor(Math.random() *
                allowedOperations.length);
            var oper = allowedOperations[operindex];

            //choose operation
            question.operator = oper.operation;
            //choose numbers
            question.number1 = Math.floor(Math.random() * (oper
                    .maximum - oper.minimum)) +
                oper.minimum;
            question.number2 = Math.floor(Math.random() * (oper
                    .maximum - oper.minimum)) +
                oper.minimum;
            //now select options
            question.answer = vm.exec(oper.operation, question.number1,
                question.number2);
            var options = [question.answer];

            for (var j = 0; j < 4; j++) {
                var opt = Math.floor(Math.random() *
                        (oper.answermaximum - oper.answerminimum)
                    ) +
                    oper.answerminimum;
                if (options.indexOf(opt) == -1)
                    options.push(opt);
            }
            question.options = this.shuffle(options);
            this.questions.push(question);
        }
    };

    //TODO: handle elapsed time
    this.time = "00:00";
    this.getQuestions();
    this.scores=[];

    //on button clicked
    this.optionClicked = function (value) {
        if (value == this.questions[this.current].answer)
            this.scores.push({type: 'success', value: 1});
        else
            this.scores.push({type: 'danger', value: 1});
        if (this.current < this.questions.length-1)
            this.current++;
        //TODO: handle else - quiz finished
    };

}]);