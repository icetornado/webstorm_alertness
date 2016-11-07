//atoAlertnessMyChargeCalendarModule

var atoAlertnessMyChargeCalendarModule = angular.module('atoAlertnessMyChargeCalendarModule', ['mwl.calendar', 'ui.bootstrap']);
atoAlertnessMyChargeCalendarModule.config(function(calendarConfig) {

    //console.log(calendarConfig); //view all available config
    calendarConfig.templates.calendarSlideBox = './templates/calendar/calendarSlideBox.html';
    calendarConfig.templates.calendarMonthCell = './templates/calendar/calendarMonthCell.html';
    calendarConfig.templates.calendarMonthCellEvents = './templates/calendar/calendarMonthCellEvents.html';
    calendarConfig.templates.calendarMonthView = './templates/calendar/calendarMonthView.html';
    calendarConfig.dateFormatter = 'moment';
    calendarConfig.allDateFormats.moment.title.day = 'ddd D MMM';
    calendarConfig.allDateFormats.moment.date.weekDay  = 'ddd';
    calendarConfig.displayAllMonthEvents = true;
    calendarConfig.colorTypes.info = {
        primary: '#ed3c18',
        secondary: '#d1e8ff'
    };
})
.controller('MyChargeCalendarController', ['$rootScope', '$scope', '$uibModal', 'moment', 'calendarConfig', 'MyChargeDataService',
    'DEFAULT_PREDICTION_DAYS', 'DEFAULT_SLEEP_START', 'DEFAULT_SLEEP_DURATION', 'DEFAULT_SLEEP_END',
    function($rootScope, $scope, $uibModal, moment, calendarConfig, MyChargeDataService, DEFAULT_PREDICTION_DAYS,
             DEFAULT_SLEEP_START, DEFAULT_SLEEP_DURATION, DEFAULT_SLEEP_END){
        var vm = this;
        
        vm.calendarView = 'month';
        vm.viewDate = new Date();
        vm.isCellOpen = false;
        vm.eventsChangedState = false;
        vm.message = '';
        $scope.between = function (x, min, max) {
            return x >= min && x <= max;
        }
        
         //$rootScope.$broadcast('topic', 'message');
        $scope.$watch('vm.events', function(newVal, oldVal){
            if(newVal!=oldVal) {
                $scope.$broadcast('vm.events',{"events":newVal})
            }    
        });
        
        
        $rootScope.MyChargeCalendarControllerScopeVar = $scope;
        //$rootScope.sleepActions = sleepActions;
       // $rootScope.caffeineActions = caffeineActions;
        $rootScope.addActions = addActions;
        $rootScope.MyChargeCalendarControllerScope = $scope;
        $rootScope.vmmessage = vm.message;
        


        /* Used for fixing bugs caused by Adding Default Sleep */
        $scope.day = {};
        $scope.sliceCount = 0;
        $scope.caffeineClickCount = 0;
        $scope.todaysDateSleeptime = 0;
        $scope.defaultElevenPmExist = true;
        $scope.isTodaysDateDeleted = function(intTodaysDateSleeptime, arrOfSleepTime){ 
            $scope.defaultElevenPmExist = true;
            var allSleepInLocalStorage = [];
            arrOfSleepTime.forEach(function(entry, i){
                if(arrOfSleepTime[i].dataType == 'sleep') {
                    allSleepInLocalStorage.push(moment(arrOfSleepTime[i].startsAt).toDate().getTime());
                    allSleepInLocalStorage.push(moment(arrOfSleepTime[i].endsAt).toDate().getTime());
                } 
            });
            allSleepInLocalStorage.forEach(function(entry, i){
                if(i % 2 == 0){
                    if ((allSleepInLocalStorage[i] == $scope.todaysDateSleeptime) && (allSleepInLocalStorage[i+1] == $scope.todaysDateSleeptime)){
                        $scope.defaultElevenPmExist = false;
                    }
                }
            });
        }
        /* End Used for fixing bugs caused by Adding Default Sleep */

        var sleepActions = [
            {
                label: '<i class=\'glyphicon glyphicon-remove\'></i>',
                onClick: function(args) {
                    deleteEvent('Delete-Sleep', args.calendarEvent);
                }
            },
            {
                label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
                onClick: function(args) {
                    showModal('Edit-Sleep', args.calendarEvent);
                }
            }
        ];

        var sleepDefaultActions = [
            {
                label: '<i class=\'glyphicon glyphicon-remove\'></i>',
                onClick: function(args) {
                    deleteEvent('Delete-Sleep', args.calendarEvent);
                }
            },
            {
                label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
                onClick: function(args) {
                    showModal('Edit-Sleep', args.calendarEvent);
                }
            }
        ];

        var caffeineActions = [
            {
                label: '<i class=\'glyphicon glyphicon-remove\'></i>',
                onClick: function(args) {
                    deleteEvent('Delete-Coffee', args.calendarEvent);
                }
            },
            {
                label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
                onClick: function(args) {
                    showModal('Edit-Coffee', args.calendarEvent);
                }
            }
        ];
        $scope.sliceCaffieneCount = 0;
        $scope.sliceCaffiene = function(){
            vm.events.splice(-2,1);
            $scope.sliceCaffieneCount++;
        }
        var addActions = [
            {
                label: '<div class=\'btn btn-primary\'>+ Sleep</div>',
                onClick: function(args) {
                        /*  Used for fixing bugs caused by Adding Default Sleep */
                        console.log(calendarConfig);
                        if ($scope.defaultElevenPmExist){ 

                            try {
                                var eventDatatypeLast = vm.events[vm.events.length - 1].dataType;
                                var eventDatatypeSecondLast = vm.events[vm.events.length - 2].dataType;
                                var eventDatatypeLastTime = moment(vm.events[vm.events.length - 1].startsAt).toDate().getTime();
                                var eventDatatypeSecondLastTime = moment(vm.events[vm.events.length - 2].startsAt).toDate().getTime();
                                var startTimeOfDay = moment($scope.day).toDate().getTime();
                                var endTimeOfDay = moment(moment($scope.day).toDate().getTime() + (3600000 * 24)).toDate().getTime();
                                var startSleepHour = moment(moment($scope.day).toDate().getTime() + (3600000 * 23)).toDate().getTime();
                                var nextDaySleepEnd = moment(moment($scope.day).toDate().getTime() + (3600000 * 31)).toDate().getTime();
                                
                            }
                            catch(err) {
                                console.log(err);
                            }

                           console.log(vm.events[vm.events.length - 1].cssClass);
                           
                           var classOfLastObjectFromEvents = vm.events[vm.events.length - 1].cssClass;
                           if (classOfLastObjectFromEvents !== undefined ) { 
                               vm.events.splice(-1,1);
                               console.log('splice');
                           } else {
                               //caffiene
                                
                               vm.events.push(
                                {
                                    title: '',
                                    color: calendarConfig.colorTypes.alert,
                                    startsAt: moment($scope.day).add(1, 'days').subtract(1, 'milliseconds').toDate(),
                                    draggable: false,
                                    resizable: false,
                                    incrementsBadgeTotal: false,
                                    allDay: true,
                                    actions: addActions,
                                    cssClass: 'fake-event-class'
                                });

                                  vm.events.push(
                                    {
                                        title: 'Default Sleep',
                                        color: calendarConfig.colorTypes.success,
                                        startsAt: moment(startSleepHour + 1).toDate(),
                                        endsAt: moment(nextDaySleepEnd + 1).toDate(),
                                        draggable: false,
                                        resizable: false,
                                        incrementsBadgeTotal: false,
                                        allDay: true,
                                        actions: sleepDefaultActions,
                                        dataType: 'defaultSleep',
                                        cssClass: 'default-sleep'
                                    }
                                );

                                vm.events.splice(-1,1);
                                
                               
                           }
                           
                        } 
                       
                    /* End Used for fixing bugs caused by Adding Default Sleep */
                    showModal('Add-Sleep', args.calendarEvent);
                }
            },
            {
                label: '<div class=\'btn btn-primary\'>+ Caffeine</div>',
                onClick: function(args) {
                   // console.log(vm.events);
                   console.log(args);
                   console.log(args.calendarEvent);

                    showModal('Add-Coffee', args.calendarEvent);
                    vm.events.push(
                    {
                        title: '',
                        color: calendarConfig.colorTypes.alert,
                        startsAt: moment($scope.day).add(1, 'days').subtract(1, 'milliseconds').toDate(),
                        draggable: false,
                        resizable: false,
                        incrementsBadgeTotal: false,
                        allDay: true,
                        actions: addActions,
                        cssClass: 'fake-event-class'
                    }
                );
                }
            }
        ];
        vm.events = [];
        
        MyChargeDataService.getData(function(response){
            if(response.success == "true") {
                var myChargeEvents = response.data;
                for(var i = 0; i < myChargeEvents.length; i++){
                    if(myChargeEvents[i].dataType == 'sleep'){
                        var title = 'Sleep';
                        var cssClass = 'has-sleep';

                        if(myChargeEvents[i].tsStart == myChargeEvents[i].tsEnd) {
                            title = 'Zero Sleep';
                            cssClass = 'zero-sleep';
                        }
                        vm.events.push(
                            {
                                title: title,
                                color: calendarConfig.colorTypes.warning,
                                startsAt: moment.utc(myChargeEvents[i].tsStart).toDate(),
                                endsAt: moment.utc(myChargeEvents[i].tsEnd).toDate(),
                                draggable: false,
                                resizable: false,
                                incrementsBadgeTotal: false,
                                allDay: false,
                                actions: sleepActions,
                                dataType: 'sleep',
                                cssClass: cssClass
                            }
                        );
                    }
                    else {
                        vm.events.push(
                            {
                                title: 'Caffeine',
                                color: calendarConfig.colorTypes.info,
                                startsAt: moment(myChargeEvents[i].tsStart).toDate(),
                                sourceID: myChargeEvents[i].sourceID,
                                amount: myChargeEvents[i].amount,
                                quantity: myChargeEvents[i].quantity,
                                draggable: false,
                                resizable: false,
                                incrementsBadgeTotal: false,
                                allDay: false,
                                actions: caffeineActions,
                                dataType: 'caffeine'
                            }
                        );
                    }
                }
            }
        });
       
        /**
         *  This function is called when the calendar is being rendered
         *  @param {object} - a calendar cell object
         *  If there is no sleep event overlap the day, a default sleep event is created
         *  and push into the events property of the calendar cell object
         */

        //adding default sleep events

        vm.modifyCell = function(calendarCell){

            if($rootScope.DataPredictiondate != 0) {
                var endDate = $rootScope.DataPredictiondate;
            }
            else {
                var endDate = moment().startOf('day').toDate();
            }

            var startDate = moment(endDate).subtract(DEFAULT_PREDICTION_DAYS, 'days').toDate();

            //highlight the prediction date range, default range is from the current date back to DEFAULT_PREDICTION_DAYS
            // in the past
            if(calendarCell.date._d >= startDate && calendarCell.date._d <= endDate) {
                calendarCell.cssClass = 'highlight-calendar-cell';
            }

            var ok = true;
            var zeroHour = moment(calendarCell.date._d).startOf('day').toDate().getTime();
            var startSleepHour = zeroHour + DEFAULT_SLEEP_START * 60 * 60 * 1000 - 1;
            var nextDaySleepEnd = startSleepHour + DEFAULT_SLEEP_DURATION * 60 * 60 * 1000;

            for(var i = 0; i < vm.events.length; i++) {
                if(vm.events[i].dataType == 'sleep') {
                 
                    if((moment(vm.events[i].endsAt).toDate().getTime() > startSleepHour && moment(vm.events[i].endsAt).toDate().getTime() < nextDaySleepEnd)
                        || (moment(vm.events[i].startsAt).toDate().getTime() < nextDaySleepEnd && moment(vm.events[i].endsAt).toDate().getTime() > nextDaySleepEnd)) {
                        ok = false;
                        break;
                    }
                }
            }
       
            if(ok) {
                calendarCell.events.push(
                    {
                        title: 'Default Sleep',
                        color: calendarConfig.colorTypes.success,
                        startsAt: moment(startSleepHour + 1).toDate(),
                        endsAt: moment(nextDaySleepEnd + 1).toDate(),
                        draggable: false,
                        resizable: false,
                        incrementsBadgeTotal: false,
                        allDay: true,
                        actions: sleepDefaultActions,
                        dataType: 'defaultSleep',
                        cssClass: 'default-sleep'
                    }
                );
            }
        };

        vm.fakeEventID = null;
        vm.fakeEventDate = null;

        /**
         * Add a fake event for containing two buttons
         * @param {object} day - a day object of the calendar
         * Two buttons are "Add Sleep" and "Add Caffeine"
         * when a button is clicked, it triggers toggleFakeEvent function
         */

        //
        vm.myOnTimespanClick = function(day){
            console.log('vm.myOnTimespanClick');
           /* Used for fixing bugs caused by Adding Default Sleep */
           $scope.day = day;
           $rootScope.day = $scope.day;
           $rootScope.event = {
                title: '',
                color: '',
                startsAt: moment($rootScope.day).add(1, 'days').subtract(1, 'milliseconds').toDate(),
                draggable: false,
                resizable: false,
                incrementsBadgeTotal: false,
                allDay: true,
                actions: $rootScope.addActions,
                cssClass: 'fake-event-class'
            }

           $scope.todaysDateSleeptime = moment($scope.day).toDate().getTime() + (3600000 * 23) + 1;
           $scope.isTodaysDateDeleted($scope.todaysDateSleeptime, vm.events);
           $scope.sliceCount = 0;
           $scope.caffeineClickCount = 0;
           $scope.sliceCaffieneCount = 0;
      
        }

        vm.toggleFakeEvent = function(day, act) {
            console.log('vm.toggleFakeEvent');
            if(act == 'add'){
                
                vm.events.push(
                    {
                        title: '',
                        color: calendarConfig.colorTypes.alert,
                        startsAt: moment(day).add(1, 'days').subtract(1, 'milliseconds').toDate(),
                        draggable: false,
                        resizable: false,
                        incrementsBadgeTotal: false,
                        allDay: true,
                        actions: addActions,
                        cssClass: 'fake-event-class'
                    }
                );

                vm.fakeEventID = vm.events.length - 1;
            }
            else if(act == 'remove'){  //remove the fake event
               vm.events.splice(vm.fakeEventID, 1);

            }
            
        }
        
        showModal = function(action, event){
            console.log(event);
            console.log($scope.vm.events);
            if(action == 'Edit-Sleep' || action == 'Add-Sleep') {
                var modalInstance = $uibModal.open({
                    //animation: vm.animationsEnabled,
                    windowTemplateUrl: './templates/modal/window.html',
                    templateUrl: 'sleepModal.html',
                    controller: 'MyChargeCalendarModalController',
                    backdrop: false,
                    size: 'small',
                    scope: $scope,
                    resolve: {
                        calEvent: function(){
                            return event;
                        },
                        eventType : function(){
                            return 'sleep';
                        },
                        action: function() {
                            return action;
                        },
                        events: function() {
                            return $scope.vm.events;
                        },
                        actionButtons: function() {
                            return sleepActions;
                        },
                        calendarConfig: function() {
                            return calendarConfig;
                        }
                    }
                });
                
            }
            else if(action == 'Edit-Coffee' || action == 'Add-Coffee') {
                var modalInstance = $uibModal.open({
                    //animation: vm.animationsEnabled,
                    windowTemplateUrl: './templates/modal/window.html',
                    templateUrl: 'caffeineModal.html',
                    controller: 'MyChargeCalendarModalController',
                    backdrop: false,
                    size: 'small',
                    scope: $scope,
                    resolve: {
                        calEvent: function(){
                            //console.log(event);
                            return event;
                        },
                        eventType : function(){
                            return 'caffeine';
                        },
                        action: function() {
                            return action;
                        },
                        events: function() {
                            return $scope.vm.events;
                        },
                        actionButtons: function() {
                            return caffeineActions;
                        },
                        calendarConfig: function() {
                            return calendarConfig;
                        }
                    }
                });
            }

            
            if(action == 'Add-Sleep') {
                modalInstance.result.then(function (msg) {
                            //console.log(typeof msg);
                            vm.message = msg;
                            /* Used for fixing bugs caused by Adding Default Sleep */
                            //vm.toggleFakeEvent($scope.day, 'add');
                            
                        }, function(){
                            /* Used for fixing bugs caused by Adding Default Sleep */
                           //vm.toggleFakeEvent($scope.day, 'add');
                           //vm.events.splice(-1,1);
                          
                        }
                    );
            } else {
                 modalInstance.result.then(function (msg) {
                        vm.message = msg;
                    }, function(){
                    }
                );
            } 
           
        }

        deleteEvent = function(action, calEvent) {
            
            //for default sleep event deletion: it would be create a new sleep event with the start sleep time equals to end sleep time
            if(calEvent.dataType == "defaultSleep") {
                var newSleep = angular.copy(calEvent);
                var startTime = newSleep.startsAt.getTime() + 1;
                newSleep.title = 'Zero Sleep';
                newSleep.color = calendarConfig.colorTypes.warning;
                newSleep.startsAt = moment(startTime).toDate();
                newSleep.endsAt = moment(startTime).toDate();
                newSleep.actions = sleepActions;
                newSleep.dataType = 'sleep';
                newSleep.cssClass = 'zero-sleep';
                vm.events.push(newSleep);
                //console.log(newSleep);
                vm.myOnTimespanClick($scope.day);
                //vm.toggleFakeEvent($scope.day, 'add');
    
                
            }
            else {  //for other types, it would be slice the event out of the events array

                for (var i = 0; i < vm.events.length; i++) {
                    if (i == calEvent.$id) {
                        vm.events.splice(i, 1);
                    }
                }
            }

            //save events
            var data = [];
            for(var i = 0; i < vm.events.length; i++) {
                var singleEvent = null;
                if(vm.events[i].cssClass != 'fake-event-class') {
                    if(vm.events[i].dataType == 'sleep') {
                        singleEvent = {
                            tsEnd: vm.events[i].endsAt.getTime(),
                            tsStart: vm.events[i].startsAt.getTime(),
                            dataType: 'sleep'
                        }
                    }
                    else if(vm.events[i].dataType == 'caffeine') {
                        singleEvent = {
                            tsStart: vm.events[i].startsAt.getTime(),
                            dataType: 'caffeine',
                            sourceID: vm.events[i].sourceID,
                            amount: vm.events[i].amount,
                            quantity: vm.events[i].quantity,
                            source: vm.events[i].name
                        }
                    }
                }

                if(singleEvent != null) {
                    data.push(singleEvent);
                }
            }

            MyChargeDataService.setData(data, function(response){
                if(response.success) {
                    console.log('saved');
                }
            });
           
            
        }

        vm.reset= function() {
             
            if(window.confirm('Are you sure you want to reset all data to default?')) {
                vm.events = [];
                MyChargeDataService.setData([], function(response){
                    if(response.success) {
                        console.log('data erased');
                    }
                });
            }
            //vm.toggleFakeEvent($scope.day, 'add');
        };
    }
]).controller('MyChargeCalendarAddActionController', ['$rootScope', '$scope', '$uibModal', 'moment', 'calendarConfig', 'MyChargeDataService',
    'DEFAULT_PREDICTION_DAYS', 'DEFAULT_SLEEP_START', 'DEFAULT_SLEEP_DURATION', 'DEFAULT_SLEEP_END',
    function($rootScope, $scope, $uibModal, moment, calendarConfig, MyChargeDataService, DEFAULT_PREDICTION_DAYS,
             DEFAULT_SLEEP_START, DEFAULT_SLEEP_DURATION, DEFAULT_SLEEP_END){
        
            $scope.vmevents = {};
            $scope.$on('topic', function (event, arg) { 
                $scope.receiver = 'got your ' + arg;
                console.log($scope.receiver);
            });

            $scope.$on('vm.events', function(event, args){
                $scope.vmevents = args;
            });

          
            $scope.test = function() {
                     // console.log($rootScope.day);
                     //console.log($scope.vmevents.events);
                    //console.log($rootScope.MyChargeCalendarControllerScopeVar);
            }

            $scope.addSleep = function() {
                    
                    $scope.showModal('Add-Sleep', $rootScope.event);
                    
            }
             $scope.addCaffeine = function() {
                    $scope.showModal('Add-Coffee', $rootScope.event);
            }

             var sleepActions = [
            {
                label: '<i class=\'glyphicon glyphicon-remove\'></i>',
                onClick: function(args) {
                    deleteEvent('Delete-Sleep', args.calendarEvent);
                }
            },
            {
                label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
                onClick: function(args) {
                    showModal('Edit-Sleep', args.calendarEvent);
                }
            }
            ];

            var caffeineActions = [
                {
                    label: '<i class=\'glyphicon glyphicon-remove\'></i>',
                    onClick: function(args) {
                        deleteEvent('Delete-Coffee', args.calendarEvent);
                    }
                },
                {
                    label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
                    onClick: function(args) {
                        showModal('Edit-Coffee', args.calendarEvent);
                    }
                }
            ];
       


        $scope.showModal = function(action, event){
            //console.log(event);
            if(action == 'Add-Sleep') {
                var modalInstance = $uibModal.open({
                    //animation: vm.animationsEnabled,
                    windowTemplateUrl: './templates/modal/window.html',
                    templateUrl: 'sleepModal.html',
                    controller: 'MyChargeCalendarModalController',
                    backdrop: false,
                    size: 'small',
                    scope: $rootScope.MyChargeCalendarControllerScope,
                    resolve: {
                        calEvent: function(){
                            return event;
                        },
                        eventType : function(){
                            return 'sleep';
                        },
                        action: function() {
                            return action;
                        },
                        events: function() {
                            return $scope.vmevents.events;
                        },
                        actionButtons: function() {
                            return sleepActions;
                        },
                        calendarConfig: function() {
                            return calendarConfig;
                        }
                    }
                    
                });
                
            }
            else if(action == 'Add-Coffee') {
                var modalInstance = $uibModal.open({
                    //animation: vm.animationsEnabled,
                    windowTemplateUrl: './templates/modal/window.html',
                    templateUrl: 'caffeineModal.html',
                    controller: 'MyChargeCalendarModalController',
                    backdrop: false,
                    size: 'small',
                    scope: $rootScope.MyChargeCalendarControllerScope,
                    resolve: {
                        calEvent: function(){
                            //console.log(event);
                            return event;
                        },
                        eventType : function(){
                            return 'caffeine';
                        },
                        action: function() {
                            return action;
                        },
                        events: function() {
                            return $scope.vmevents.events;
                        },
                        actionButtons: function() {
                            return caffeineActions;
                        },
                        calendarConfig: function() {
                            return calendarConfig;
                        }
                    }
                });
            }

            
           
                 modalInstance.result.then(function (msg) {
                        $rootScope.vmmessage = msg;
                    }, function(){
                    }
                );
            
           
        }
            
}]);

