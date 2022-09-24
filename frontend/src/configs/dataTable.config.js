export default {
  props: {
    pagination: true,
    paginationComponentOptions: {
      rowsPerPageText: 'Số dòng mỗi trang:',
      rangeSeparatorText: 'trong',
    },
    fixedHeader: true,
    fixedHeaderScrollHeight: '65vh',
    highlightOnHover: true,
    customStyles: {
      headRow: {
        style: {
          backgroundColor: '#3c4b64',
        },
      },
      head: {
        style: {
          color: '#ffffff',
        },
      },
      headCells: {
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
        },
      },
      cells: {
        style: {
          fontSize: '16px',
        },
      },
      rows: {
        highlightOnHoverStyle: {
          backgroundColor: '#6a84af!important',
          borderBottomColor: '#FFFFFF',
          outline: '1px solid #FFFFFF',
          color: '#ffffff',
        },
      },
      pagination: {
        pageButtonsStyle: {
          borderRadius: '0%',
        },
      },
    },
    paginationServer: true,
    paginationRowsPerPageOptions: [5, 10, 15, 20, 25],
  },
}
