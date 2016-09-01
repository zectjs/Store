'use strict'

var undef = void(0)
var fns = {
    type: function(obj) {
        if (obj === null) return 'null'
        else if (obj === undef) return 'undefined'
        var m = /\[object (\w+)\]/.exec(Object.prototype.toString.call(obj))
        return m ? m[1].toLowerCase() : ''
    },
    indexOf: function (arr, tar) {
        if (arr.indexOf) return arr.indexOf(tar)
        else {
            var i = -1
            fns.some(arr, function (item, index) {
                if (item === tar) {
                    i = index
                    return true
                }
            })
            return i
        }
    },
    forEach: function (arr, fn) {
        if (arr.forEach) return arr.forEach(fn)
        else {
            var len = arr.length
            for (var i = 0 ; i < len; i++) {
                fn(arr[i], i)
            }
        }
        return arr
    }
}
module.exports = fns
