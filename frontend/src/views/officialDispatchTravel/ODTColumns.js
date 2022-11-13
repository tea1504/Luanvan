import { CBadge, CTooltip } from '@coreui/react'
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
    name: Strings.Form.FieldName.ISSUED_DATE(),
    selector: (row) =>
      Helpers.formatDateFromString(row.issuedDate, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.CODE(),
    cell: (row) => row.code,
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.ISSUED_AMOUNT(),
    cell: (row) => row.issuedAmount,
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.SUBJECT(),
    cell: (row) => row.subject,
    sortable: true,
    minWidth: '300px',
  },
  {
    name: Strings.Form.FieldName.ORGANIZATION_ODT,
    cell: (row) => (
      <div>
        {row.organ.map((el, ind) => (
          <CTooltip key={ind} content={el.name}>
            <CBadge color="info" className="m-1">
              {el.code}
            </CBadge>
          </CTooltip>
        ))}
      </div>
    ),
    sortable: true,
    minWidth: '500px',
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
