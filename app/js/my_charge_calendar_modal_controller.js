/**
 * Created by trieutran on 8/23/16.
 */
/**
 * Created by trieutran on 7/1/16.
 */
atoAlertnessControllers.controller('MyChargeCalendarModalController', ['$scope', '$uibModalInstance', 'calEvent', 'action',
    'eventType', 'events', 'calendarConfig', 'actionButtons', 'CaffeineService', 'MyChargeDataService', 'DEFAULT_SLEEP_END',
    'DEFAULT_SLEEP_START', 'DEFAULT_SLEEP_DURATION',
    function($scope, $uibModalInstance, calEvent, action, eventType, events, calendarConfig, actionButtons,
             CaffeineService, MyChargeDataService, DEFAULT_SLEEP_END, DEFAULT_SLEEP_START, DEFAULT_SLEEP_DURATION) {

        $scope.endOpen = false;
        $scope.startOpen = false;
        $scope.eventsChangedState = false;
        $scope.editMode = false;
        $scope.errorMessage = null;
        $scope.quantitySelected = 0;
        
      
        //SleepCalendar
        var initialCalendar = {};
        var initialDuration = {};
        var initialHour = 0;
        var initialMins = 0;
        var initalCaffeineSelected = {};
        var initialCaffeineQuantitySelected = 0;

        /**
        * create a object for duartion dropdown menu
        * @param {number} sel - The selected (or default selected) option in the dropdown menu
        */
        var makeSleepDuration = function(sel) {
            var durations = [];
            var selectedObj = {
                ts: 900000,     //default to 15 mins
                txt: "0 hr 15 min"
            };

            for (var i = 0; i < 24; i++) {
                for(var j = 0; j < 4; j++){
                    var ts = i * 60 * 60 * 1000 + j * 15 * 60 * 1000;
                    var ele = {
                        ts: ts,
                        txt: i + ' hr ' + j * 15 + ' min'
                    };

                    if(ts == sel) {
                        selectedObj = ele;
                    }
                    
                    if(ts > 0) {
                        durations.push(ele);
                    }
                }
            }

            return {
                durations: durations,
                selected: selectedObj
            };
        }

        var durationObj = makeSleepDuration(calEvent.endsAt - calEvent.startsAt);
        $scope.sleepDurations = durationObj.durations;
        $scope.durationSelected = durationObj.selected;

        switch (action) {
            case 'Edit-Sleep':
                $scope.modalTitle = 'Edit Sleep';
                $scope.editMode = true;
                $scope.$watch('sleepForm.$pristine', function() {
                    try {
                        if (!($scope.sleepForm.$dirty)){
                            //set default calendar values
                            initialDuration = $scope.durationSelected;
                            initialCalendar = calEvent.startsAt;
                            initialHour = parseInt($scope.oldStartsAt.toString().slice(15,18), 10);
                            initialMins = parseInt($scope.oldStartsAt.toString().slice(19,21), 10);
                        }
                    }
                    catch(err) {
                        console.log(err);
                    }
                });
                break;

            case 'Add-Sleep':
                $scope.modalTitle = 'Add Sleep';
                calEvent.dataType = 'sleep';
                calEvent.startsAt = moment(calEvent.startsAt).startOf('day').add(23, 'hours').toDate();
                calEvent.endsAt = moment(calEvent.startsAt).startOf('day').add(1, 'days').add(DEFAULT_SLEEP_END, 'hours').toDate();
                $scope.$watch('sleepForm.$pristine', function() {
                    try {
                        if (!($scope.sleepForm.$dirty)){
                            //set default calendar values
                            initialDuration = $scope.durationSelected;
                            initialCalendar = calEvent.startsAt;
                            initialHour = parseInt($scope.oldStartsAt.toString().slice(15,18), 10);
                            initialMins = parseInt($scope.oldStartsAt.toString().slice(19,21), 10);
                        }
                    }
                    catch(err) {
                        console.log(err);
                    }
                  
                });
                break;

            case 'Edit-Coffee':
                $scope.modalTitle = 'Edit Caffeine Drink';
                $scope.editMode = true;
                $scope.$watch('caffeineForm.$pristine', function() {
                    try {
                        if (!($scope.caffeineForm.$dirty)){
                            initalCaffeineSelected = $scope.caffeineSelected;
                            initialCaffeineQuantitySelected = $scope.quantitySelected;
                            initialCalendar = calEvent.startsAt;
                            initialHour = parseInt($scope.oldStartsAt.toString().slice(15,18), 10);
                            initialMins = parseInt($scope.oldStartsAt.toString().slice(19,21), 10);
                        }
                    }
                    catch(err) {
                        console.log(err);
                    }
                });
                break;

            case 'Add-Coffee':
                $scope.modalTitle = 'Add Caffeine Drink';
                calEvent.dataType = 'caffeine';
                calEvent.startsAt = moment(calEvent.startsAt).startOf('day').toDate();
                $scope.$watch('caffeineForm.$pristine', function() {
                   try {
                        if (!($scope.caffeineForm.$dirty)){
                            initalCaffeineSelected = $scope.caffeineSelected;
                            initialCaffeineQuantitySelected = $scope.quantitySelected;
                            initialCalendar = calEvent.startsAt;
                            initialHour = parseInt($scope.oldStartsAt.toString().slice(15,18), 10);
                            initialMins = parseInt($scope.oldStartsAt.toString().slice(19,21), 10);
                        
                        }
                    }
                    catch(err) {
                        console.log(err);
                    }
                });
                break;
        }

        $scope.calEvent = calEvent;
        //console.log($scope.calEvent);

        if(eventType == 'caffeine'){
            console.log('caffeine');
            $scope.caffeineItems = CaffeineService.getData();

            $scope.quantity = [];
            for(var i = 1; i <= 10; i++) {
                $scope.quantity.push(i);
            }

            $scope.quantitySelected = 0;

            if(angular.isNumber(calEvent.sourceID)) {
                $scope.caffeineSelected = CaffeineService.getItem(calEvent.sourceID);
               //console.log($scope.caffeineSelected);
            }
            else{
                $scope.caffeineSelected = $scope.caffeineItems[0];
            }

            if(angular.isNumber(calEvent.quantity)) {
                $scope.quantitySelected = calEvent.quantity;
                //console.log($scope.quantitySelected);
            }

            $scope.oldStartsAt = calEvent.startsAt;
            console.log($scope.oldStartsAt );
        }
        else if(eventType == 'sleep' || eventType == 'defaultSleep') {
            //console.log('hi');
            $scope.oldStartsAt = calEvent.startsAt;
            //$scope.oldDuration = calEvent.endsAt;
            //console.log($scope.calEvent);
        }

        $scope.cancel = function () {

            if(eventType == 'sleep') {
                calEvent.startsAt = $scope.oldStartsAt;
                //calEvent.endsAt = $scope.oldEndsAt;
            }
            else if(eventType == 'caffeine') {
                calEvent.startsAt = $scope.oldStartsAt;
            }

            $uibModalInstance.dismiss('cancel');
        };

        /**
         *  set and unset flag
         *  @param $event - $event javascript object
         *  @param field - name of the flag
         */

        $scope.toggle = function($event, field){
            $event.preventDefault();
            $event.stopPropagation();
            $scope[field] = !$scope[field];

        };

        /**
         *  ok button click event handler
         *  depending on the dataType of an event, a validation function will be called
         *  and if data is valid, the scope level flag $scope.eventsChangedState is set to true
         *
         */
       $scope.ok = function(formObject){

            switch (calEvent.dataType) {
            case 'defaultSleep':
                

                if (!(formObject.$pristine)) {
                    var validation = $scope.validateSleep(calEvent);
                    if(validation.ok) {
                        console.log('validated');
                        var sleepObj = {
                            color: calendarConfig.colorTypes.warning,
                            startsAt: calEvent.startsAt,
                            endsAt: moment(calEvent.startsAt).add($scope.durationSelected.ts, 'ms').toDate(),
                            draggable: false,
                            resizable: false,
                            incrementsBadgeTotal: false,
                            allDay: false,
                            actions: actionButtons,
                            dataType: 'sleep'
                        };
                        sleepObj.title = (sleepObj.startsAt.getTime() != sleepObj.endsAt.getTime()) ? 'Sleep' : 'Zero Sleep';
                        sleepObj.cssClass= (sleepObj.startsAt.getTime() != sleepObj.endsAt.getTime()) ? 'has-sleep' : 'zero-sleep';;
                        $scope.vm.events.push(sleepObj);
                        $scope.eventsChangedState = true;
                        $uibModalInstance.close("Event Closed");
                        $scope.updateEvent();
                    }
                    else {
                         console.log('Failed Validation');
                         $scope.resetForm('sleepForm');
                        //display message somewhere
                        $scope.errorMessage = validation.message;
                    }
                } 
                break;
            case 'sleep' :
         
                if (!(formObject.$pristine)) {
                    var validation = $scope.validateSleep(calEvent);
                    if(validation.ok) {
                        console.log('validated');
                        if($scope.editMode) {
                            calEvent.endsAt = moment(calEvent.startsAt).add($scope.durationSelected.ts, 'ms').toDate();
                            calEvent.title = (calEvent.startsAt.getTime() != calEvent.endsAt.getTime()) ? 'Sleep' : 'Zero Sleep';
                            calEvent.cssClass = (calEvent.startsAt.getTime() != calEvent.endsAt.getTime()) ? 'has-sleep' : 'zero-sleep';
                            //console.log(calEvent);
                        }
                        else {
                            var sleepObj = {
                                color: calendarConfig.colorTypes.warning,
                                startsAt: calEvent.startsAt,
                                endsAt: moment(calEvent.startsAt).add($scope.durationSelected.ts, 'ms').toDate(),
                                draggable: false,
                                resizable: false,
                                incrementsBadgeTotal: false,
                                allDay: false,
                                actions: actionButtons,
                                dataType: 'sleep'
                            };
                            sleepObj.title = (sleepObj.startsAt.getTime() != sleepObj.endsAt.getTime()) ? 'Sleep' : 'Zero Sleep';
                            sleepObj.cssClass = (sleepObj.startsAt.getTime() != sleepObj.endsAt.getTime()) ? 'has-sleep' : 'zero-sleep';
                            $scope.vm.events.push(sleepObj);
                        }

                        $scope.eventsChangedState = true;
                        $uibModalInstance.close("Event Closed");
                        $scope.updateEvent();
                    }
                    else {
                         console.log('Failed Validation');
                         $scope.resetForm('sleepForm');
                        //display message somewhere
                        $scope.errorMessage = validation.message;
                    }
                } 
                break;

            case 'caffeine':
                if (!(formObject.$pristine)) {
                    var validation = $scope.validateCaffeine(calEvent);

                        if(validation.ok) {
                            console.log('validated');
                            if(!$scope.editMode) {
                            //remove old event
                            //$scope.vm.events.splice(calEvent.$id, 1);
                            var cloneEvent = {};
                            cloneEvent.startsAt = $scope.calEvent.startsAt;
                            cloneEvent.draggable = false;
                            cloneEvent.resizable = false;
                            cloneEvent.incrementsBadgeTotal = false;
                            cloneEvent.allDay = false;
                            cloneEvent.title = 'Caffeine';
                            cloneEvent.color = calendarConfig.colorTypes.info;
                            cloneEvent.sourceID = $scope.caffeineSelected.id;
                            cloneEvent.source = $scope.caffeineSelected.itemName;
                            cloneEvent.amount = parseInt($scope.caffeineSelected.value) * $scope.quantitySelected;
                            cloneEvent.quantity = $scope.quantitySelected;
                            cloneEvent.actions = actionButtons;
                            cloneEvent.dataType = 'caffeine';
                            //console.log(cloneEvent);
                            $scope.vm.events.push(cloneEvent);
                        }
                        $scope.eventsChangedState = true;
                        $uibModalInstance.close("Event Closed");
                        $scope.updateEvent();
                    }
                    else {
                         console.log('Failed Validation');
                         $scope.resetForm('caffeineForm');
                        //display message somewhere
                        $scope.errorMessage = validation.message;
                    }
                } 
                break;
            }


        }

       $scope.updateEvent = function(){ 
            console.log('save now');
            var data = [];

            for(var i = 0; i < $scope.vm.events.length; i++) {
                var singleEvent = null;
                if($scope.vm.events[i].cssClass != 'fake-event-class') {

                    var tsStart = $scope.vm.events[i].startsAt.getTime();
                    if( tsStart % 1000 == 0) {  //make sure timestamp always start at plus 1 millisecond
                        tsStart ++;
                    }

                    if($scope.vm.events[i].dataType == 'sleep') {
                        //alert(calEvent.startsAt);
                        var tsEnd = $scope.vm.events[i].endsAt.getTime();
                        if( tsEnd % 1000 == 0) {    //make sure timestamp always start at plus 1 millisecond
                            tsEnd ++;
                        }
                        singleEvent = {
                            tsEnd: tsEnd,
                            endTime: $scope.vm.events[i].endsAt,
                            tsStart: tsStart,
                            startTime: $scope.vm.events[i].startsAt,
                            dataType: 'sleep',
                
                        }
                    }
                    else if($scope.vm.events[i].dataType == 'caffeine') {
                        singleEvent = {
                            tsStart: tsStart,
                            dataType: 'caffeine',
                            sourceID: $scope.vm.events[i].sourceID,
                            amount: $scope.vm.events[i].amount,
                            quantity: $scope.vm.events[i].quantity,
                            source: CaffeineService.getItem($scope.vm.events[i].sourceID).itemName,
                    
                        }
                    }
                }
                
                if(singleEvent != null) {
                    data.push(singleEvent); 
                }
            }

            MyChargeDataService.setData(data, function(response){
                //console.log(response);
                if(response.success) {
                    console.log('saved');
                } 
            });
       }

          /**
         * validating a sleep event
         * @param {object} cEvent - a calendar event
         * validation rules:
         *  - not overlaps with any other sleep events, ie.
         *      + start time must not in any sleep event's ending and start time
         *      + end time must not in any sleep event start and end time
         * */

        $scope.validateSleep = function(cEvent){
            console.log('validate sleep');
            var output = {
                ok: true
            };
        
            cEvent.endsAt = moment(cEvent.startsAt).add($scope.durationSelected.ts, 'ms').toDate();
          
       
             var checkDefaultSleepExist = $scope.checkDefaultSleepExist(cEvent);
                if(checkDefaultSleepExist.ok) { 
                    //there's a default sleep
                    console.log('theres a default sleep');
                } else {
                    console.log('theres no default sleep');
                }


            for(var i = 0; i < $scope.vm.events.length; i++) {
                var sleepEvt = $scope.vm.events[i];
                if(sleepEvt.$id != cEvent.$id) {
                    //console.log(sleepEvt.startsAt); 
                    //console.log(sleepEvt.endsAt); 
                       
                        console.log('End test'); 
                    if((cEvent.startsAt >= sleepEvt.startsAt && cEvent.startsAt <= sleepEvt.endsAt)
                    || (cEvent.endsAt >= sleepEvt.startsAt && cEvent.endsAt <= sleepEvt.endsAt)) {
                        output.message = "Conflict with an existing sleep event";
                        output.ok = false;
                        break;
                    }
                }
            }

            //validate against caffeine vents
            if(output.ok) {
                var caffeineEvents = [];
                for(var i = 0; i < $scope.vm.events.length; i++) {
                    if($scope.vm.events[i].dataType == 'caffeine'
                        && ($scope.vm.events[i].startsAt >= cEvent.startsAt  && $scope.vm.events[i].startsAt <= cEvent.endsAt)) {
                        output.message = "Conflict with an existing caffeine event";
                        output.ok = false;
                        break;
                    }
                }
            }

            return output;
        }
        
         $scope.checkDefaultSleepExist = function (cEvent) {

             var lastDaySleepEnd = zeroHour + DEFAULT_SLEEP_END * 60 * 60 * 1000;
             var zeroHour = moment(cEvent.startsAt).startOf('day').toDate().getTime();
             var lastDaySleepStart = lastDaySleepEnd - DEFAULT_SLEEP_DURATION * 60 * 60 * 1000;
             var startSleepHour = zeroHour + DEFAULT_SLEEP_START * 60 * 60 * 1000 + 1; 
             var endOfDay = zeroHour + 24 * 60 * 60 * 1000;
             var nextDaySleepEnd = startSleepHour + DEFAULT_SLEEP_DURATION * 60 * 60 * 1000;
           
            
            var output = {
                ok: true
            };

            MyChargeDataService.getData(function(response){
                if(response.success == "true") {
                    var myChargeEvents = response.data;
                    console.log(response.data);
                    for(var i = 0; i < myChargeEvents.length; i++){
                        if(myChargeEvents[i].dataType == 'sleep'){
                            console.log("found sleep");
                            console.log(startSleepHour);
                            console.log(myChargeEvents[i].tsStart);
                            if((startSleepHour == myChargeEvents[i].tsStart) && ( myChargeEvents[i].tsEnd == myChargeEvents[i].tsStart)){
                              //Default is Removed
                                  output.ok =  false;
                            } else {
                                output.ok =  true;
                            }
                       
                          
                        }
                       
                    } 
                }
               });

               return output;
          }


        $scope.resetForm = function (StrformName) {
             switch (StrformName) {
                case 'sleepForm':
                    calEvent.startsAt = moment(initialCalendar).startOf('day').add(initialHour, 'hours').toDate();
                    $scope.durationSelected = initialDuration; 
                    $scope.sleepForm.$setPristine();
                    break;
                case 'caffeineForm':
                    calEvent.startsAt = moment(initialCalendar).startOf('day').add(initialHour, 'hours').toDate();
                    $scope.durationSelected = initialDuration; 
                    $scope.caffeineForm.$setPristine();
                    $scope.caffeineSelected = initalCaffeineSelected;
                    $scope.quantitySelected = initialCaffeineQuantitySelected;
                    break;
             }
        }; 

        /**
         * validating a caffeine drink event
         * @param {object} cEvent - a calendar event
         * validation rules:
         *  - "quantity" must be selected and not 0
         *  - the start time of the caffeine event can neither overlap with existing sleep events
         *    nor overlap with a default sleep event
        * */
        $scope.validateCaffeine = function(cEvent) {
            console.log('validate caffeine');
            if(!angular.isNumber($scope.quantitySelected)){
                return {
                    message: "Please select Quantity",
                    ok: false
                };
            }
            else if($scope.quantitySelected == 0) {
                return {
                    message: "Please select Quantity",
                    ok: false
                };
            }
            else {
                var output = {
                    ok: true
                };

                var zeroHour = moment(cEvent.startsAt).startOf('day').toDate().getTime();
                var lastDaySleepEnd = zeroHour + DEFAULT_SLEEP_END * 60 * 60 * 1000;
                var lastDaySleepStart = lastDaySleepEnd - DEFAULT_SLEEP_DURATION * 60 * 60 * 1000;
                var startSleepHour = zeroHour + DEFAULT_SLEEP_START * 60 * 60 * 1000;
                var nextDaySleepEnd = startSleepHour + DEFAULT_SLEEP_DURATION * 60 * 60 * 1000;
                var endOfDay = zeroHour + 24 * 60 * 60 * 1000;


                //get an array of sleep events within time range of the caffeine event occurs only
                var sleepEvents = [];
                //console.log($scope.vm.events);
                for(var i = 0; i < $scope.vm.events.length; i++) {
                    if($scope.vm.events[i].dataType == 'sleep' && $scope.vm.events[i].cssClass != 'fake-event-class'
                        && (($scope.vm.events[i].startsAt.getTime() <= zeroHour && $scope.vm.events[i].endsAt.getTime() >= zeroHour)
                        || ($scope.vm.events[i].startsAt.getTime() <= endOfDay && $scope.vm.events[i].endsAt.getTime() >= endOfDay)
                        || ($scope.vm.events[i].startsAt.getTime() >= zeroHour && $scope.vm.events[i].endsAt.getTime() <= endOfDay))) {
                        sleepEvents.push($scope.vm.events[i]);
                    }
                }

                //console.log(sleepEvents);
                var ignoreStartDefault = false;
                var ignoreEndDefault = false;
                //if it is no sleep event within the time range, validate the caffeine against the default sleep time
                if(sleepEvents.length == 0) {
                    if((cEvent.startsAt.getTime() > lastDaySleepStart && cEvent.startsAt.getTime() < lastDaySleepEnd)
                    || (cEvent.startsAt.getTime() > startSleepHour && cEvent.startsAt.getTime() < endOfDay)){
                        output.message = " Conflict with an existing default sleep event 1";
                        output.ok = false;
                    }
                }
                else {
                    for(var j = 0; j < sleepEvents.length; j++) {
                        if(sleepEvents[j].startsAt.getTime() == sleepEvents[j].endsAt.getTime()) {
                            if(cEvent.startsAt.getTime() == startSleepHour) {
                                ignoreStartDefault = true;
                            }
                            else if(cEvent.startsAt.getTime() == lastDaySleepEnd) {
                                ignoreEndDefault = true;
                            }
                        }
                        else {
                            if(cEvent.startsAt.getTime() > sleepEvents[j].startsAt.getTime() && cEvent.startsAt.getTime() < sleepEvents[j].endsAt.getTime()) {
                                output.message = "Conflict with an existing sleep event";
                                output.ok = false;
                                break;
                            }
                        }
                    }

                    //run another checking with previous day default sleep event
                    if(output.ok) {
                        if(!ignoreEndDefault) {
                            if(cEvent.startsAt.getTime() > zeroHour && cEvent.startsAt.getTime() < lastDaySleepEnd) {
                                output.message = " Conflict with an existing default sleep event ending";
                                output.ok = false;
                            }
                        }
                        else if(!ignoreStartDefault) {
                            if(cEvent.startsAt.getTime() > startSleepHour && cEvent.startsAt.getTime() < endOfDay) {
                                output.message = " Conflict with an existing default sleep event starting";
                                output.ok = false;
                            }
                        }

                        /*if((cEvent.startsAt.getTime() > zeroHour && cEvent.startsAt.getTime() < lastDaySleepEnd)
                            || (cEvent.startsAt.getTime() > startSleepHour && cEvent.startsAt.getTime() < endOfDay)){
                            output.message = " Conflict with an existing default sleep event 2";
                            output.ok = false;
                        }*/
                    }
                }

                return output;
            }


        };

      

      
    }
]);
