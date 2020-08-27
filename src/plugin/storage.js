const Store = require('electron-store')

const store = new Store();

store.set('unicorn', '🦄');
console.log(store.get('unicorn'));

export default class Storage {

}