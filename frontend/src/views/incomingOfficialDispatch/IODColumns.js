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
    selector: (row) => Helpers.trimString(row.subject, 80),
    sortable: true,
    maxWidth: '500px',
  },
  {
    name: Strings.Form.FieldName.STATUS(),
    cell: (row) => {
      const traceHeaderListSorted = [...row.traceHeaderList].sort((a, b) => {
        var d1 = new Date(a.date),
          d2 = new Date(b.date)
        return d2 - d1
      })[0]
      return (
        <CBadge
          style={{
            background: traceHeaderListSorted.status.color,
            color: Helpers.getTextColorByBackgroundColor(traceHeaderListSorted.status.color),
          }}
          shape="rounded-pill"
        >
          {traceHeaderListSorted.status.name}
        </CBadge>
      )
    },
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
