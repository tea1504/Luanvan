import React from 'react'
import PropTypes from 'prop-types'
import { FaInfoCircle } from 'react-icons/fa'
import { CTooltip } from '@coreui/react'

const Required = ({ mes = '' }) => {
  return (
    <CTooltip content={mes}>
      <span>
        <FaInfoCircle style={{ color: '#E55353' }} />
      </span>
    </CTooltip>
  )
}

Required.prototype = {
  data: PropTypes.string,
}

export default Required
