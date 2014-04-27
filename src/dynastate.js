var dynastate;

(function(){
    'use strict';

    function curryGetStateLocation (stateObject){
        return function (){
            return stateObject.stateIndex;
        };
    }

    function currentGetLastStateLocation (stateObject){
        return function(){
            return stateObject.stateStack.length - 1;
        };
    }

    function currySetStateLocation(stateObject){
        return function(index){
            stateObject.stateIndex = index;
        };
    }

    function curryGetCurrentState(stateObject){
        return function(){
            var index = stateObject.stateIndex;
            return stateObject.stateStack[index];
        };
    }

    function curryPushState(stateObject){
        return function(state){
            stateObject.stateStack.push(state);
        };
    }

    function curryTrimStates(stateObject){
        return function(){
            var index = stateObject.stateIndex,
                length = stateObject.stateStack.length;

            stateObject.stateStack.splice(index + 1, length);
        };
    }

    function curryClearStates(stateObject){
        return function(){
            stateObject.stateIndex = -1;
            stateObject.stateStack = [];
        };
    }

    function sanitizeOffset(offset){
        return (offset && offset >= 0) ? offset : 1;
    }

    function Dynastate(transition){

        //Defining this within the function to protect it from direct access
        var stateObject = {
                stateIndex: -1,
                stateStack: []
            };

        if(typeof transition === 'function'){
            this.transition = transition;
        } else {
            throw new Error('Dynastate requires a transition function.');
        }

        this.getStateLocation = curryGetStateLocation(stateObject);
        this.getLastStateLocation = currentGetLastStateLocation(stateObject);
        this.setStateLocation = currySetStateLocation(stateObject);
        this.getCurrentState = curryGetCurrentState(stateObject);
        this.pushState = curryPushState(stateObject);
        this.clearStates = curryClearStates(stateObject);
        this.trimStates = curryTrimStates(stateObject);

    }

    Dynastate.prototype = {
        addState: function(newState){
            var lastStateIndex = this.getLastStateLocation();

            this.pushState(newState);
            this.transitionToState(lastStateIndex + 1);
        },

        transitionToState: function(stateIndex){
            var oldState = this.getCurrentState();

            this.setStateLocation(stateIndex);
            this.transition(this.getCurrentState(), oldState);
        },

        transitionBack: function(offset){
            var index = this.getStateLocation();

            offset = sanitizeOffset(offset);

            if(index - offset >= 0){
                this.transitionToState(index - offset);
            }
        },

        transitionForward: function(offset){
            var index = this.getStateLocation();

            offset = sanitizeOffset(offset);

            if(index + offset <= this.getLastStateLocation()){
                this.transitionToState(index + offset);
            }
        }
    };

    dynastate = Dynastate;
})();