/*global jasmine,describe,it,beforeEach,expect,dynastate*/

describe("dynastate", function(){
    'use strict';

    var dsmachine;

    beforeEach(function(){
        var transition = function(){};
        dsmachine = new dynastate(transition);
    });

    it('should be a function', function(){
        expect(typeof dynastate).toBe('function');
    });

    it('should require a transition function to instantiate', function(){
        var obj,
            errorThrown = false;

        try{
            obj = new dynastate();
        } catch (error){
            errorThrown = true;
        }

        expect(errorThrown).toBe(true);
    });

    describe('getStateLocation', function(){

        it('should be a function', function(){
            expect(typeof dsmachine.getStateLocation).toBe('function');
        });

        it('should return -1 by default', function(){
            expect(dsmachine.getStateLocation()).toBe(-1);
        });

        it('should return 3 when state location is set to 3', function(){
            dsmachine.setStateLocation(3);

            expect(dsmachine.getStateLocation()).toBe(3);
        });

    });

    describe('setStateLocation', function(){

        it('should be a function', function(){
            expect(typeof dsmachine.setStateLocation).toBe('function');
        });

        it('should update the state index when called', function(){
            dsmachine.setStateLocation(5);
            expect(dsmachine.getStateLocation()).toBe(5);
        });

    });

    describe('getCurrentState', function(){

        it('should be a function', function(){
            expect(typeof dsmachine.getCurrentState).toBe('function');
        });

        it('should return undefined if no state exists at the current index', function(){
            expect(typeof dsmachine.getCurrentState()).toBe('undefined');
        });

        it('should return the current state if one exists at the current index', function(){
            dsmachine.pushState({});
            dsmachine.setStateLocation(0);

            var currentState = dsmachine.getCurrentState();

            expect(JSON.stringify(currentState)).toBe(JSON.stringify({}));
        });
    });

    describe('pushState', function(){

        it('should be a function', function(){
            expect(typeof dsmachine.pushState).toBe('function');
        });

        it('should add a state to the end of the stack', function(){
            dsmachine.pushState({});
            dsmachine.setStateLocation(0);

            expect(typeof dsmachine.getCurrentState()).toBe('object');
        });

    });

    describe('clearStates', function(){

        it('should be a function', function(){
            expect(typeof dsmachine.clearStates).toBe('function');
        });

        it('should reset state index to -1', function(){
            dsmachine.setStateLocation(1);
            dsmachine.clearStates();

            expect(dsmachine.getStateLocation()).toBe(-1);
        });

        it('should reset state stack to an empty array', function(){
            dsmachine.pushState({});
            dsmachine.clearStates();
            dsmachine.setStateLocation(0);

            expect(typeof dsmachine.getCurrentState()).toBe('undefined');
        });

    });

    describe('trimStates', function(){

        it('should be a function', function(){
            expect(typeof dsmachine.trimStates).toBe('function');
        });

        it('should not remove current state', function(){
            dsmachine.pushState({});
            dsmachine.pushState({});
            dsmachine.pushState({});
            dsmachine.pushState({});

            dsmachine.setStateLocation(1);
            dsmachine.trimStates();

            expect(typeof dsmachine.getCurrentState()).toBe('object');
        });

        it('should trim all states after current state', function(){
            dsmachine.pushState({});
            dsmachine.pushState({});
            dsmachine.pushState({});
            dsmachine.pushState({});

            dsmachine.setStateLocation(1);
            dsmachine.trimStates();

            dsmachine.setStateLocation(2);

            expect(typeof dsmachine.getCurrentState()).toBe('undefined');
        });

    });

    describe('addState', function(){

        it('should be a function', function(){
            expect(typeof dsmachine.addState).toBe('function');
        });

        it('should call pushState', function(){
            dsmachine.pushState = jasmine.createSpy('pushState');

            dsmachine.addState({});

            expect(dsmachine.pushState).toHaveBeenCalled();
        });

        it('should set index to new state location', function(){
            dsmachine.pushState({});
            dsmachine.pushState({});

            dsmachine.addState({});

            expect(dsmachine.getStateLocation()).toBe(2);
        });

        it('should call pre-set transition with new state and last set state', function(){
            dsmachine.transition = jasmine.createSpy("transition");

            dsmachine.pushState({ id: 1 });
            dsmachine.pushState({ id: 2 });
            dsmachine.pushState({ id: 3 });

            dsmachine.setStateLocation(1);

            dsmachine.addState({ id: 4 });

            expect(dsmachine.transition).toHaveBeenCalledWith({ id: 4 }, { id: 2 });
        });

    });

    describe('transitionToState', function(){

        it('should be a function', function(){
            expect(typeof dsmachine.transitionToState).toBe('function');
        });

        it('should call transition with new state and old state', function(){
            dsmachine.transition = jasmine.createSpy('transition');

            dsmachine.pushState({ id: 1 });
            dsmachine.pushState({ id: 2 });
            dsmachine.pushState({ id: 3 });
            dsmachine.pushState({ id: 4 });

            dsmachine.setStateLocation(1);
            dsmachine.transitionToState(3);

            expect(dsmachine.transition).toHaveBeenCalledWith({ id: 4 }, { id: 2 });
        });

    });

    describe('transitionBack', function(){

        beforeEach(function(){
            for(var i = 1; i < 5; i++){
                dsmachine.pushState({ id: i });
            }
        });

        it('should be a function', function(){
            expect(typeof dsmachine.transitionBack).toBe('function');
        });

        it('should not change position if final state location would be less than 0', function(){
            dsmachine.setStateLocation(0);

            dsmachine.transitionBack();

            expect(dsmachine.getStateLocation()).toBe(0);
        });

        it('should call transitionToState with an index one lower when called without argument', function(){
            dsmachine.transitionToState = jasmine.createSpy('transitionToState');

            dsmachine.setStateLocation(1);
            dsmachine.transitionBack();

            expect(dsmachine.transitionToState).toHaveBeenCalledWith(0);
        });

        it('should transition to state location defined by offset', function(){
            dsmachine.transitionToState = jasmine.createSpy('transitionToState');

            dsmachine.setStateLocation(3);
            dsmachine.transitionBack(2);

            expect(dsmachine.transitionToState).toHaveBeenCalledWith(1);
        });

    });

    describe('transitionForward', function(){

        beforeEach(function(){
            for(var i = 1; i < 5; i++){
                dsmachine.pushState({ id: i });
            }
        });

        it('should be a function', function(){
            expect(typeof dsmachine.transitionForward).toBe('function');
        });

        it('should not change position if final state would be greater than the last state index', function(){

            var lastIndex = dsmachine.getLastStateLocation();

            dsmachine.setStateLocation(lastIndex);

            dsmachine.transitionForward();

            expect(dsmachine.getStateLocation()).toBe(lastIndex);
        });

        it('should call transitionToState with an index one greater when called without argument', function(){

            dsmachine.transitionToState = jasmine.createSpy('transitionToState');

            dsmachine.setStateLocation(0);
            dsmachine.transitionForward();

            expect(dsmachine.transitionToState).toHaveBeenCalledWith(1);
        });

        it('should transition to state location defined by offset', function(){
            dsmachine.transitionToState = jasmine.createSpy('transitionToState');

            dsmachine.setStateLocation(0);
            dsmachine.transitionForward(2);

            expect(dsmachine.transitionToState).toHaveBeenCalledWith(2);
        });
    });

});