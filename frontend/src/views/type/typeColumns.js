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
    name: Strings.Form.FieldName.NAME(Strings.Type.NAME),
    selector: (row) => row.name,
    sortable: true,
    maxWidth: '300px',
  },
  {
    name: Strings.Form.FieldName.NOTATION(Strings.Type.NAME),
    selector: (row) => row.notation,
    sortable: true,
    width: '150px',
  },
  {
    name: Strings.Form.FieldName.DESCRIPTION(Strings.Type.NAME),
    selector: (row) => row.description,
    sortable: true,
    cell: (row) => (
      <div title={row.description}>
        {Helpers.trimString(Helpers.htmlDecode(row.description), 80)}
      </div>
    ),
  },
  {
    name: Strings.Form.FieldName.COLOR(Strings.Type.NAME),
    selector: (row) => row.color,
    sortable: true,
    center: true,
    cell: (row) => <div style={{ backgroundColor: row.color }} className="h-100 w-100"></div>,
    width: '150px',
  },
  // {
  //   name: Strings.Type.table.CREATED_AT,
  //   selector: (row) => Helpers.formatDateFromString(row.createdAt),
  //   sortable: true,
  // },
  // {
  //   name: Strings.Type.table.UPDATED_AT,
  //   selector: (row) => Helpers.formatDateFromString(row.updatedAt),
  //   sortable: true,
  // },
  {
    name: Strings.Common.ACTION,
    cell: (row) => <ActionButton data={row} />,
    center: true,
    maxWidth: '300px',
    minWidth: '200px',
  },
]
