import { assign, isArray, has } from 'lodash';

export default bookshelf => {
  const checkWhere = item =>
    has(item, 'column') && has(item, 'operator') && has(item, 'value');

  /**
   * Iterates all option parameter and build
   * a where clause statement based on the
   * option.
   *
   * @example
   * const wheres = [
   *   {
   *      column: 'email',
   *      operator: 'like',
   *      value: 'gmail',
   *   },
   *   {
   *      column: 'name',
   *      operator: '=',
   *      value: 'nauval',
   *   }
   * ];
   * UserModel.flexiWhere(wheres).then(result => {
   *    // do something
   * })
   *
   * @param  {Object | Array} opts an object or array of object
   * @return {[type]}      [description]
   */
  const flexiWhere = function flexiWhere(opts) {
    const model = this.constructor
      .forge()
      .query(qb => assign(qb, this.query().clone()));
    const arrayOpts = isArray(opts) ? opts : [opts];
    model.query(qb => {
      arrayOpts.forEach(item => {
        if (checkWhere(item)) {
          qb.where(item.column, item.operator, item.value);
        }
      });
    });
    return model;
  };

  bookshelf.Model.prototype.flexiWhere = flexiWhere; // eslint-disable-line no-param-reassign
  bookshelf.Model.flexiWhere = function (...args) { // eslint-disable-line
    return this.forge().flexiWhere(...args);
  };
  bookshelf.Collection.prototype.flexiWhere = function (...args) { // eslint-disable-line
    return flexiWhere.apply(this.model.forge(), ...args);
  };
};
