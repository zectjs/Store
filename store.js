var hasLocalStorage,
    hashSessionStorage,
    _storage = {};

try {
    hasLocalStorage = ('localStorage' in window) &&
        localStorage !== null;
} catch (e) {
    hasLocalStorage = false;
}
try {
    hashSessionStorage = ('sessionStorage' in window) &&
        sessionStorage !== null;
} catch (e) {
    hashSessionStorage = false;
}

function LS() {};
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

function Session() {};
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

function Memory() {};
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
var Storage = function(options) {
    options = options || {};
    if (options.local && hasLocalStorage) {
        this.storage = new LS();
    } else if ((options.local && hasLocalStorage) || (options.session && hashSessionStorage)) {
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
    remove: function(key) {
        this.storage.remove(key);
    },
    removeExpired: function() {
        var that = this;
        this.storage.keys().forEach(function(key) {
            that.get(key);
        });
    }
}

module.exports = Storage;
