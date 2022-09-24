export default [
  {
    when: (row) => row.bookId < 5,
    style: {
      backgroundColor: 'green',
      color: 'white',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  // You can also pass a callback to style for additional customization
  {
    when: (row) => row.bookId > 4 && row.bookId < 7,
    style: (row) => ({ backgroundColor: row.bookTitle.includes('Hoa') ? 'pink' : 'inerit' }),
  },
]
