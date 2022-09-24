export interface Book {
  bookId: String,
  bookTitle: String,
  bookAuthor: String,
}

export interface BooksResult {
  totalPost: Number,
  previous: {
    pageNumber: Number,
    limit: Number,
  },
  next: {
    pageNumber: Number,
    limit: Number,
  },
  rowsPerPage: Number,
  data: any,
}

export interface userLoginResult {
  code: Number,
  data: any,
}

export interface user {
  userName: String,
  userPassword: String,
  userRole: Number,
}