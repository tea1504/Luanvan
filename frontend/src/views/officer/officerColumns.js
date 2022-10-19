import React from 'react'
import Helpers from 'src/commons/helpers'
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
    name: Strings.Form.FieldName.NAME(Strings.Officer.NAME),
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.CODE(Strings.Officer.NAME),
    selector: (row) => row.code,
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.EMAIL_ADDRESS(Strings.Officer.NAME),
    selector: (row) => row.emailAddress,
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.PHONE_NUMBER(Strings.Officer.NAME),
    selector: (row) => row.phoneNumber,
    sortable: true,
  },
  {
    name: Strings.Common.ACTION,
    cell: (row) => <ActionButton data={row} />,
    center: true,
    maxWidth: '300px',
    minWidth: '200px',
  },
]
