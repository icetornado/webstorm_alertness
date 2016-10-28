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
        var initialDurationReset = {};
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
                //console.log(moment(initialDuration).toDate());
                 //console.log(moment($scope.sleepForm.duration).toDate());
             // console.log(moment($scope.oldEndsAt).toDate());
              // console.log(moment(calEvent.endsAt).toDate()); //first open in edit mode and untouched the same;
               //console.log(moment(initialDurationReset).toDate());
                $scope.$watch('sleepForm.$pristine', function() {
                    try {
                        //console.log(moment($scope.sleepForm.timepicker.$modelValue).toDate());
                        if (!($scope.sleepForm.$dirty)){
                            //set default calendar values
                            initialDuration = calEvent.endsAt;
                            initialDurationReset = $scope.durationSelected;
                            initialCalendar = calEvent.startsAt;
                            initialHour = parseInt($scope.oldStartsAt.toString().slice(15,18), 10);
                            initialMins = parseInt($scope.oldStartsAt.toString().slice(19,21), 10);
                        }
                    }
                    catch(err) {
                        console.log(err);
                    }
                }); 

               
                 //console.log(moment(initialDuration).toDate());
                 //console.log(moment($scope.sleepForm.duration).toDate());
              //console.log(moment($scope.oldEndsAt).toDate());
               //console.log(moment(calEvent.endsAt).toDate()); //first open in edit mode and untouched the same;
               //console.log(moment(initialDurationReset).toDate());
                //console.log(initialCalendar);
                
                //console.log(moment(initialCalendar).toDate().getTime());
                //console.log(initialDuration);
                //console.log(moment(initialDuration).toDate().getTime());
                //console.log(Object.keys(initialCalendar).length);
                //calEvent.startsAt = initialCalendar;
               // calEvent.endsAt = initialDuration;
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
           // console.log(moment(initialDuration).toDate());
              //console.log(moment($scope.oldEndsAt).toDate());
               //console.log(moment(calEvent.endsAt).toDate());
               //console.log(moment(initialDurationReset).toDate());
                calEvent.startsAt = initialCalendar;
               calEvent.endsAt = initialDuration;
               initialDurationReset = {};
                initialDuration = {};
                            //initialDuration = $scope.durationSelected;
                            //initialCalendar = calEvent.startsAt;
                //calEvent.endsAt = $scope.oldEndsAt;
               // calEvent.startsAt = calEvent.startsAt;
               // calEvent.endsAt =  $scope.oldEndsAt;
              // console.log(moment(initialDuration).toDate());
              // console.log(moment($scope.oldEndsAt).toDate());
               //console.log(moment(calEvent.endsAt).toDate());
               //console.log(moment(initialDurationReset).toDate());
            }
            else if(eventType == 'caffeine') {
                //calEvent.startsAt = $scope.oldStartsAt;
                calEvent.startsAt = initialCalendar;
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
                

                //if (!(formObject.$pristine)) {
                    var validation = $scope.validateDefaultSleep(calEvent);
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

                        var zeroHour = moment(calEvent.startsAt).startOf('day').toDate().getTime();
                        var startSleepHour = zeroHour + DEFAULT_SLEEP_START * 60 * 60 * 1000;
                            startSleepHour = moment(startSleepHour).toDate();
                            console.log(startSleepHour);
                        var defaultSleep = {
                            title: 'Zero Sleep',
                            color: calendarConfig.colorTypes.warning,
                            startsAt: startSleepHour,
                            endsAt: startSleepHour,
                            draggable: false,
                            resizable: false,
                            incrementsBadgeTotal: false,
                            allDay: false,
                            actions: actionButtons,
                            dataType: 'sleep',
                            cssClass: 'zero-sleep'
                        }

                        $scope.vm.events.push(defaultSleep);

                        $scope.eventsChangedState = true;
                        $uibModalInstance.close("Event Closed");
                        $scope.updateEvent();
                    }
                    else {
                         console.log('Failed Validation');
                         
                        //display message somewhere
                        $scope.errorMessage = validation.message;
                        $scope.resetForm('sleepForm');
                    }
                
                break;
            case 'sleep' :
         
              
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
                        
                        //display message somewhere
                        $scope.errorMessage = validation.message;
                         $scope.resetForm('sleepForm');
                    }
            
                break;

            case 'caffeine':
               
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
                         
                        //display message somewhere
                        $scope.errorMessage = validation.message;
                        $scope.resetForm('caffeineForm');
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
                        
                        var tsEnd = moment($scope.vm.events[i].endsAt).toDate().getTime();
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
       

        $scope.validateDefaultSleep = function(cEvent){
           
            console.log('validate sleep');
            var output = {
                ok: true,
                message: ''
            };

            cEvent.endsAt = moment(cEvent.startsAt).add($scope.durationSelected.ts, 'ms').toDate();
            var zeroHour = moment(cEvent.startsAt).startOf('day').toDate().getTime();
            var lastDaySleepEnd = zeroHour + DEFAULT_SLEEP_END * 60 * 60 * 1000;
            var lastDaySleepStart = lastDaySleepEnd - DEFAULT_SLEEP_DURATION * 60 * 60 * 1000;
            var startSleepHour = zeroHour + DEFAULT_SLEEP_START * 60 * 60 * 1000;
            var nextDaySleepEnd = startSleepHour + DEFAULT_SLEEP_DURATION * 60 * 60 * 1000;
            var endOfDay = zeroHour + 24 * 60 * 60 * 1000;
            var allSleepInLocalstorage = [];
            var allCaffeineinLocalStorage = [];
            var allSleepInLocalstorageInRange = [];
            var allCaffeineinLocalStorageInRange = [];
            var defaultSevenAmExist = true;
            var defaultElevenPmExist = false;
            var defaultTempTomorrowSleepTime = true;
            var yesterdaysSleepTime = zeroHour - 3600000;
            var tomorrowMidnight = zeroHour + (3600000 * 48) - 1;
            var tomorrowSleepTime = nextDaySleepEnd + (3600000 * 16);
            var userInputStartTime = cEvent.startsAt.getTime() + 1;
            var userInputEndTime = cEvent.endsAt.getTime() + 1;
            
            

            

            //console.log(lastDaySleepEnd);
            //console.log(endOfDay);
            /*
            console.log('test');
            console.log(moment(zeroHour).toDate()); //Mon Oct 24 2016 00:00:00 GMT-0400 (EDT) - the same as cEvent).toDate() - midnight start
            console.log(moment(lastDaySleepEnd).toDate()); //Mon Oct 24 2016 07:00:00 GMT-0400 (EDT)
            console.log(moment(startSleepHour).toDate()); //Mon Oct 24 2016 23:00:00 GMT-0400 (EDT)
            console.log(moment(endOfDay).toDate()); //Oct 25 2016 00:00:00 GMT-0400 (EDT)
            console.log(moment(nextDaySleepEnd).toDate()); //Tue Oct 25 2016 07:00:00 GMT-0400 (EDT)
            console.log('End test');

            //user selected
            //console.log(moment(cEvent.startsAt).toDate()); //Mon Oct 24 2016 22:00:00 GMT-0400 (EDT) - user selected
            //console.log(moment(cEvent.endsAt).toDate()); //Mon Oct 24 2016 22:15:00 GMT-0400 (EDT) - user selected
            console.log(startSleepHour +  1 ); //1477364400001
            console.log(moment(1477364400001).toDate()); //Mon Oct 24 2016 23:00:00 GMT-0400 (EDT)
            console.log(nextDaySleepEnd + 1); //1477393200001
            console.log(moment(1477393200001).toDate()); //Tue Oct 25 2016 07:00:00 GMT-0400 (EDT)
            */

            MyChargeDataService.getData(function(response){
                if(response.success == "true") {
                    var myChargeEvents = response.data;
                    console.log(response.data);
                    for(var i = 0; i < myChargeEvents.length; i++){
                        if(myChargeEvents[i].dataType == 'sleep'){
                            allSleepInLocalstorage.push(myChargeEvents[i].tsStart);
                            allSleepInLocalstorage.push(myChargeEvents[i].tsEnd);
                        } else if  (myChargeEvents[i].dataType == 'caffeine'){
                            allCaffeineinLocalStorage.push(myChargeEvents[i].tsStart);
                        }
                    } 
                }
            });

     
            allSleepInLocalstorage.forEach(function(entry, i){
                if ($scope.between(entry, yesterdaysSleepTime, tomorrowMidnight)){
                    allSleepInLocalstorageInRange.push(entry);
                } 
            });
         

            allCaffeineinLocalStorage.forEach(function(entry, i){
                if ($scope.between(entry, yesterdaysSleepTime, tomorrowMidnight)){
                    allCaffeineinLocalStorageInRange.push(entry);
                } 
            });

            allSleepInLocalstorage.forEach(function(entry, i){
                if(i % 2 == 0){
                    if ((allSleepInLocalstorage[i] == (tomorrowSleepTime + 1)) && (allSleepInLocalstorage[i+1] == (tomorrowSleepTime + 1))){
                        defaultTempTomorrowSleepTime = false;
                    }
                }
            });

            allSleepInLocalstorage.forEach(function(entry, i){
                if(i % 2 == 0){
                    if ((allSleepInLocalstorage[i] == (yesterdaysSleepTime + 1)) && (allSleepInLocalstorage[i+1] == (yesterdaysSleepTime + 1))){
                        defaultSevenAmExist = false;
                    }
                }
            });

           

            if (defaultSevenAmExist) {
                allSleepInLocalstorageInRange.push(yesterdaysSleepTime);
                allSleepInLocalstorageInRange.push(lastDaySleepEnd);
            }

            if (defaultElevenPmExist){
                allSleepInLocalstorageInRange.push(startSleepHour);
                allSleepInLocalstorageInRange.push(nextDaySleepEnd);
            }

            if (defaultTempTomorrowSleepTime){
                allSleepInLocalstorageInRange.push(tomorrowSleepTime);
                allSleepInLocalstorageInRange.push(tomorrowMidnight);
            }

            allSleepInLocalstorageInRange.sort();
            allCaffeineinLocalStorageInRange.sort();

            allSleepInLocalstorageInRange.forEach(function(entry, i){  
                 if(i % 2 == 0){ 
                     if(allSleepInLocalstorageInRange[i] == allSleepInLocalstorageInRange[i+1]){
                            allSleepInLocalstorageInRange.splice(i, 1);
                            allSleepInLocalstorageInRange.splice(i, 1);
                     }
                 }
             });
             
            //var editModeStartTime = moment(initialCalendar).toDate().getTime() + 1;
            //var editModeEndTime = moment(initialCalendar).add(initialDuration.ts, 'ms').toDate().getTime() + 1;
            allSleepInLocalstorageInRange.forEach(function(entry, i){ 
                
                    if(i % 2 == 0){
                        if(($scope.between(userInputStartTime, allSleepInLocalstorageInRange[i], allSleepInLocalstorageInRange[i+1])) || 
                            ($scope.between(userInputEndTime, allSleepInLocalstorageInRange[i], allSleepInLocalstorageInRange[i+1]))){
                            //console.log('true ' + userInputStartTime + ' is in between ' + allSleepInLocalstorageInRange[i] + ' & ' + allSleepInLocalstorageInRange[i+1]);
                            //console.log('true ' + userInputEndTime + ' is in between ' + allSleepInLocalstorageInRange[i] + ' & ' + allSleepInLocalstorageInRange[i+1]);
                            if(defaultSevenAmExist){
                                    if(($scope.between(userInputStartTime, yesterdaysSleepTime, lastDaySleepEnd )) ||
                                            ($scope.between(userInputEndTime, yesterdaysSleepTime, lastDaySleepEnd ))){
                                                output.ok = false;
                                                output.message = "Conflict With Yesterday's Default Sleep Time";
                                        }
                                    
                            } 
                            if (defaultElevenPmExist) { 
                                        if(($scope.between(userInputStartTime, startSleepHour, nextDaySleepEnd )) ||
                                            ($scope.between(userInputEndTime, startSleepHour, nextDaySleepEnd ))){
                                                output.ok = false;
                                                output.message = "Conflict With Today's Default Sleep Time";
                                        }
                                            
                            } 
                            if(defaultTempTomorrowSleepTime){
                                    if($scope.between(userInputEndTime, tomorrowSleepTime, tomorrowMidnight )){
                                                output.ok = false;
                                                output.message = "Conflict With Tomorrow's Sleep Time";
                                        }
                            }

                             if (output.ok) {
                                if (!((allSleepInLocalstorageInRange[i] == moment(initialCalendar).toDate().getTime() ) && (allSleepInLocalstorageInRange[i+1] == moment(initialDuration).toDate().getTime()))){
                                        output.ok = false;
                                        output.message = "Conflict With existing Sleep Time";
                                }
                            }
                        } 

                        if (output.ok) {
                            if(($scope.between(allSleepInLocalstorageInRange[i], userInputStartTime, userInputEndTime)) &&
                                        ($scope.between(allSleepInLocalstorageInRange[i+1], userInputStartTime, userInputEndTime)) ){
                                            output.ok = false;
                                            // console.log("Conflict With existing Sleep Time");
                                            output.message = "Conflict With existing Sleep Time";
                            }
                        }
                    }
           }); 

            if (output.ok){ 
                    if ((!($scope.editMode)) || ($scope.editMode)){ 
                        if(defaultSevenAmExist){
                                if(($scope.between(userInputStartTime, yesterdaysSleepTime, lastDaySleepEnd )) ||
                                        ($scope.between(userInputEndTime, yesterdaysSleepTime, lastDaySleepEnd ))){
                                            output.ok = false;
                                            output.message = "Conflict With Yesterday's Default Sleep Time";
                                    }
                                
                            } 
                            if (defaultElevenPmExist) { 
                                    if(($scope.between(userInputStartTime, startSleepHour, nextDaySleepEnd )) ||
                                        ($scope.between(userInputEndTime, startSleepHour, nextDaySleepEnd ))){
                                            output.ok = false;
                                            output.message = "Conflict With Today's Default Sleep Time  wert";
                                    }
                                        
                            }
                            if(defaultTempTomorrowSleepTime){
                                if($scope.between(userInputEndTime, tomorrowSleepTime, tomorrowMidnight )){
                                    output.ok = false;
                                    output.message = "Conflict With Tomorrow's Sleep Time";
                                }
                            }
                    } 
            }

            if (output.ok) {
                 allCaffeineinLocalStorageInRange.forEach(function(entry, i){
                     if (entry == userInputStartTime) {
                         output.ok = false;
                         console.log('drinking coffee'); 
                         output.message = "Conflict With a Caffeine Event";
                     } 
                 });
            }

            if (output.ok) {
                 allCaffeineinLocalStorageInRange.forEach(function(entry, i){ 
                     if (entry == userInputEndTime) {
                         output.ok = false;
                         console.log('drinking coffee'); 
                         output.message = "Conflict With a Caffeine Event";
                     } 
                 });
            }
          
             if (output.ok){ 
                if ((!($scope.editMode)) || ($scope.editMode)){ 
                    if ((userInputEndTime >= (tomorrowSleepTime - 1) ) && (defaultTempTomorrowSleepTime)){ 
                          output.ok = false;
                        output.message = "Conflict With Tomorrow's Sleep Time";
                    }
                }
            }
            
            if (output.ok){ 
                    if (!($scope.sleepForm.$dirty)){
                            var editDefaultStartTime = moment(initialCalendar).toDate().getTime();
                            var editDefaultEndTime = moment(initialCalendar).add(initialDuration.ts, 'ms').toDate().getTime();
                            if ((editDefaultStartTime == startSleepHour) && (editDefaultEndTime = nextDaySleepEnd)){
                                output.ok = false;
                            }
                    }
                }
           
            return output;
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
                ok: true,
                message: ''
            };

            cEvent.endsAt = moment(cEvent.startsAt).add($scope.durationSelected.ts, 'ms').toDate();
            var zeroHour = moment(cEvent.startsAt).startOf('day').toDate().getTime();
            var lastDaySleepEnd = zeroHour + DEFAULT_SLEEP_END * 60 * 60 * 1000;
            var lastDaySleepStart = lastDaySleepEnd - DEFAULT_SLEEP_DURATION * 60 * 60 * 1000;
            var startSleepHour = zeroHour + DEFAULT_SLEEP_START * 60 * 60 * 1000;
            var nextDaySleepEnd = startSleepHour + DEFAULT_SLEEP_DURATION * 60 * 60 * 1000;
            var endOfDay = zeroHour + 24 * 60 * 60 * 1000;
            var allSleepInLocalstorage = [];
            var allCaffeineinLocalStorage = [];
            var allSleepInLocalstorageInRange = [];
            var allCaffeineinLocalStorageInRange = [];
            var defaultSevenAmExist = true;
            var defaultElevenPmExist = true;
            var defaultTempTomorrowSleepTime = true;
            var yesterdaysSleepTime = zeroHour - 3600000;
            var tomorrowMidnight = zeroHour + (3600000 * 48) - 1;
            var tomorrowSleepTime = nextDaySleepEnd + (3600000 * 16);
            var userInputStartTime = cEvent.startsAt.getTime() + 1;
            var userInputEndTime = cEvent.endsAt.getTime() + 1;
            
            //console.log(lastDaySleepEnd);
            //console.log(endOfDay);
            /*
            console.log('test');
            console.log(moment(yesterdaysSleepTime).toDate());
            console.log(moment(zeroHour).toDate()); //Mon Oct 24 2016 00:00:00 GMT-0400 (EDT) - the same as cEvent).toDate() - midnight start
            console.log(moment(lastDaySleepEnd).toDate()); //Mon Oct 24 2016 07:00:00 GMT-0400 (EDT)
            console.log(moment(startSleepHour).toDate()); //Mon Oct 24 2016 23:00:00 GMT-0400 (EDT)
            console.log(moment(endOfDay).toDate()); //Oct 25 2016 00:00:00 GMT-0400 (EDT)
            console.log(moment(nextDaySleepEnd).toDate()); //Tue Oct 25 2016 07:00:00 GMT-0400 (EDT)
            console.log('End test');

            //user selected
            //console.log(moment(cEvent.startsAt).toDate()); //Mon Oct 24 2016 22:00:00 GMT-0400 (EDT) - user selected
            //console.log(moment(cEvent.endsAt).toDate()); //Mon Oct 24 2016 22:15:00 GMT-0400 (EDT) - user selected
            console.log(startSleepHour +  1 ); //1477364400001
            console.log(moment(1477364400001).toDate()); //Mon Oct 24 2016 23:00:00 GMT-0400 (EDT)
            console.log(nextDaySleepEnd + 1); //1477393200001
            console.log(moment(1477393200001).toDate()); //Tue Oct 25 2016 07:00:00 GMT-0400 (EDT)
            */

            MyChargeDataService.getData(function(response){
                if(response.success == "true") {
                    var myChargeEvents = response.data;
                    //console.log(response.data);
                    for(var i = 0; i < myChargeEvents.length; i++){
                        if(myChargeEvents[i].dataType == 'sleep'){
                            allSleepInLocalstorage.push(myChargeEvents[i].tsStart);
                            allSleepInLocalstorage.push(myChargeEvents[i].tsEnd);
                        } else if  (myChargeEvents[i].dataType == 'caffeine'){
                            allCaffeineinLocalStorage.push(myChargeEvents[i].tsStart);
                        }
                    } 
                }
            });

     
            allSleepInLocalstorage.forEach(function(entry, i){
                if ($scope.between(entry, yesterdaysSleepTime, tomorrowMidnight)){
                    allSleepInLocalstorageInRange.push(entry);
                } 
            });
         

            allCaffeineinLocalStorage.forEach(function(entry, i){
                if ($scope.between(entry, yesterdaysSleepTime, tomorrowMidnight)){
                    allCaffeineinLocalStorageInRange.push(entry);
                } 
            });

            allSleepInLocalstorage.forEach(function(entry, i){
                if(i % 2 == 0){
                    if ((allSleepInLocalstorage[i] == (tomorrowSleepTime + 1)) && (allSleepInLocalstorage[i+1] == (tomorrowSleepTime + 1))){
                        defaultTempTomorrowSleepTime = false;
                    }
                }
            });

            allSleepInLocalstorage.forEach(function(entry, i){
                if(i % 2 == 0){
                    if ((allSleepInLocalstorage[i] == (yesterdaysSleepTime + 1)) && (allSleepInLocalstorage[i+1] == (yesterdaysSleepTime + 1))){
                        defaultSevenAmExist = false;
                    }
                }
            });

            allSleepInLocalstorage.forEach(function(entry, i){
                if(i % 2 == 0){
                    if ((allSleepInLocalstorage[i] == (startSleepHour + 1)) && (allSleepInLocalstorage[i+1] == (startSleepHour + 1))){
                        defaultElevenPmExist = false;
                    }
                }
            });
           

           /*
           //check if defaults time exist
            //console.log(allSleepInLocalstorageInRange);
            //console.log(allCaffeineinLocalStorageInRange);
            var checkLastDaySleepEnd = lastDaySleepEnd + 1;
            var arrCheckLastDaySleepEnd = [];
            allSleepInLocalstorageInRange.forEach(function(entry, i){ 
                if(entry == checkLastDaySleepEnd ){
                   arrCheckLastDaySleepEnd.push(false);
                }  else if  (entry == yesterdaysSleepTime + 1 ){
                    arrCheckLastDaySleepEnd.push(false);
                }
            });

            if (arrCheckLastDaySleepEnd.length == 2 ){
                 defaultSevenAmExist = false;
            }

            var checkStartSleepHour = startSleepHour + 1;
            var arrCheckStartSleepHour = [];
            allSleepInLocalstorageInRange.forEach(function(entry, i){ 
                if(entry == checkStartSleepHour ){
                    arrCheckStartSleepHour.push(false);
                } 
            });
            if (arrCheckStartSleepHour.length == 2){
                defaultElevenPmExist = false;
            }
            */

            if (defaultSevenAmExist) {
                allSleepInLocalstorageInRange.push(yesterdaysSleepTime);
                allSleepInLocalstorageInRange.push(lastDaySleepEnd);
            }

            if (defaultElevenPmExist){
                allSleepInLocalstorageInRange.push(startSleepHour);
                allSleepInLocalstorageInRange.push(nextDaySleepEnd);
            }

            if (defaultTempTomorrowSleepTime){
                allSleepInLocalstorageInRange.push(tomorrowSleepTime);
                allSleepInLocalstorageInRange.push(tomorrowMidnight);
            }
            //console.log('-----------');
            //console.log(defaultSevenAmExist);
            //console.log(defaultElevenPmExist);
            //console.log(defaultTempTomorrowSleepTime);
            //console.log('-----------');

            allSleepInLocalstorageInRange.sort();
            allCaffeineinLocalStorageInRange.sort();


             allSleepInLocalstorageInRange.forEach(function(entry, i){  
                 if(i % 2 == 0){ 
                     if(allSleepInLocalstorageInRange[i] == allSleepInLocalstorageInRange[i+1]){
                            allSleepInLocalstorageInRange.splice(i, 1);
                            allSleepInLocalstorageInRange.splice(i, 1);
                     }
                 }
             });

              if (!($scope.editMode)){ 
                    //check user input if it conflicts with the sleep time
                allSleepInLocalstorageInRange.forEach(function(entry, i){ 
                
                    if(i % 2 == 0){
                        if(($scope.between(userInputStartTime, allSleepInLocalstorageInRange[i], allSleepInLocalstorageInRange[i+1])) || 
                            ($scope.between(userInputEndTime, allSleepInLocalstorageInRange[i], allSleepInLocalstorageInRange[i+1]))){
                            //console.log('true ' + userInputStartTime + ' is in between ' + allSleepInLocalstorageInRange[i] + ' & ' + allSleepInLocalstorageInRange[i+1]);
                            //console.log('true ' + userInputEndTime + ' is in between ' + allSleepInLocalstorageInRange[i] + ' & ' + allSleepInLocalstorageInRange[i+1]);
                            if(defaultSevenAmExist){
                                    if(($scope.between(userInputStartTime, yesterdaysSleepTime, lastDaySleepEnd )) ||
                                            ($scope.between(userInputEndTime, yesterdaysSleepTime, lastDaySleepEnd ))){
                                                output.ok = false;
                                                output.message = "Conflict With Yesterday's Default Sleep Time";
                                        }
                                    
                            } 
                            if (defaultElevenPmExist) { 
                                        if(($scope.between(userInputStartTime, startSleepHour, nextDaySleepEnd )) ||
                                            ($scope.between(userInputEndTime, startSleepHour, nextDaySleepEnd ))){
                                                output.ok = false;
                                                output.message = "Conflict With Today's Default Sleep Time";
                                        }
                                            
                            } 
                            if(defaultTempTomorrowSleepTime){
                                    if($scope.between(userInputEndTime, tomorrowSleepTime, tomorrowMidnight )){
                                                output.ok = false;
                                                output.message = "Conflict With Tomorrow's Sleep Time";
                                        }
                            }

                             if (output.ok) {
                                if (!((allSleepInLocalstorageInRange[i] == moment(initialCalendar).toDate().getTime() ) && (allSleepInLocalstorageInRange[i+1] == moment(initialDuration).toDate().getTime()))){
                                        output.ok = false;
                                        output.message = "Conflict With existing Sleep Time 1";
                                }
                            }
                        } 

                        if (output.ok) {
                            if(($scope.between(allSleepInLocalstorageInRange[i], userInputStartTime, userInputEndTime)) &&
                                        ($scope.between(allSleepInLocalstorageInRange[i+1], userInputStartTime, userInputEndTime)) ){
                                            output.ok = false;
                                            // console.log("Conflict With existing Sleep Time");
                                            output.message = "Conflict With existing Sleep Time sfsdf";
                            }
                        }
                    }
                }); 
            }

                if (output.ok){ 
                    if ($scope.editMode){ 

                     
                
                        if(allSleepInLocalstorageInRange.length > 0){ 
                            allSleepInLocalstorageInRange.forEach(function(entry, i){ 
                                if(i % 2 == 0){
                                    if(($scope.between(userInputStartTime, allSleepInLocalstorageInRange[i], allSleepInLocalstorageInRange[i+1])) || 
                                        ($scope.between(userInputEndTime, allSleepInLocalstorageInRange[i], allSleepInLocalstorageInRange[i+1]))){
                                        //console.log('true ' + userInputStartTime + ' is in between ' + allSleepInLocalstorageInRange[i] + ' & ' + allSleepInLocalstorageInRange[i+1]);
                                        //console.log('true ' + userInputEndTime + ' is in between ' + allSleepInLocalstorageInRange[i] + ' & ' + allSleepInLocalstorageInRange[i+1]);
                                        if(defaultSevenAmExist){
                                                if(($scope.between(userInputStartTime, yesterdaysSleepTime, lastDaySleepEnd )) ||
                                                        ($scope.between(userInputEndTime, yesterdaysSleepTime, lastDaySleepEnd ))){
                                                            output.ok = false;
                                                            output.message = "Conflict With Yesterday's Default Sleep Time";
                                                    }
                                                
                                        } 
                                        if (defaultElevenPmExist) { 
                                                    if(($scope.between(userInputStartTime, startSleepHour, nextDaySleepEnd )) ||
                                                        ($scope.between(userInputEndTime, startSleepHour, nextDaySleepEnd ))){
                                                            output.ok = false;
                                                            output.message = "Conflict With Today's Default Sleep Time";
                                                    }
                                                        
                                        } 
                                        if(defaultTempTomorrowSleepTime){
                                                if($scope.between(userInputEndTime, tomorrowSleepTime, tomorrowMidnight )){
                                                            output.ok = false;
                                                            output.message = "Conflict With Tomorrow's Sleep Time";
                                                    }
                                        }

                                        if (output.ok) {
                                            if (!((allSleepInLocalstorageInRange[i] == moment(initialCalendar).toDate().getTime() ) && (allSleepInLocalstorageInRange[i+1] == moment(initialDuration).toDate().getTime()))){
                                                    output.ok = false;
                                                    output.message = "Conflict With existing Sleep Time 2345245";
                                            }
                                            //console.log(moment(allSleepInLocalstorageInRange[i]).toDate().getTime());
                                            //console.log(moment(initialCalendar).toDate().getTime());
                                            //console.log(moment(allSleepInLocalstorageInRange[i+1]).toDate().getTime());
                                            //console.log(moment(initialDuration).toDate().getTime());
                                        }
                                    } 

                                    if (output.ok) {
                                        if(($scope.between(allSleepInLocalstorageInRange[i], userInputStartTime, userInputEndTime)) &&
                                                    ($scope.between(allSleepInLocalstorageInRange[i+1], userInputStartTime, userInputEndTime)) ){
                                                        if ((allSleepInLocalstorageInRange[i] == moment(initialCalendar).toDate().getTime() ) && (allSleepInLocalstorageInRange[i+1] == moment(initialDuration).toDate().getTime())){
                                                               
                                                        } else {
                                                            output.ok = false;
                                                            output.message = "Conflict With existing Sleep Time 23425";
                                                        }
                                        }
                                    }
                                
                                }

                            });
                        } else {  
                            if(defaultSevenAmExist){
                                if(($scope.between(userInputStartTime, yesterdaysSleepTime, lastDaySleepEnd )) ||
                                    ($scope.between(userInputEndTime, yesterdaysSleepTime, lastDaySleepEnd ))){
                                        output.ok = false;
                                        output.message = "Conflict With Yesterday's Default Sleep Time 235234532";
                                }
                                                
                            } 
                            if (defaultElevenPmExist) { 
                                if(($scope.between(userInputStartTime, startSleepHour, nextDaySleepEnd )) ||
                                    ($scope.between(userInputEndTime, startSleepHour, nextDaySleepEnd ))){
                                    output.ok = false;
                                    output.message = "Conflict With Today's Default Sleep Time 23";
                                }
                                            
                            } 
                            if(defaultTempTomorrowSleepTime){
                                if($scope.between(userInputEndTime, tomorrowSleepTime, tomorrowMidnight )){
                                    output.ok = false;
                                    output.message = "Conflict With Tomorrow's Sleep Time ";
                                }
                            }
                                         
                        }
                       
                    } /** End Edit Mode */
               
                } /** End  (output.ok)*/

                if (output.ok){ 
                    if ((!($scope.editMode)) || ($scope.editMode)){ 
                        if(defaultSevenAmExist){
                                if(($scope.between(userInputStartTime, yesterdaysSleepTime, lastDaySleepEnd )) ||
                                        ($scope.between(userInputEndTime, yesterdaysSleepTime, lastDaySleepEnd ))){
                                            output.ok = false;
                                            output.message = "Conflict With Yesterday's Default Sleep Time";
                                    }
                                
                            } 
                            if (defaultElevenPmExist) { 
                                    if(($scope.between(userInputStartTime, startSleepHour, nextDaySleepEnd )) ||
                                        ($scope.between(userInputEndTime, startSleepHour, nextDaySleepEnd ))){
                                            output.ok = false;
                                            output.message = "Conflict With Today's Default Sleep Time  wert";
                                    }
                                        
                            }
                            if(defaultTempTomorrowSleepTime){
                                if($scope.between(userInputEndTime, tomorrowSleepTime, tomorrowMidnight )){
                                    output.ok = false;
                                    output.message = "Conflict With Tomorrow's Sleep Time";
                                }
                            }
                    } 
                }

             
                if (output.ok) {
                    allCaffeineinLocalStorageInRange.forEach(function(entry, i){
                        if (entry == userInputStartTime) {
                            output.ok = false;
                            console.log('drinking coffee'); 
                            output.message = "Conflict With a Caffeine Event";
                        } 
                    });
                }

                if (output.ok) {
                    allCaffeineinLocalStorageInRange.forEach(function(entry, i){ 
                        if (entry == userInputEndTime) {
                            output.ok = false;
                            console.log('drinking coffee'); 
                            output.message = "Conflict With a Caffeine Event";
                        } 
                    });
                }

                if (output.ok){ 
                    if ((!($scope.editMode)) || ($scope.editMode)){ 
                        allCaffeineinLocalStorageInRange.forEach(function(entry, i){ 
                            if($scope.between(entry, userInputStartTime, userInputEndTime )) {
                                output.ok = false;
                                console.log('drinking coffee'); 
                                output.message = "Conflict With a Caffeine Event";
                            } 
                        });
                    } 
                }
   
           
            return output;
        }



        $scope.between = function (x, min, max) {
            return x >= min && x <= max;
        }

        $scope.resetForm = function (StrformName) {
             switch (StrformName) {
                case 'sleepForm':
                    //$scope.sleepForm.$setPristine();
                    calEvent.startsAt = moment(initialCalendar).startOf('day').add(initialHour, 'hours').toDate();
                    $scope.durationSelected = initialDurationReset;
                    //$scope.sleepForm.$setPristine();
                   // 
                   // initialDurationReset = {};
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
                    ok: true,
                    message: ''
                };
                
                cEvent.endsAt = moment(cEvent.startsAt).add($scope.durationSelected.ts, 'ms').toDate();
                var zeroHour = moment(cEvent.startsAt).startOf('day').toDate().getTime();
                var lastDaySleepEnd = zeroHour + DEFAULT_SLEEP_END * 60 * 60 * 1000;
                var lastDaySleepStart = lastDaySleepEnd - DEFAULT_SLEEP_DURATION * 60 * 60 * 1000;
                var startSleepHour = zeroHour + DEFAULT_SLEEP_START * 60 * 60 * 1000;
                var nextDaySleepEnd = startSleepHour + DEFAULT_SLEEP_DURATION * 60 * 60 * 1000;
                var endOfDay = zeroHour + 24 * 60 * 60 * 1000;
                var allSleepInLocalstorage = [];
                var allCaffeineinLocalStorage = [];
                var allSleepInLocalstorageInRange = [];
                var allCaffeineinLocalStorageInRange = [];
                var defaultSevenAmExist = true;
                var defaultElevenPmExist = true;
                var yesterdaysSleepTime = zeroHour - 3600000;
                var tomorrowMidnight = zeroHour + (3600000 * 48) - 1;
                var tomorrowSleepTime = nextDaySleepEnd + (3600000 * 16);
                var userInputStartTime = cEvent.startsAt.getTime() + 1;
              
                //console.log(lastDaySleepEnd);
                //console.log(endOfDay);
                /*
                console.log('test');
                console.log(moment(zeroHour).toDate()); //Mon Oct 24 2016 00:00:00 GMT-0400 (EDT) - the same as cEvent).toDate() - midnight start
                console.log(moment(lastDaySleepEnd).toDate()); //Mon Oct 24 2016 07:00:00 GMT-0400 (EDT)
                console.log(moment(startSleepHour).toDate()); //Mon Oct 24 2016 23:00:00 GMT-0400 (EDT)
                console.log(moment(endOfDay).toDate()); //Oct 25 2016 00:00:00 GMT-0400 (EDT)
                console.log(moment(nextDaySleepEnd).toDate()); //Tue Oct 25 2016 07:00:00 GMT-0400 (EDT)
                console.log('End test');

                //user selected
                //console.log(moment(cEvent.startsAt).toDate()); //Mon Oct 24 2016 22:00:00 GMT-0400 (EDT) - user selected
                //console.log(moment(cEvent.endsAt).toDate()); //Mon Oct 24 2016 22:15:00 GMT-0400 (EDT) - user selected
                console.log(startSleepHour +  1 ); //1477364400001
                console.log(moment(1477364400001).toDate()); //Mon Oct 24 2016 23:00:00 GMT-0400 (EDT)
                console.log(nextDaySleepEnd + 1); //1477393200001
                console.log(moment(1477393200001).toDate()); //Tue Oct 25 2016 07:00:00 GMT-0400 (EDT)
                */

                MyChargeDataService.getData(function(response){
                    if(response.success == "true") {
                        var myChargeEvents = response.data;
                        console.log(response.data);
                        for(var i = 0; i < myChargeEvents.length; i++){
                            if(myChargeEvents[i].dataType == 'sleep'){
                                allSleepInLocalstorage.push(myChargeEvents[i].tsStart);
                                allSleepInLocalstorage.push(myChargeEvents[i].tsEnd);
                                 //console.log(myChargeEvents[i].tsStart);
                                 //console.log(myChargeEvents[i].tsEnd);
                            } else if  (myChargeEvents[i].dataType == 'caffeine'){
                                allCaffeineinLocalStorage.push(myChargeEvents[i].tsStart);
                            }
                        } 
                    }
                });

              
                allSleepInLocalstorage.forEach(function(entry, i){
                if ($scope.between(entry, yesterdaysSleepTime, tomorrowMidnight)){
                    allSleepInLocalstorageInRange.push(entry);
                } 
                });
            

                allCaffeineinLocalStorage.forEach(function(entry, i){
                    if ($scope.between(entry, yesterdaysSleepTime, tomorrowMidnight)){
                        allCaffeineinLocalStorageInRange.push(entry);
                    } 
                });

                allSleepInLocalstorage.forEach(function(entry, i){
                    if(i % 2 == 0){
                        if ((allSleepInLocalstorage[i] == (yesterdaysSleepTime + 1)) && (allSleepInLocalstorage[i+1] == (yesterdaysSleepTime + 1))){
                            defaultSevenAmExist = false;
                        }
                    }
                });

                allSleepInLocalstorage.forEach(function(entry, i){
                    if(i % 2 == 0){
                        if ((allSleepInLocalstorage[i] == (startSleepHour + 1)) && (allSleepInLocalstorage[i+1] == (startSleepHour + 1))){
                            defaultElevenPmExist = false;
                        }
                    }
                });
            
                if (defaultSevenAmExist) {
                    allSleepInLocalstorageInRange.push(yesterdaysSleepTime);
                    allSleepInLocalstorageInRange.push(lastDaySleepEnd);
                }

                if (defaultElevenPmExist){
                    allSleepInLocalstorageInRange.push(startSleepHour);
                    allSleepInLocalstorageInRange.push(nextDaySleepEnd);
                }

             
        

                allSleepInLocalstorageInRange.sort();
                allCaffeineinLocalStorageInRange.sort();


                allSleepInLocalstorageInRange.forEach(function(entry, i){  
                    if(i % 2 == 0){ 
                        if(allSleepInLocalstorageInRange[i] == allSleepInLocalstorageInRange[i+1]){
                                allSleepInLocalstorageInRange.splice(i, 1);
                                allSleepInLocalstorageInRange.splice(i, 1);
                        }
                    }
                });
               
                if (output.ok) {
                    allCaffeineinLocalStorageInRange.forEach(function(entry, i){
                        if (entry == userInputStartTime) {
                             if ($scope.editMode){ 

                                var editModeStartTime = moment(initialCalendar).toDate().getTime() + 1;
                                var updateEditCoffeeTime = allCaffeineinLocalStorage;
                                
                                updateEditCoffeeTime.forEach(function(entry, i){ 
                                        if (editModeStartTime == updateEditCoffeeTime[i]){
                                            updateEditCoffeeTime.splice(i, 1);
                                        } 
                                });

                                updateEditCoffeeTime.forEach(function(entry, i){ 
                                        if (entry == userInputStartTime) { 
                                            output.ok = false;
                                            console.log('drinking coffee'); 
                                            output.message = "Conflict With a Caffeine Event";
                                        }
                                });  
                                
                             } else {
                                output.ok = false;
                                console.log('drinking coffee'); 
                                output.message = "Conflict With a Caffeine Event";
                             }

                            
                        } 
                    });
                }

                if (output.ok) {
                    console.log(userInputStartTime);
                    allSleepInLocalstorageInRange.forEach(function(entry, i){ 
                
                    if(i % 2 == 0){
                        if($scope.between(userInputStartTime, allSleepInLocalstorageInRange[i], allSleepInLocalstorageInRange[i+1])){
                            //console.log('true ' + userInputStartTime + ' is in between ' + allSleepInLocalstorageInRange[i] + ' & ' + allSleepInLocalstorageInRange[i+1]);
                            //console.log('true ' + userInputEndTime + ' is in between ' + allSleepInLocalstorageInRange[i] + ' & ' + allSleepInLocalstorageInRange[i+1]);
                            if(defaultSevenAmExist){
                                    if(($scope.between(userInputStartTime, yesterdaysSleepTime, lastDaySleepEnd )) ||
                                            ($scope.between(userInputEndTime, yesterdaysSleepTime, lastDaySleepEnd ))){
                                                output.ok = false;
                                                output.message = "Conflict With Yesterday's Default Sleep Time";
                                        }
                                    
                            } 
                            if (defaultElevenPmExist) { 
                                        if(($scope.between(userInputStartTime, startSleepHour, nextDaySleepEnd )) ||
                                            ($scope.between(userInputEndTime, startSleepHour, nextDaySleepEnd ))){
                                                output.ok = false;
                                                output.message = "Conflict With Today's Default Sleep Time";
                                        }
                                            
                            } 
                          
                             if (output.ok) {
                                  output.ok = false;
                                  output.message = "Conflict With existing Sleep Time";
                            }
                        } 

                 
                    }
                });
            }

                return output;
            }


        };

      

      
    }
]);
