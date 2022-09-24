import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import BookService from 'src/services/book.service'

const bookService = new BookService()

function BookCreateOrEdit() {
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
    if (idBook) getBook(idBook)
  }, [])

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    if (idBook) {
      await bookService.updateBook(book._id, book)
    } else {
      await bookService.createBook(book)
    }
  }

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader className="text-center" component="h3">
              Nhập thông tin sách
            </CCardHeader>
            <CCardBody>
              <CForm>
                <CFormLabel htmlFor="bookId">Mã sách</CFormLabel>
                <CFormInput
                  type="text"
                  id="bookId"
                  placeholder="Mã sách"
                  text="text"
                  value={book.bookId}
                  onChange={(e) => updateBook({ bookId: e.target.value })}
                />
                <CFormLabel htmlFor="bookTitle">Tên sách</CFormLabel>
                <CFormInput
                  type="text"
                  id="bookTitle"
                  placeholder="Tên sách"
                  text="text"
                  value={book.bookTitle}
                  onChange={(e) => updateBook({ bookTitle: e.target.value })}
                />
                <CFormLabel htmlFor="bookAuthor">Tác giả</CFormLabel>
                <CFormInput
                  type="text"
                  id="bookAuthor"
                  placeholder="Tác giả"
                  text="text"
                  value={book.bookAuthor}
                  onChange={(e) => updateBook({ bookAuthor: e.target.value })}
                />
                <CButton onClick={handleSubmitForm}>Gửi</CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default BookCreateOrEdit
