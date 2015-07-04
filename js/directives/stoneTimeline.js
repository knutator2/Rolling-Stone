myApp.directive('stonetimeline', ['StonesService', 'EpocheService', function(StonesService, EpocheService) {
    return {
        restrict: 'E',
        scope : {
            stones: '='
        },
        replace: true,
        templateUrl: 'js/directives/stonetimeline.html',
        link: function (scope, element, attrs) {

            scope.closeDescriptions = function(event) {
                $shortDescriptionElem = $('.era-description-short'),
                $longDescriptionElem = $('.era-description-long'),
                $descriptionWrapper = $('.era-description-wrapper'),
                $timelineWrapper = $('.timeline-wrapper'),
                $timelineAbsoluteWrapper = $('.timeline-absolute-wrapper'),

                $shortDescriptionElem.text('');
                $longDescriptionElem.text('');

                $descriptionWrapper.removeClass('active');
                $timelineWrapper.removeClass('active');
                $timelineAbsoluteWrapper.removeClass('active');
            };

            scope.showLongDescription = function(event) {

            };

            var all_stones = [];

            StonesService.getPins().then(function (response) {
                all_stones = response;
            });

            EpocheService.get().then(function (data) {
                scope.epoches = _.filter(data, {multi : false});
                scope.epoches.reverse();
                var tickLabels = [];
                var ticks = [];
                count = 0;
                angular.forEach(scope.epoches, function(data) {
                    console.log(data);
                    tickLabels.push('<img src="' + data.icon + '" data-era-id="' + data.id + '" class="timeline-picture"/>');
                    ticks.push(count);
                    count++;
                })

                $('.stone-timeline').on('click', '.timeline-picture', function(event) {
                    event.stopPropagation();

                    var $this = $(this),
                        $shortDescriptionElem = $('.era-description-short'),
                        $longDescriptionElem = $('.era-description-long'),
                        $descriptionWrapper = $('.era-description-wrapper'),
                        $timelineWrapper = $('.timeline-wrapper'),
                        $timelineAbsoluteWrapper = $('.timeline-absolute-wrapper'),
                        eraId = parseInt( $this.data('era-id'), 10);

                    era = _.find(scope.epoches, function(item) {
                        return (item.id === eraId);
                    });

                    console.log($shortDescriptionElem);

                    $shortDescriptionElem.html('<strong>' + era.name + '</strong> &mdash; ' + era.text_short);
                    $descriptionWrapper.addClass('active');
                    $timelineWrapper.addClass('active');
                    $timelineAbsoluteWrapper.addClass('active');

                    console.log(era);
                    console.log($(this).data('era-id'));
                });

                console.log(ticks);


                var slider = $('#ex1').slider({
                formatter: function(value) {
                    return 'Current value: ' + value;
                },
                //min: 0,
                //max: 5,
                step: 0.01,
                value: [0,10],
                //handle: "circle",
                tooltip: 'hide',
                ticks: ticks,
                ticks_labels: tickLabels,
                scale: 'linear',
                //reversed : true
            });

            $("#ex1").on("slideStop", function(slideEvt) {
                console.log(slideEvt.value);
                var leftIndex = Math.round(slideEvt.value[0]);
                var rightIndex = Math.round(slideEvt.value[1]);
                slider.slider('setValue', [leftIndex, rightIndex]);
                var leftEpoche = scope.epoches[leftIndex];
                var rightEpoche = scope.epoches[rightIndex];
                if (scope.stones.length > 0) {
                    var stones_copy = JSON.parse(JSON.stringify(all_stones))
                    var filtered_stones = _.map(stones_copy, function (elem) { 
                        elem.stones = _.filter(elem.stones, function (stone) {
                            //var date = parseInt(stone.date_in_mya.split("-")[0]);
                            //return date <= leftEpoche.start && date >= rightEpoche.end;
                            for (var i = leftIndex; i <= rightIndex; i++) {
                                if (stone.geological_era === scope.epoches[i].name) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        return elem;
                    });
                    filtered_stones = _.filter(filtered_stones, function (elem) {
                        return elem.stones.length > 0
                    });
                    console.log("want to update markers")
                    scope.stones = filtered_stones;
                }
                
                //if (slideEvt.value[0] < 1)
                //    scope.stones = all_stones;
                // else {
                //     scope.stones = [];
                // }
            });
            });

            
            
            

            scope.init = function() {
                console.log(scope.stones)
                scope.stones = [];
                //scope.$apply();
            };
        }
    };
}]);