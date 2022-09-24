import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import BookService from 'src/services/book.service'

const bookService = new BookService()

function BookDetail() {
  const idBook = useParams().id
  const listBooks = useSelector((state) => state.book.data)
  const [book, setBook] = useState({ _id: null, bookId: null, bookTitle: null, bookAuthor: null })
  const updateBook = (newState) => {
    setBook((prevState) => ({
      ...prevState,
      ...newState,
    }))
  }
  const getBook = async (id) => {
    if (listBooks.length > 0) {
      const book = listBooks.find((el) => el._id === id)
      if (!book) getBookFromServer(id)
      else {
        updateBook(book)
      }
    } else {
      await getBookFromServer(id)
    }
  }

  const getBookFromServer = async (id) => {
    const result = await bookService.getBook(id)
    updateBook(result.data.data)
  }

  useEffect(() => {
    getBook(idBook)
  }, [])

  return <div>{JSON.stringify(book)}</div>
}

export default BookDetail
