import { CAvatar, CBadge, CImage } from '@coreui/react'
import React from 'react'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
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
    cell: (row) => (
      <CAvatar
        src={`${process.env.REACT_APP_BASE_URL}/${row.file.path}?token=${localStorage.getItem(
          Constants.StorageKeys.ACCESS_TOKEN,
        )}`}
        shape="rounded"
        size="lg"
      />
    ),
    center: true,
  },
  {
    name: Strings.Form.FieldName.CODE(Strings.Officer.NAME),
    selector: (row) => row.code,
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.NAME(Strings.Officer.NAME),
    selector: (row) => `${row.lastName} ${row.firstName}`,
    sortable: true,
  },
  {
    name: Strings.Organization.NAME,
    selector: (row) => row.organ.name,
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.POSITION(Strings.Officer.NAME),
    selector: (row) => row.position,
    sortable: true,
  },
  {
    name: Strings.OfficerStatus.NAME,
    cell: (row) => (
      <CBadge
        style={{
          background: row.status.color,
          color: Helpers.getTextColorByBackgroundColor(row.status.color),
        }}
        shape="rounded-pill"
      >
        {row.status.name}
      </CBadge>
    ),
    sortable: true,
  },
  {
    name: Strings.Right.NAME,
    selector: (row) => row.right.name,
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
