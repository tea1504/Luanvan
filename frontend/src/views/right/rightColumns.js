import { CFormCheck, CTooltip } from '@coreui/react'
import React from 'react'
import { FaCheckCircle, FaCheckSquare, FaTimesCircle, FaXRay } from 'react-icons/fa'
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
    name: Strings.Form.FieldName.NAME(Strings.Right.NAME),
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: Strings.Common.R_OD,
    sortable: true,
    cell: (row) => (
      <div>
        <CTooltip content={Strings.Form.FieldName.READ_OD}>
          <span className="mx-1">
            {row.readOD ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
        <CTooltip content={Strings.Form.FieldName.CREATE_OD}>
          <span className="mx-1">
            {row.createOD ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
        <CTooltip content={Strings.Form.FieldName.UPDATE_OD}>
          <span className="mx-1">
            {row.updateOD ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
        <CTooltip content={Strings.Form.FieldName.DELETE_OD}>
          <span className="mx-1">
            {row.deleteOD ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
        <CTooltip content={Strings.Form.FieldName.APPROVE_OD}>
          <span className="mx-1">
            {row.approveOD ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
      </div>
    ),
    center: true,
  },
  {
    name: Strings.Common.R_RIGHT,
    sortable: true,
    cell: (row) => (
      <div>
        <CTooltip content={Strings.Form.FieldName.READ_RIGHT}>
          <span className="mx-1">
            {row.readRight ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
        <CTooltip content={Strings.Form.FieldName.CREATE_RIGHT}>
          <span className="mx-1">
            {row.createRight ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
        <CTooltip content={Strings.Form.FieldName.UPDATE_RIGHT}>
          <span className="mx-1">
            {row.updateRight ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
        <CTooltip content={Strings.Form.FieldName.DELETE_RIGHT}>
          <span className="mx-1">
            {row.deleteRight ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
      </div>
    ),
    center: true,
  },
  {
    name: Strings.Common.R_OFFICER,
    sortable: true,
    cell: (row) => (
      <div>
        <CTooltip content={Strings.Form.FieldName.READ_OFFICER}>
          <span className="mx-1">
            {row.readOfficer ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
        <CTooltip content={Strings.Form.FieldName.CREATE_OFFICER}>
          <span className="mx-1">
            {row.createOfficer ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
        <CTooltip content={Strings.Form.FieldName.UPDATE_OFFICER}>
          <span className="mx-1">
            {row.updateOfficer ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
        <CTooltip content={Strings.Form.FieldName.DELETE_OFFICER}>
          <span className="mx-1">
            {row.deleteOfficer ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
      </div>
    ),
    center: true,
  },
  {
    name: Strings.Common.R_CATEGORY,
    sortable: true,
    cell: (row) => (
      <div>
        <CTooltip content={Strings.Form.FieldName.READ_CATEGORIES}>
          <span className="mx-1">
            {row.readCategories ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
        <CTooltip content={Strings.Form.FieldName.CREATE_CATEGORIES}>
          <span className="mx-1">
            {row.createCategories ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
        <CTooltip content={Strings.Form.FieldName.UPDATE_CATEGORIES}>
          <span className="mx-1">
            {row.updateCategories ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
        <CTooltip content={Strings.Form.FieldName.DELETE_CATEGORIES}>
          <span className="mx-1">
            {row.deleteCategories ? (
              <FaCheckCircle className="text-success" size="1.5rem" />
            ) : (
              <FaTimesCircle className="text-danger" size="1.5rem" />
            )}
          </span>
        </CTooltip>
      </div>
    ),
    center: true,
  },
  {
    name: Strings.Form.FieldName.SCOPE,
    cell: (row) => row.scope,
    center: true,
    maxWidth: '300px',
    minWidth: '200px',
  },
  {
    name: Strings.Common.ACTION,
    cell: (row) => <ActionButton data={row} />,
    center: true,
    maxWidth: '300px',
    minWidth: '200px',
  },
]
