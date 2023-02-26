"use strict"
exports.__esModule = true
exports.newStore = void 0
//@ts-check
var react_1 = require("react")
function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj))
}
function isEqual(a,b) {
  if(typeof a!=typeof b) {
    return false
  }
  if(typeof a=='object' && typeof b=='object') {
    if (Object.keys(a).length!=Object.keys(b).length) return false
  }
  return JSON.stringify(a)==JSON.stringify(b)
}
function newStore(state) {
    //@ts-ignore
    var Store = state
    var callbacks = {}
    var callbacksNextAvailableKey = 0

    var beforeLastRender
    function updateStoreNow() { 
          
        scheduled = false

        for (var i in callbacks) {
            callbacks[i]()
        }
    }


    var scheduled = false
    function Schedule() {
        if (scheduled)
            return
        scheduled = true
        setTimeout(updateStoreNow, 0)
    }
    /**
     * @example useRerenderIfChange((store) => [store.scale, store.othervalue])
     * @param callback {(store:Store)=>void}
     */
    Store.useRerenderIfChange = function (callback,name) {
        var _a = react_1.useState(0), _ = _a[0], setMeToRerender = _a[1]
        var callbacksKeyRef = react_1.useRef(callbacksNextAvailableKey++)
        /** The array from the user. Cloned so new changes will not be there */
        var cloned = react_1.useCallback(()=>cloneDeep(callback(Store)))
        var lastValueRef = react_1.useRef(cloned)
        react_1.useEffect(function () {
            // When object mount, add a function to the callbacks, to change if the value changes
            // it will trigged by the "updateStore below"
            callbacks[callbacksKeyRef.current] = function () {
                var currentValue = callback(Store) // The new array of values calculated from the store
                if (!isEqual(currentValue, lastValueRef.current)) {
                    lastValueRef.current = cloneDeep(currentValue) // Update the old array.
                    setMeToRerender(function (prev) { return prev + 1 }) // Rerender the objects
                }
            }
            return function () {
                // When object unmount we don't need this callback any more.
                delete callbacks[callbacksKeyRef.current]
            }
        }, [])
        return lastValueRef.current
    }
    Store.updateStore = function () {
        Schedule()
    }
    return Store
}
exports.newStore = newStore
