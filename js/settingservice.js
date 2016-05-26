angular.module('mathApp')
.factory('settings', function() {
    //TODO: read this from local storage
    var settings= {
        questionCount: 25,
        operationList:[{
            operation: '+',
            name: 'Addition',
            enabled: true,
            minimum: 0,
            maximum: 10,
            text: ' plus '
        },
        {
            operation: '-',
            name: 'Subtraction',
            enabled: true,
            minimum: 0,
            maximum: 10,
            text: ' minus '
       },
       {
            operation: 'x',
            name: "Multiplication",
            enabled: true,
            minimum: 0,
            maximum: 10,
            text: ' times '
        }]
    };
    return settings;
});