Store
=====

Storage Module, the storage encapsulation of localStorage/sessionStorage/Memory, for the consistency interface.

## Install
```base
bower install Storejs
```

## Usage
```javascript

var store = new Store({
  session: true // -> use sessionStorage or local: true->use  localStorage
});

store.set('name', switer);
store.get('name'); // return "switer"
store.remove('name'); // now it's empty

store.set('data', {user: 'switer'}, 60); // store value with expire of 60 seconds
```

## API
__instance options:__
```javascript
{
    local: {Boolean},  // use localstorage
    session: {Boolean} // use session storage
    namespace: {String}// use namespace 
}
```
__instance methods:__
```
get(key) getter

set(key, value, expire) setter

remove(key) remove the specify cache with the key

removeExpired() remove all expired cache
```
