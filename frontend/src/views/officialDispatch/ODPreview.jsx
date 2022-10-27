import React from 'react'
import PropTypes from 'prop-types'
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer'

function ODPreview({ data }) {
  console.log(data);
  return (
    <object data={data} type="application/pdf" className="w-100 h-100">
      <embed src={data} type="application/pdf" />
    </object>
    // <DocViewer pluginRenderers={DocViewerRenderers} documents={[{ uri: data }]} />
  )
}

ODPreview.prototype = {
  data: PropTypes.string.isRequired,
}

export default ODPreview
