# bookshelf-flexi-where

A more flexible way to build where statements in bookshelf.

## Installation
```
npm i --save bookshelf-flexi-where
```

## Usage
```js
import flexiWhere from 'bookshelf-flexi-where';

// Register the plugin
Bookshelf.plugin(flexiWhere);

const opts = [
  {
    column: 'email',
    operator: 'like',
    value: '%tripvisto%',
  },
  {
    column: 'username',
    operator: '=',
    value: 'wingski',
  },
];
User.forge()
  .flexiWhere(opts)
  .fetchAll()
  .then(result => {
    expect(result.size(), 1);
    expect(result.at(0).get('email')).include('tripvisto');
    expect(result.at(0).get('username')).include('wingski');
  })
  .then(() => done())
  .catch(err => done(err));
```

## License
MIT
