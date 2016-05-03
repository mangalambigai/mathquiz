angular.module('mathApp')
.factory('settings', function() {
    var settings= {
        questionCount: 25,
        operationList:[{
            operation: '+',
            name: 'addition',
            enabled: true,
            minimum: 0,
            maximum: 10,
            text: ' plus '
        },
        {
            operation: '-',
            name: 'subtraction',
            enabled: true,
            minimum: 0,
            maximum: 10,
            text: ' minus '
       },
       {
            operation: 'x',
            name: "multiplication",
            enabled: true,
            minimum: 0,
            maximum: 10,
            text: ' times '
        }]
    };
    return settings;
});