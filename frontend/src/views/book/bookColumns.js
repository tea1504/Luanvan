import React from 'react'
import Strings from 'src/constants/strings'
import ActionButton from './ActionButton'

export default [
  {
    name: '#',
    selector: (row, index) => index + 1,
    maxWidth: '100px',
    right: true,
  },
  {
    name: Strings.Book.table.header.ID,
    selector: (row) => row.bookId,
    sortable: true,
  },
  {
    name: Strings.Book.table.header.TITLE,
    selector: (row) => row.bookTitle,
    sortable: true,
  },
  {
    name: Strings.Book.table.header.AUTHOR,
    selector: (row) => row.bookAuthor,
    sortable: true,
  },
  {
    name: Strings.Common.ACTION,
    cell: (row) => <ActionButton data={row} />,
    center: true,
    maxWidth: '300px',
  },
]
