import { CBadge } from '@coreui/react'
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
    selector: (row) =>
      Helpers.getMaVanBan(
        row.code,
        row.organ.code,
        row.type.notation,
        row.issuedDate,
        localStorage.getItem(Constants.StorageKeys.FORMAT_CODE_OD),
      ),
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.SUBJECT(),
    cell: (row) => (
      <div title={row.subject}>{Helpers.trimString(Helpers.htmlDecode(row.subject), 80)}</div>
    ),
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.ORGANIZATION_IOD,
    selector: (row) => row.organ.name,
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.STATUS(),
    cell: (row) => {
      return (
        <CBadge
          style={{
            background: row.status.color,
            color: Helpers.getTextColorByBackgroundColor(row.status.color),
          }}
          shape="rounded-pill"
        >
          {Helpers.htmlDecode(row.status.description)}
        </CBadge>
      )
    },
    sortable: true,
  },
  {
    name: Strings.Common.ACTION,
    cell: (row) => <ActionButton data={row} />,
    // center: true,
    maxWidth: '300px',
    minWidth: '200px',
  },
]
