import { Request } from 'express';
import { Query } from 'mongoose';

class ApiFeatures<
  ResultType,
  DocType,
  THelpers = {},
  RawDocType = DocType,
  QueryOp = 'find',
> {
  constructor(
    private searchQuery: Request['query'],
    private modelQuery: Query<
      ResultType,
      DocType,
      THelpers,
      RawDocType,
      QueryOp
    >,
  ) {}
  // * limit
  get limit() {
    const { limit } = this.searchQuery;
    return Number(limit) || 5;
  }
  get page() {
    const { page } = this.searchQuery;
    return Number(page) || 1;
  }
  get skip() {
    return (this.page - 1) * this.limit;
  }
  // * sortable fields
  get sortable() {
    const { sort } = this.searchQuery;
    return sort && typeof sort == 'string' ? sort.replaceAll(',', ' ') : '';
  }
  // * selectable fields
  get fields() {
    const { fields } = this.searchQuery;
    return fields && typeof fields == 'string'
      ? fields.replaceAll(',', ' ')
      : '';
  }
  // * sort
  sort(defaultSort: string = '') {
    this.sortable && this.modelQuery.sort(this.sortable || defaultSort);
    return this;
  }
  // * select
  select() {
    this.fields && this.modelQuery.select(this.fields);
    return this;
  }
  // * pagination
  paginate() {
    this.modelQuery.limit(this.limit).skip(this.skip);
    return this;
  }
  // * query
  query() {
    return this.modelQuery;
  }
}

export { ApiFeatures };
