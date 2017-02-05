class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
     if (config == undefined)
      throw new Error("Config isn't passed");
     else {
     this._config = config;
     this.current = this._config.initial;
     this._undo = [];
     this._undo.push(this.current);
     this._undoLen = 0;
     }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
     return String(this.current);
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
     if(!(state in this._config.states))
      throw new Error("State isn't exist");
     else
     {       
      this.current = state;
      this._undoLen++;
      this._undo[this._undoLen] = this.current;
     }
        
     return this;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
     var state = this.current;
     if(event in this._config.states[state].transitions) {
      this.current = this._config.states[state].transitions[event];
      this._undoLen++;
      this._undo[this._undoLen] = this.current;
     }
      else
       throw new Error("State isn't exist");
       
     return this;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
     return this.current = this._config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
     var arr = Object.keys(this._config.states), array = [];
          
     if(event == undefined) 
        return arr;
     else
      for(var i = 0; i < arr.length; i++) 
       for(var trans in this._config.states[arr[i]].transitions) 
        if(trans == event)
         array.push(arr[i]);
     
     return array;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
     if(this._undoLen) {
      this._undoLen--;
      this.current = this._undo[this._undoLen];
      return true;
     }
     else
      return false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
     if(this._undoLen == this._undo.length-1)
      return false;
     else {
      this._undoLen++;
      this.current = this._undo[this._undoLen];
      return true;
     }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
     for(var i = this._undo.length-1; i; i--)
      this._undo.pop();
     this._undoLen = 0;
    }
}

module.exports = FSM;