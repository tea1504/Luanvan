import { CButton, CTooltip } from '@coreui/react'
import React from 'react'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cibReadTheDocs, cilDelete, cilSettings } from '@coreui/icons'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Strings from 'src/constants/strings'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Screens from 'src/constants/screens'
import BookService from 'src/services/book.service'
import { useDispatch } from 'react-redux'
import { setData } from './../../store/slice/book.slide'

const bookService = new BookService()

const ActionButton = ({ data }) => {
  const MySwal = withReactContent(Swal)
  const loggedUser = useSelector((state) => state.user.user)
  const listBooks = useSelector((state) => state.book)
  const language = useSelector((state) => state.config.language)
  Strings.setLanguage(language)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const getBooks = async () => {
    try {
      const result = await bookService.getBooks(listBooks.rowsPerPage, listBooks.page)
      dispatch(setData(result.data.data))
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteButton = () => {
    MySwal.fire({
      title: Strings.Delete.TITLE,
      icon: 'info',
      text: Strings.Delete.MESSAGE,
      showCancelButton: true,
      cancelButtonText: Strings.Common.CANCEL,
      confirmButtonText: Strings.Common.OK,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await bookService.deleteBook(data._id)
        await getBooks()
        return MySwal.fire({
          title: Strings.Delete.TITLE,
          icon: 'success',
          text: Strings.Delete.SUCCESS,
        })
      } else
        return MySwal.fire({
          title: Strings.Delete.TITLE,
          icon: 'warning',
          text: Strings.Delete.CANCEL,
        })
    })
  }

  return (
    <div>
      <CTooltip content={Strings.Common.DETAIL}>
        <CButton
          color="info"
          className="m-1"
          onClick={() => navigate(Screens.BOOK_DETAIL(data._id))}
        >
          <CIcon icon={cibReadTheDocs} className="text-white" />
        </CButton>
      </CTooltip>
      {[1].includes(loggedUser.userRole) && (
        <CTooltip content={Strings.Common.EDIT}>
          <CButton
            color="warning"
            className="m-1"
            onClick={() => navigate(Screens.BOOK_UPDATE(data._id))}
          >
            <CIcon icon={cilSettings} />
          </CButton>
        </CTooltip>
      )}
      {[1].includes(loggedUser.userRole) && (
        <CTooltip content={Strings.Common.DELETE}>
          <CButton color="danger" className="m-1" onClick={handleDeleteButton}>
            <CIcon icon={cilDelete} />
          </CButton>
        </CTooltip>
      )}
    </div>
  )
}

ActionButton.prototype = {
  data: PropTypes.object.isRequired,
}

export default ActionButton
