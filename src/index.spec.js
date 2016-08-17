import { expect } from 'chai'; // eslint-disable-line
import flexiWhere from './index';
import Bookshelf from 'bookshelf'; // eslint-disable-line
import Promise from 'bluebird'; // eslint-disable-line
import Knex from 'knex'; // eslint-disable-line


describe('bookshelf-flexi-where', () => {
  // Define database
  const bookshelf = Bookshelf(Knex({ // eslint-disable-line new-cap
    client: 'sqlite3',
    connection: {
      filename: ':memory',
    },
  }));

  // Models
  const User = bookshelf.Model.extend({ tableName: 'user' });

  before(done => {
    // Add the plugin
    bookshelf.plugin(flexiWhere);

    // Create table and test data
    bookshelf.knex.schema.dropTableIfExists('user')
      .then(() =>
        bookshelf.knex.schema.createTable('user', table => {
          table.increments('id').primary();
          table.string('username');
          table.string('fullname');
          table.string('email');
        })
      )
      .then(() => Promise.join(
        User.forge().save({
          id: 1,
          username: 'wingski',
          fullname: 'Edwin Adiputra',
          email: 'edwin@tripvisto.com',
        }),
        User.forge().save({
          id: 2,
          username: 'didiet',
          fullname: 'Aditya Saputra',
          email: 'aditya@tripvisto.com',
        }),
        User.forge().save({
          id: 3,
          username: 'npatmaja',
          fullname: 'Nauval Atmaja',
          email: 'nauval.atmaja@gmail.com',
        })
      ))
      .then(() => done())
      .catch(err => done(err));
  });

  after(done => {
    bookshelf.knex.schema.dropTableIfExists('user')
      .then(() => done())
      .catch(err => done(err));
  });

  describe('When no parameter is given', () => {
    it('returns all data', done => {
      User.forge()
        .flexiWhere()
        .fetchAll()
        .then(result => {
          expect(result.size(), 3);
        })
        .then(() => done())
        .catch(err => done(err));
    });
  });

  describe('When an object parameter is given', () => {
    it('returns the matching data', done => {
      const opts = {
        column: 'email',
        operator: 'like',
        value: '%gmail%',
      };
      User.forge()
        .flexiWhere(opts)
        .fetchAll()
        .then(result => {
          expect(result.size(), 1);
          expect(result.at(0).get('email')).include('gmail');
        })
        .then(() => done())
        .catch(err => done(err));
    });
  });

  describe('When an array of object parameter is given', () => {
    it('returns the matching data', (done) => {
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
    });
  });
});
