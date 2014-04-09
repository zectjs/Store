Store
=====

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

