/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('bestsimilar');

// Search for documents in the current collection.
var items = db.getCollection('movies').find();
console.log(items.count());

// 104467

items = db.getCollection('tags').find();
console.log(items.count());
