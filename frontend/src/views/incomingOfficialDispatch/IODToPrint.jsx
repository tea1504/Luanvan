import { CContainer } from '@coreui/react'
import React from 'react'

export const IODToPrint = React.forwardRef(function IODToPrint(props, ref) {
  const { data } = props
  return (
    <div ref={ref}>
      <CContainer>{JSON.stringify(data)}</CContainer>
    </div>
  )
})
