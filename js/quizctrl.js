angular.module('mathApp')
.controller('QuizCtrl', ['settings', '$scope', '$uibModal', '$location',
    function (settings, $scope, $uibModal, $location) {
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
        vm.timerstate = 'stop';
        vm.disableOptions = true;
        vm.flashAnswer = true;
        if (value == this.questions[this.current].answer) {
            this.scores.push({type: 'success', value: 1});
            this.correct++;
            // say correct
            vm.speechanswer.text = 'Correct';
            vm.showcheck = true;
        }
        else {
            this.scores.push({type: 'danger', value: 1});
            //say wrong
            vm.showcross = true;
            vm.review.push(this.questions[this.current]);
            vm.speechanswer.text = 'No, '+ this.questions[this.current].number1 +
                this.questions[this.current].operatorText +
                this.questions[this.current].number2 + ' is ' +
                this.questions[this.current].answer;
        }

        vm.speechanswer.onend = function(e) {
            $scope.$apply(function() {
                vm.showcross = false;
                vm.showcheck = false;
                if (vm.current < vm.questions.length-1) {
                    vm.flashAnswer = false;
                    vm.current++;
                    vm.disableOptions = false;
                    // speak the question
                    vm.speakCurrentQuestion();
                    vm.timerstate = 'start';
                }
                else {
                    //TODO: handle else - quiz finished
                    vm.showResults();
                }
            });
        }

        window.speechSynthesis.speak(vm.speechanswer);

    };

    this.startQuiz = function() {
        this.flashAnswer = false;
        this.disableOptions = false;
        this.current = 0;
        this.correct = 0;
        this.speakCurrentQuestion();
        this.scores=[];
        this.review=[];
        vm.timerstate = 'start';
    };

    this.showResults = function() {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/results.html',
            controller: 'ResultsCtrl',
            controllerAs: 'results',
            size: 'lg',
            resolve: {
                items: function() {return [vm.correct,
                vm.questions.length,
                 vm.review]}
            }
        });

        modalInstance.result.then(function (redo) {
            if (redo)
                vm.startQuiz();
            else
                $location.path('#/home');
        }, function () {
            $location.path('#/home');
        });
    };

    this.getQuestions();
    this.startQuiz();

}]);
