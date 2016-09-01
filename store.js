'use strict';

var fns = require('./util')

var hasLocal,
    hasSession,
    _storage = {},
    _storateCleanState = {}

// storage detect
hasLocal = ('localStorage' in window) && window.localStorage !== null;
hasSession = ('sessionStorage' in window) && window.sessionStorage !== null;
try {
    hasLocal && window.localStorage.setItem('_store_detection_test_', 'hasLocal')
} catch (e) {
    hasLocal = false
}
try {
    hasSession && window.sessionStorage.setItem('_store_detection_test_', 'hasLocal')
} catch (e) {
    hasSession = false
}
/**
 *  Storage Constructor
 **/
function LS() {}

function Session() {}

function Memory() {}

/**
 *  Consistency interface implementation
 **/
LS.prototype = {
    get: function(key) {
        return localStorage.getItem(key);
    },
    set: function(key, value) {
        localStorage.setItem(key, value);
    },
    remove: function(key) {
        localStorage.removeItem(key);
    },
    keys: function() {
        return Object.keys(localStorage);
    }
};

Session.prototype = {
    get: function(key) {
        return sessionStorage.getItem(key);
    },
    set: function(key, value) {
        sessionStorage.setItem(key, value);
    },
    remove: function(key) {
        sessionStorage.removeItem(key);
    },
    keys: function() {
        return Object.keys(sessionStorage);
    }
};

Memory.prototype = {
    get: function(key) {
        return _storage[key];
    },
    set: function(key, value) {
        _storage[key] = value;
    },
    remove: function(key) {
        delete _storage[key];
    },
    keys: function() {
        return Object.keys(_storage);
    }
};

/**
 *  Storage module constructor
 **/
var Storage = function(options) {
    options = options || {};
    if (options.local && hasLocal) {
        this.storage = new LS();
    } else if ((options.local && !hasLocal) || (options.session && hasSession)) {
        this.storage = new Session();
    } else {
        this.storage = new Memory();
    }
    this.namespace = options.namespace ? options.namespace + '_' : '';
    this.expire = options.expire;
    // Remove those expired items when instance
    this.removeExpired();
};

Storage.prototype = {
    get: function(key) {
        key = this.namespace + (key || '');
        var value = this.storage.get(key),
            obj;

        try {
            obj = JSON.parse(value);
        } catch (e) {
            obj = value;
        }
        if (obj) {
            if (fns.type(obj) != 'object'  || !('expire' in obj) || obj.expire > (new Date()).getTime()) {
                return obj.data;
            }
            this.remove(key);
        }
        return null;
    },
    set: function(key, value, expire) {
        key = this.namespace + (key || '');
        expire = this.expire || expire;

        var obj = {
            data: value
        };
        if (expire > 0) {
            obj.expire = (new Date()).getTime() + expire * 1000;
        }

        try {
            var v = window.JSON && JSON.stringify ? JSON.stringify(obj) : obj;
            this.storage.set(key, v);
        } catch(e) {

        }
    },
    /**
     *  remove the specify cache with the key
     **/
    remove: function(key) {
        key = this.namespace + (key || '');
        this.storage.remove(key);
    },
    /**
     *  remove all expired cache
     **/
    removeExpired: function () {
        var that = this,
            storageType = '';
        if (this.storage instanceof LS) {
            storageType = 'LS';
        } else if (this.storage instanceof Session) {
            storageType = 'Session';
        } else if (this.storage instanceof Memory) {
            storageType = 'Memory';
        }
        if (!storageType || _storateCleanState[storageType]) return;
        _storateCleanState[storageType] = true;
        /**
         *  Async to clean for the performance
         **/
        setTimeout(function() {
            try {
                fns.forEach(that.storage.keys(), function (key) {
                    var obj = that.storage.get(key);
                    try {
                        obj = JSON.parse(obj);
                    } catch (e) {
                        return
                    }
                    if (obj) {
                        if (fns.type(obj) == 'object' && ('expire' in obj) && obj.expire <= (new Date()).getTime()) {
                            that.storage.remove(key);
                        }
                    }
                });
                _storateCleanState[storageType] = false;
            } catch(e) {
                console.log('[Store] removeExpired error:', e)
            }
        }, 60*1000);
    }
};

module.exports = Storage;