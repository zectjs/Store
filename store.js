var hasLocal,
    hasSession,
    _storage = {};

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
        localStorage.removeItem(key, value);
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
        sessionStorage.removeItem(key, value);
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
    // 初始化前，清空过期内容
    this.removeExpired();
};

Storage.prototype = {
    get: function(key) {
        var value = this.storage.get(key),
            obj;

        try {
            obj = JSON.parse(value);
        } catch (e) {
            obj = value;
        }

        if (obj && obj.data) {
            if (!('expire' in obj) || obj.expire > Date.now()) {
                return obj.data;
            }
            this.remove(key);
        }
        return null;
    },
    set: function(key, value, expire) {
        var obj = {
            data: value
        };
        if (expire > 0) {
            obj.expire = Date.now() + expire * 1000;
        }
        this.storage.set(key, JSON.stringify(obj));
        return value;
    },
    /**
     *  remove the specify cache with the key
     **/
    remove: function(key) {
        this.storage.remove(key);
    },
    /**
     *  remove all expired cache
     **/
    removeExpired: function() {
        var that = this;
        this.storage.keys().forEach(function(key) {
            that.get(key);
        });
    }
};

module.exports = Storage;
