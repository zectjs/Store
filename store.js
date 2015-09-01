'use strict';

var hasLocal,
    hasSession,
    _storage = {},
    _storateCleanState = {},
    toString = Object.prototype.toString;

// storage detect
hasLocal = ('localStorage' in window) && window.localStorage !== null;
hasSession = ('sessionStorage' in window) && window.sessionStorage !== null;

/**
 *  Storage Constructor
 **/
function LS() {};

function Session() {};

function Memory() {};

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
    } else if ((options.local && hasLocal) || (options.session && hasSession)) {
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
            if (toString.call(obj) != '[object Object]'  || !('expire' in obj) || obj.expire > (new Date).getTime()) {
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
            obj.expire = (new Date).getTime() + expire * 1000;
        }
        this.storage.set(key, JSON.stringify(obj));
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
        setTimeout( function() {
            this.storage.keys().forEach(function (key) {
                var obj = that.storage.get(key);
                try {
                    obj = JSON.parse(obj);
                } catch (e) {
                    return;
                }
                if (obj) {
                    if (toString.call(obj) == '[object Object]' && ('expire' in obj) && obj.expire <= (new Date).getTime()) {
                        that.storage.remove(key);
                    }
                };
            });
            _storateCleanState[storageType] = false;
        }.bind(this), 60*1000);
    }
};

module.exports = Storage;
