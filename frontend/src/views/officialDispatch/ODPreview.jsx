import React from 'react'
import PropTypes from 'prop-types'
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer'

function ODPreview({ link }) {
  return (
    // <object data={link} type="application/pdf" className="w-100 h-100">
    //   <embed src={link} type="application/pdf" />
    // </object>
    // <iframe
    //   src={`https://docs.google.com/gview?url=${link}&embedded=true`}
    // ></iframe>
    // <iframe
    //   src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(link)}`}
    //   width="100%"
    //   height="100%"
    // ></iframe>
    <DocViewer pluginRenderers={DocViewerRenderers} documents={[{ uri: link }]} />
  )
}

ODPreview.prototype = {
  data: PropTypes.string.isRequired,
}

export default ODPreview
