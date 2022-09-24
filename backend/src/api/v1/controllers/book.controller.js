const bookService = require("../services/book.service");

var that = (module.exports = {
  /**
   * Lấy danh sách sách
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getBooks: async (req, res, next) => {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const limit = parseInt(req.query.limit) || 10;
    var result = await bookService.getBooks(limit, pageNumber);
    res.json(result);
  },
  /**
   * Lấy sách theo id
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getBook: async (req, res, next) => {
    try {
      var id = req.params.id;
      var book = await bookService.getBook(id);
      if (book) res.json({ data: book });
      else res.status(404).send();
    } catch (error) {
      next(error);
    }
  },
  /**
   * Thêm mới sách
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  addBook: async (req, res, next) => {
    try {
      const book = ({ bookId, bookTitle, bookAuthor } = req.body);
      const newBook = await bookService.addBook(book);
      res.json({ data: newBook });
    } catch (error) {
      next(error);
    }
  },
  /**
   * Cập nhật thông tin sách
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  updateBook: async (req, res, next) => {
    try {
      const id = req.params.id;
      const book = ({ bookId, bookTitle, bookAuthor } = req.body);
      await bookService.updateBook(id, book);
      const updateBook = await bookService.getBook(id);
      res.json({ data: updateBook });
    } catch (error) {
      next(error);
    }
  },
  /**
   * Xóa sách
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  deleteBook: async (req, res, next) => {
    try {
      const id = req.params.id;
      const book = await bookService.getBook(id);
      if (book) {
        await bookService.deleteBook(book);
        res.json({ data: book });
      } else {
        res.status(404).json("Không tìm thấy sách");
      }
    } catch (error) {
      next(error);
    }
  },
});
