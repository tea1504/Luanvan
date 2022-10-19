import Strings from 'src/constants/strings'

export default [
  {
    name: '#',
    selector: (row, index) => index + 1,
    maxWidth: '100px',
    right: true,
  },
  {
    name: Strings.Form.FieldName.NAME(Strings.Organization.NAME),
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.CODE(Strings.Organization.NAME),
    selector: (row) => row.code,
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.EMAIL_ADDRESS(Strings.Organization.NAME),
    selector: (row) => row.emailAddress,
    sortable: true,
  },
  {
    name: Strings.Form.FieldName.PHONE_NUMBER(Strings.Organization.NAME),
    selector: (row) => row.phoneNumber,
    sortable: true,
  },
]
