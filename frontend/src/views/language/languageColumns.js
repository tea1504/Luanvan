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
    name: Strings.Language.table.NAME,
    selector: (row) => row.name,
    sortable: true,
    maxWidth: '300px',
  },
  {
    name: Strings.Language.table.NOTATION,
    selector: (row) => row.notation,
    sortable: true,
    width: '150px',
  },
  {
    name: Strings.Language.table.DESCRIPTION,
    selector: (row) => row.description,
    sortable: true,
    cell: (row) => (
      <div title={row.description}>
        {Helpers.trimString(Helpers.htmlDecode(row.description), 80)}
      </div>
    ),
  },
  {
    name: Strings.Type.table.COLOR,
    selector: (row) => row.color,
    sortable: true,
    center: true,
    cell: (row) => <div style={{ backgroundColor: row.color }} className="h-100 w-100"></div>,
    width: '150px',
  },
  {
    name: Strings.Common.ACTION,
    cell: (row) => <ActionButton data={row} />,
    center: true,
    maxWidth: '300px',
    minWidth: '200px',
  },
]
