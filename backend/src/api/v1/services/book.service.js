const _book = require("../models/book.model");

var that = (module.exports = {
  /**
   * @param {number} size
   * @param {number} page
   */
  getBooks: async (limit = 10, pageNumber = 1) => {
    const result = {};
    const totalBooks = await _book.countDocuments();
    let startIndex = (pageNumber - 1) * limit;
    let endIndex = pageNumber * limit;
    result.total = totalBooks;
    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }
    if (endIndex < totalBooks) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }
    result.rowsPerPage = limit;
    result.data = await _book
      .find()
      .skip(startIndex)
      .limit(limit)
      .sort("_id");
    return result;
  },
  /**
   * @param {string} id
   */
  getBook: async (id) => {
    return await _book.findOne({ _id: id });
  },
  /**
   * @param {import("../interfaces").Book} book
   */
  addBook: async (book) => {
    return await _book.create(book);
  },
  /**
   *
   * @param {import("../interfaces").Book} book
   */
  updateBook: async (id, book) => {
    return await _book.updateOne({ _id: id }, book);
  },
  /**
   * @param {import("../interfaces").Book} book
   */
  deleteBook: async (book) => {
    return await _book.remove(book);
  },
});
