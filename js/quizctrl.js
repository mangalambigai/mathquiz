angular.module('mathApp')
.controller('QuizCtrl', ['settings', '$scope', function (settings, $scope) {
    vm = this;
    this.questions = [];
    this.speechquestion = new SpeechSynthesisUtterance();
    this.speechanswer = new SpeechSynthesisUtterance();

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
                if (oper.operation == '+' || oper.operation == 'x') {
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
            question.operatorText = oper.text;
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

    //speak the current question
    this.speakCurrentQuestion = function() {
        vm.speechquestion.text = ' '+ this.questions[this.current].number1 +
            this.questions[this.current].operatorText +
            this.questions[this.current].number2;
        window.speechSynthesis.speak(vm.speechquestion);
    };
    //on button clicked
    this.optionClicked = function (value) {
        if (value == this.questions[this.current].answer) {
            this.scores.push({type: 'success', value: 1});
            // say correct
            vm.speechanswer.text = 'Correct';
        }
        else {
            this.scores.push({type: 'danger', value: 1});
            //say wrong
            vm.speechanswer.text = 'No, '+ this.questions[this.current].number1 +
                this.questions[this.current].operatorText +
                this.questions[this.current].number2 + ' is ' +
                this.questions[this.current].answer;
        }

        vm.speechanswer.onend = function(e) {
            $scope.$apply(function() {
	            if (vm.current < vm.questions.length-1) {
	                vm.current++;
	                //TODO: speak the question
	                vm.speakCurrentQuestion();
	            }
	            else {
	                //TODO: handle else - quiz finished
	            }
            });
        }

        window.speechSynthesis.speak(vm.speechanswer);

    };
    this.getQuestions();
    this.current = 0;
    this.speakCurrentQuestion();
    this.scores=[];


}]);