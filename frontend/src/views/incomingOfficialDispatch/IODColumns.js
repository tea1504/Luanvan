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
    name: Strings.Form.FieldName.ARRIVAL_DATE,
    selector: (row) =>
      Helpers.formatDateFromString(row.arrivalDate, {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric',
      }),
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.ISSUED_DATE(),
    selector: (row) =>
      Helpers.formatDateFromString(row.issuedDate, {
        year: 'numeric',
        month: '2-digit',
        day: 'numeric',
      }),
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.ARRIVAL_NUMBER,
    selector: (row) => row.arrivalNumber,
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.CODE(),
    selector: (row) => `${row.code}/${row.organ.code}-${row.type.notation}`,
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.SUBJECT(),
    selector: (row) => row.subject,
    sortable: true,
    maxWidth: '500px',
  },
  {
    name: Strings.Common.ACTION,
    cell: (row) => <ActionButton data={row} />,
    center: true,
    maxWidth: '300px',
    minWidth: '200px',
  },
]
