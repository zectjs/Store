Store
=====

<<<<<<< HEAD
Storage Module, the storage encapsulation of localStorage/sessionStorage/Memory, for the consistency interface.

## Install
```base
bower install Storejs
```

## API
__instance options:__

__instance methods:__

get(key) getter

set(key, value, expire) setter

remove(key) remove the specify cache with the key

removeExpired() remove all expired cache
=======
Storage Module, the starge encapsulation of  localStorage/sessionStorage/Memory.

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

>>>>>>> 30d967fd0466dd4e7fb700a926bed6dddb8bc294
