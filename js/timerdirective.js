angular.module('mathApp')
.directive('timer', ['$interval', 'dateFilter', function($interval, dateFilter) {
    function link(scope, element, attrs) {
        var timeoutId, counter = 0;
        var started = false;

        function updateTime() {
            counter+=1000;
            //use angular's dateFilter to format the time interval in mm:ss format
            element.text(dateFilter(new Date(counter), 'mm:ss', 'UTC'));
        }

        scope.$watch(attrs.state, function(value) {
            if (value === 'stop' && started == true) {
                $interval.cancel(timeoutId);
                started = false;
            }

            if (value === 'start'&& started == false) {
                started = true;
                // start the UI update process; save the timeoutId for canceling
                timeoutId = $interval(function() {
                    updateTime(); // update DOM
                }, 1000);
            }
        });

        element.on('$destroy', function() {
            $interval.cancel(timeoutId);
        });
        // start the UI update process; save the timeoutId for canceling
        timeoutId = $interval(function() {
            updateTime(); // update DOM
        }, 1000);
        started = true;
    }
    return {
        link: link
    };
}]);