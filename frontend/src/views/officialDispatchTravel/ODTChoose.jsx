import {
  CFormCheck,
  CImage,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Helpers from 'src/commons/helpers'
import Constants from 'src/constants'
import Strings from 'src/constants/strings'

export default function ODTChoose({ predict, updateData }) {
  let loggedUser = useSelector((state) => state.user.user)
  if (Helpers.isObjectEmpty(loggedUser))
    loggedUser = JSON.parse(localStorage.getItem(Constants.StorageKeys.USER_INFO))
  let token = useSelector((state) => state.user.token)
  if (Helpers.isNullOrEmpty(token)) token = localStorage.getItem(Constants.StorageKeys.ACCESS_TOKEN)

  const [checkedList, setCheckedList] = useState({
    code: !Helpers.isNullOrEmpty(predict.code),
    issuedDate: !Helpers.isNullOrEmpty(predict.issuedDate),
    subject: !Helpers.isNullOrEmpty(predict.subject),
    subjectFromCode: !Helpers.isNullOrEmpty(predict.subject)
      ? false
      : !Helpers.isNullOrEmpty(predict.subjectFromCode),
    typeFromCode: !Helpers.isNullOrEmpty(predict.typeFromCode),
    typeFromName: !Helpers.isNullOrEmpty(predict.typeFromCode)
      ? false
      : !Helpers.isNullOrEmpty(predict.typeFromName),
    organFromCode: !Helpers.isNullOrEmpty(predict.organFromCode),
    organFromName: !Helpers.isNullOrEmpty(predict.organFromCode)
      ? false
      : !Helpers.isNullOrEmpty(predict.organFromName),
    signerInfoPosition: !Helpers.isNullOrEmpty(predict.signerInfoPosition),
    signerInfoName: !Helpers.isNullOrEmpty(predict.signerInfoName),
  })
  const updateCheckedList = (newState) =>
    setCheckedList((prevState) => ({ ...prevState, ...newState }))

  const handleOnChangeCodeCheckedList = () => {
    updateCheckedList({ code: !checkedList.code })
    if (!checkedList.code) {
      updateData({ code: predict.code })
    } else {
      updateData({ code: '' })
    }
  }

  const handleOnChangeIssuedDateCheckedList = () => {
    updateCheckedList({ issuedDate: !checkedList.issuedDate })
    if (!checkedList.issuedDate) {
      updateData({ issuedDate: predict.issuedDate })
    } else {
      updateData({ issuedDate: '' })
    }
  }

  const handleOnChangeSubjectCheckedList = () => {
    updateCheckedList({ subject: !checkedList.subject })
    if (!checkedList.subject) {
      updateData({ subject: predict.subject })
      updateCheckedList({ subjectFromCode: checkedList.subject })
    } else {
      updateData({ subject: '' })
    }
  }

  const handleOnChangeSubjectFromCodeCheckedList = () => {
    updateCheckedList({ subjectFromCode: !checkedList.subjectFromCode })
    if (!checkedList.subjectFromCode) {
      updateData({ subject: predict.subjectFromCode })
      updateCheckedList({ subject: checkedList.subjectFromCode })
    } else {
      updateData({ subject: '' })
    }
  }

  const handleOnChangeTypeFromCodeCheckedList = () => {
    updateCheckedList({ typeFromCode: !checkedList.typeFromCode })
    if (!checkedList.typeFromCode) {
      updateData({ type: predict.typeFromCode ? predict.typeFromCode._id : null })
      updateCheckedList({ typeFromName: checkedList.typeFromCode })
    } else {
      updateData({ type: null })
    }
  }

  const handleOnChangeTypeFromNamCheckedList = () => {
    updateCheckedList({ typeFromName: !checkedList.typeFromName })
    if (!checkedList.typeFromName) {
      updateData({ type: predict.typeFromName ? predict.typeFromName._id : null })
      updateCheckedList({ typeFromCode: checkedList.typeFromName })
    } else {
      updateData({ type: null })
    }
  }

  const handleOnChangeOrganFromCodeCheckedList = () => {
    updateCheckedList({ organFromCode: !checkedList.organFromCode })
    if (!checkedList.organFromCode) {
      updateData({ organ: predict.organFromCode ? predict.organFromCode._id : null })
      updateCheckedList({ organFromName: checkedList.organFromCode })
    } else {
      updateData({ organ: null })
    }
  }

  const handleOnChangeOrganFromNameCheckedList = () => {
    updateCheckedList({ organFromName: !checkedList.organFromName })
    if (!checkedList.organFromName) {
      updateData({ organ: predict.organFromName ? predict.organFromName._id : null })
      updateCheckedList({ organFromCode: checkedList.organFromName })
    } else {
      updateData({ organ: null })
    }
  }

  const handleOnChangeSignerInfoPositionCheckedList = () => {
    updateCheckedList({ signerInfoPosition: !checkedList.signerInfoPosition })
    if (!checkedList.signerInfoPosition) {
      updateData({ signerInfoPosition: predict.signerInfoPosition })
    } else {
      updateData({ signerInfoPosition: '' })
    }
  }

  const handleOnChangeSignerInfoNameCheckedList = () => {
    updateCheckedList({ signerInfoName: !checkedList.signerInfoName })
    if (!checkedList.signerInfoName) {
      updateData({ signerInfoName: predict.signerInfoName })
    } else {
      updateData({ signerInfoName: '' })
    }
  }

  useEffect(() => {
    if (checkedList.code) updateData({ code: predict.code })
    if (checkedList.issuedDate) updateData({ issuedDate: predict.issuedDate })
    if (checkedList.subjectFromCode) updateData({ subject: predict.subjectFromCode })
    if (checkedList.subject) updateData({ subject: predict.subject })
    if (checkedList.typeFromName) updateData({ type: predict.typeFromName._id })
    if (checkedList.typeFromCode) updateData({ type: predict.typeFromCode._id })
    if (checkedList.organFromName) updateData({ organ: predict.organFromName._id })
    if (checkedList.organFromCode) updateData({ organ: predict.organFromCode._id })
    if (checkedList.signerInfoPosition)
      updateData({ signerInfoPosition: predict.signerInfoPosition })
    if (checkedList.signerInfoName) updateData({ signerInfoName: predict.signerInfoName })
  }, [])

  return (
    <CTable small bordered className="align-middle">
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell className="text-center">Thành phần</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Hình ảnh</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Phần nhận dạng được</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Dự đoán</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Ghi chú</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Chọn</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {/* code */}
        <CTableRow>
          <CTableDataCell
            rowSpan={predict.predict.code.length === 0 ? 1 : predict.predict.code.length}
          >
            {Strings.Form.FieldName.CODE()}
          </CTableDataCell>
          <CTableDataCell className="text-center">
            {predict.predict.code.length !== 0 ? (
              <CImage
                src={`${process.env.REACT_APP_BASE_URL}/${predict.predict.code[0].link}?token=${token}`}
                width={500}
                thumbnail
              />
            ) : (
              <span>Không tìm thấy</span>
            )}
          </CTableDataCell>
          <CTableDataCell>
            {predict.predict.code.length !== 0
              ? predict.predict.code[0].ocr
              : 'Không nhận dạng được'}
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={predict.predict.code.length === 0 ? 1 : predict.predict.code.length}
          >
            {predict.code}
          </CTableDataCell>
          <CTableDataCell
            rowSpan={predict.predict.code.length === 0 ? 1 : predict.predict.code.length}
          ></CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={predict.predict.code.length === 0 ? 1 : predict.predict.code.length}
          >
            <CFormCheck checked={checkedList.code} onChange={handleOnChangeCodeCheckedList} />
          </CTableDataCell>
        </CTableRow>
        {predict.predict.code.map((el, ind) => {
          if (ind !== 0)
            return (
              <CTableRow key={ind}>
                <CTableDataCell className="text-center">
                  <CImage
                    src={`${process.env.REACT_APP_BASE_URL}/${el.link}?token=${token}`}
                    width={500}
                    thumbnail
                  />
                </CTableDataCell>
                <CTableDataCell>{el.ocr}</CTableDataCell>
              </CTableRow>
            )
        })}
        {/* issuedDate */}
        <CTableRow>
          <CTableDataCell
            rowSpan={
              predict.predict.issuedDate.length === 0 ? 1 : predict.predict.issuedDate.length
            }
          >
            {Strings.Form.FieldName.ISSUED_DATE()}
          </CTableDataCell>
          <CTableDataCell className="text-center">
            {predict.predict.issuedDate.length !== 0 ? (
              <CImage
                src={`${process.env.REACT_APP_BASE_URL}/${predict.predict.issuedDate[0].link}?token=${token}`}
                width={500}
                thumbnail
              />
            ) : (
              <span>Không tìm thấy</span>
            )}
          </CTableDataCell>
          <CTableDataCell>
            {predict.predict.issuedDate.length !== 0
              ? predict.predict.issuedDate[0].ocr
              : 'Không nhận dạng được'}
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.issuedDate.length === 0 ? 1 : predict.predict.issuedDate.length
            }
          >
            {Helpers.formatDateFromString(predict.issuedDate, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </CTableDataCell>
          <CTableDataCell
            rowSpan={
              predict.predict.issuedDate.length === 0 ? 1 : predict.predict.issuedDate.length
            }
          ></CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.issuedDate.length === 0 ? 1 : predict.predict.issuedDate.length
            }
          >
            <CFormCheck
              checked={checkedList.issuedDate}
              onChange={handleOnChangeIssuedDateCheckedList}
            />
          </CTableDataCell>
        </CTableRow>
        {predict.predict.issuedDate.map((el, ind) => {
          if (ind !== 0)
            return (
              <CTableRow key={ind}>
                <CTableDataCell className="text-center">
                  <CImage
                    src={`${process.env.REACT_APP_BASE_URL}/${el.link}?token=${token}`}
                    width={500}
                    thumbnail
                  />
                </CTableDataCell>
                <CTableDataCell>{el.ocr}</CTableDataCell>
              </CTableRow>
            )
        })}
        {/* subject */}
        <CTableRow>
          <CTableDataCell
            rowSpan={
              (predict.predict.subject.length === 0 ? 1 : predict.predict.subject.length) +
              (predict.predict.subjectFromCode.length === 0
                ? 1
                : predict.predict.subjectFromCode.length)
            }
          >
            {Strings.Form.FieldName.SUBJECT()}
          </CTableDataCell>
          <CTableDataCell className="text-center">
            {predict.predict.subject.length !== 0 ? (
              <CImage
                src={`${process.env.REACT_APP_BASE_URL}/${predict.predict.subject[0].link}?token=${token}`}
                width={500}
                thumbnail
              />
            ) : (
              <span>Không tìm thấy</span>
            )}
          </CTableDataCell>
          <CTableDataCell>
            {predict.predict.subject.length !== 0
              ? predict.predict.subject[0].ocr
              : 'Không nhận dạng được'}
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={predict.predict.subject.length === 0 ? 1 : predict.predict.subject.length}
          >
            {predict.subject}
          </CTableDataCell>
          <CTableDataCell
            rowSpan={predict.predict.subject.length === 0 ? 1 : predict.predict.subject.length}
          >
            Dữ liệu nhận dạng trên thân văn bản
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={predict.predict.subject.length === 0 ? 1 : predict.predict.subject.length}
          >
            <CFormCheck checked={checkedList.subject} onChange={handleOnChangeSubjectCheckedList} />
          </CTableDataCell>
        </CTableRow>
        {predict.predict.subject.map((el, ind) => {
          if (ind !== 0)
            return (
              <CTableRow key={ind}>
                <CTableDataCell className="text-center">
                  <CImage
                    src={`${process.env.REACT_APP_BASE_URL}/${el.link}?token=${token}`}
                    width={500}
                    thumbnail
                  />
                </CTableDataCell>
                <CTableDataCell>{el.ocr}</CTableDataCell>
              </CTableRow>
            )
        })}
        {/* subject from code */}
        <CTableRow>
          <CTableDataCell className="text-center">
            {predict.predict.subjectFromCode.length !== 0 ? (
              <CImage
                src={`${process.env.REACT_APP_BASE_URL}/${predict.predict.subjectFromCode[0].link}?token=${token}`}
                width={500}
                thumbnail
              />
            ) : (
              <span>Không tìm thấy</span>
            )}
          </CTableDataCell>
          <CTableDataCell>
            {predict.predict.subjectFromCode.length !== 0
              ? predict.predict.subjectFromCode[0].ocr
              : 'Không nhận dạng được'}
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.subjectFromCode.length === 0
                ? 1
                : predict.predict.subjectFromCode.length
            }
          >
            {predict.subjectFromCode}
          </CTableDataCell>
          <CTableDataCell
            rowSpan={
              predict.predict.subjectFromCode.length === 0
                ? 1
                : predict.predict.subjectFromCode.length
            }
          >
            Dữ liệu nhận dạng từ vị trí mã số
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.subjectFromCode.length === 0
                ? 1
                : predict.predict.subjectFromCode.length
            }
          >
            <CFormCheck
              checked={checkedList.subjectFromCode}
              onChange={handleOnChangeSubjectFromCodeCheckedList}
            />
          </CTableDataCell>
        </CTableRow>
        {predict.predict.subjectFromCode.map((el, ind) => {
          if (ind !== 0)
            return (
              <CTableRow key={ind}>
                <CTableDataCell className="text-center">
                  <CImage
                    src={`${process.env.REACT_APP_BASE_URL}/${el.link}?token=${token}`}
                    width={500}
                    thumbnail
                  />
                </CTableDataCell>
                <CTableDataCell>{el.ocr}</CTableDataCell>
              </CTableRow>
            )
        })}
        {/* type */}
        <CTableRow>
          <CTableDataCell
            rowSpan={
              (predict.predict.typeFromName.length === 0
                ? 1
                : predict.predict.typeFromName.length) +
              (predict.predict.typeFromCode.length === 0 ? 1 : predict.predict.typeFromCode.length)
            }
          >
            {Strings.Form.FieldName.TYPE()}
          </CTableDataCell>
          <CTableDataCell className="text-center">
            {predict.predict.typeFromName.length !== 0 ? (
              <CImage
                src={`${process.env.REACT_APP_BASE_URL}/${predict.predict.typeFromName[0].link}?token=${token}`}
                width={500}
                thumbnail
              />
            ) : (
              <span>Không tìm thấy</span>
            )}
          </CTableDataCell>
          <CTableDataCell>
            {predict.predict.typeFromName.length !== 0
              ? predict.predict.typeFromName[0].ocr
              : 'Không nhận dạng được'}
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.typeFromName.length === 0 ? 1 : predict.predict.typeFromName.length
            }
          >
            {predict.typeFromName?.name}
          </CTableDataCell>
          <CTableDataCell
            rowSpan={
              predict.predict.typeFromName.length === 0 ? 1 : predict.predict.typeFromName.length
            }
          >
            Dữ liệu nhận dạng trên thân văn bản
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.typeFromName.length === 0 ? 1 : predict.predict.typeFromName.length
            }
          >
            <CFormCheck
              checked={checkedList.typeFromName}
              onChange={handleOnChangeTypeFromNamCheckedList}
            />
          </CTableDataCell>
        </CTableRow>
        {predict.predict.typeFromName.map((el, ind) => {
          if (ind !== 0)
            return (
              <CTableRow key={ind}>
                <CTableDataCell className="text-center">
                  <CImage
                    src={`${process.env.REACT_APP_BASE_URL}/${el.link}?token=${token}`}
                    width={500}
                    thumbnail
                  />
                </CTableDataCell>
                <CTableDataCell>{el.ocr}</CTableDataCell>
              </CTableRow>
            )
        })}
        {/* type from code */}
        <CTableRow>
          <CTableDataCell className="text-center">
            {predict.predict.typeFromCode.length !== 0 ? (
              <CImage
                src={`${process.env.REACT_APP_BASE_URL}/${predict.predict.typeFromCode[0].link}?token=${token}`}
                width={500}
                thumbnail
              />
            ) : (
              <span>Không tìm thấy</span>
            )}
          </CTableDataCell>
          <CTableDataCell>
            {predict.predict.typeFromCode.length !== 0
              ? predict.predict.typeFromCode[0].ocr
              : 'Không nhận dạng được'}
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.typeFromCode.length === 0 ? 1 : predict.predict.typeFromCode.length
            }
          >
            {predict.typeFromCode?.name}
          </CTableDataCell>
          <CTableDataCell
            rowSpan={
              predict.predict.typeFromCode.length === 0 ? 1 : predict.predict.typeFromCode.length
            }
          >
            Dữ liệu nhận dạng từ mã số
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.typeFromCode.length === 0 ? 1 : predict.predict.typeFromCode.length
            }
          >
            <CFormCheck
              checked={checkedList.typeFromCode}
              onChange={handleOnChangeTypeFromCodeCheckedList}
            />
          </CTableDataCell>
        </CTableRow>
        {predict.predict.typeFromCode.map((el, ind) => {
          if (ind !== 0)
            return (
              <CTableRow key={ind}>
                <CTableDataCell className="text-center">
                  <CImage
                    src={`${process.env.REACT_APP_BASE_URL}/${el.link}?token=${token}`}
                    width={500}
                    thumbnail
                  />
                </CTableDataCell>
                <CTableDataCell>{el.ocr}</CTableDataCell>
              </CTableRow>
            )
        })}
        {/* organization */}
        <CTableRow>
          <CTableDataCell
            rowSpan={
              (predict.predict.organFromName.length === 0
                ? 1
                : predict.predict.organFromName.length) +
              (predict.predict.typeFromCode.length === 0 ? 1 : predict.predict.typeFromCode.length)
            }
          >
            {Strings.Form.FieldName.ORGANIZATION}
          </CTableDataCell>
          <CTableDataCell className="text-center">
            {predict.predict.organFromName.length !== 0 ? (
              <CImage
                src={`${process.env.REACT_APP_BASE_URL}/${predict.predict.organFromName[0].link}?token=${token}`}
                width={500}
                thumbnail
              />
            ) : (
              <span>Không tìm thấy</span>
            )}
          </CTableDataCell>
          <CTableDataCell>
            {predict.predict.organFromName.length !== 0
              ? predict.predict.organFromName[0].ocr
              : 'Không nhận dạng được'}
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.organFromName.length === 0 ? 1 : predict.predict.organFromName.length
            }
          >
            {predict.organFromName?.name}
          </CTableDataCell>
          <CTableDataCell
            rowSpan={
              predict.predict.organFromName.length === 0 ? 1 : predict.predict.organFromName.length
            }
          >
            Dữ liệu nhận dạng trên thân văn bản
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.organFromName.length === 0 ? 1 : predict.predict.organFromName.length
            }
          >
            <CFormCheck
              checked={checkedList.organFromName}
              onChange={handleOnChangeOrganFromNameCheckedList}
            />
          </CTableDataCell>
        </CTableRow>
        {predict.predict.organFromName.map((el, ind) => {
          if (ind !== 0)
            return (
              <CTableRow key={ind}>
                <CTableDataCell className="text-center">
                  <CImage
                    src={`${process.env.REACT_APP_BASE_URL}/${el.link}?token=${token}`}
                    width={500}
                    thumbnail
                  />
                </CTableDataCell>
                <CTableDataCell>{el.ocr}</CTableDataCell>
              </CTableRow>
            )
        })}
        {/* organization from code */}
        <CTableRow>
          <CTableDataCell className="text-center">
            {predict.predict.organFromCode.length !== 0 ? (
              <CImage
                src={`${process.env.REACT_APP_BASE_URL}/${predict.predict.organFromCode[0].link}?token=${token}`}
                width={500}
                thumbnail
              />
            ) : (
              <span>Không tìm thấy</span>
            )}
          </CTableDataCell>
          <CTableDataCell>
            {predict.predict.organFromCode.length !== 0
              ? predict.predict.organFromCode[0].ocr
              : 'Không nhận dạng được'}
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.organFromCode.length === 0 ? 1 : predict.predict.organFromCode.length
            }
          >
            {predict.organFromCode?.name}
          </CTableDataCell>
          <CTableDataCell
            rowSpan={
              predict.predict.organFromCode.length === 0 ? 1 : predict.predict.organFromCode.length
            }
          >
            Dữ liệu nhận dạng từ mã số
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.organFromCode.length === 0 ? 1 : predict.predict.organFromCode.length
            }
          >
            <CFormCheck
              checked={checkedList.organFromCode}
              onChange={handleOnChangeOrganFromCodeCheckedList}
            />
          </CTableDataCell>
        </CTableRow>
        {predict.predict.organFromCode.map((el, ind) => {
          if (ind !== 0)
            return (
              <CTableRow key={ind}>
                <CTableDataCell className="text-center">
                  <CImage
                    src={`${process.env.REACT_APP_BASE_URL}/${el.link}?token=${token}`}
                    width={500}
                    thumbnail
                  />
                </CTableDataCell>
                <CTableDataCell>{el.ocr}</CTableDataCell>
              </CTableRow>
            )
        })}
        {/* signerInfoName */}
        <CTableRow>
          <CTableDataCell
            rowSpan={
              predict.predict.signerInfoName.length === 0
                ? 1
                : predict.predict.signerInfoName.length
            }
          >
            {Strings.Form.FieldName.SIGNER_INFO_NAME()}
          </CTableDataCell>
          <CTableDataCell className="text-center">
            {predict.predict.signerInfoName.length !== 0 ? (
              <CImage
                src={`${process.env.REACT_APP_BASE_URL}/${predict.predict.signerInfoName[0].link}?token=${token}`}
                width={500}
                thumbnail
              />
            ) : (
              <span>Không tìm thấy</span>
            )}
          </CTableDataCell>
          <CTableDataCell>
            {predict.predict.signerInfoName.length !== 0
              ? predict.predict.signerInfoName[0].ocr
              : 'Không nhận dạng được'}
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.signerInfoName.length === 0
                ? 1
                : predict.predict.signerInfoName.length
            }
          >
            {predict.signerInfoName}
          </CTableDataCell>
          <CTableDataCell
            rowSpan={
              predict.predict.signerInfoName.length === 0
                ? 1
                : predict.predict.signerInfoName.length
            }
          ></CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.signerInfoName.length === 0
                ? 1
                : predict.predict.signerInfoName.length
            }
          >
            <CFormCheck
              checked={checkedList.signerInfoName}
              onChange={handleOnChangeSignerInfoNameCheckedList}
            />
          </CTableDataCell>
        </CTableRow>
        {predict.predict.signerInfoName.map((el, ind) => {
          if (ind !== 0)
            return (
              <CTableRow key={ind}>
                <CTableDataCell className="text-center">
                  <CImage
                    src={`${process.env.REACT_APP_BASE_URL}/${el.link}?token=${token}`}
                    width={500}
                    thumbnail
                  />
                </CTableDataCell>
                <CTableDataCell>{el.ocr}</CTableDataCell>
              </CTableRow>
            )
        })}
        {/* signerInfoPosition */}
        <CTableRow>
          <CTableDataCell
            rowSpan={
              predict.predict.signerInfoPosition.length === 0
                ? 1
                : predict.predict.signerInfoPosition.length
            }
          >
            {Strings.Form.FieldName.SIGNER_INFO_POSITION()}
          </CTableDataCell>
          <CTableDataCell className="text-center">
            {predict.predict.signerInfoPosition.length !== 0 ? (
              <CImage
                src={`${process.env.REACT_APP_BASE_URL}/${predict.predict.signerInfoPosition[0].link}?token=${token}`}
                width={500}
                thumbnail
              />
            ) : (
              <span>Không tìm thấy</span>
            )}
          </CTableDataCell>
          <CTableDataCell>
            {predict.predict.signerInfoPosition.length !== 0
              ? predict.predict.signerInfoPosition[0].ocr
              : 'Không nhận dạng được'}
          </CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.signerInfoPosition.length === 0
                ? 1
                : predict.predict.signerInfoPosition.length
            }
          >
            {predict.signerInfoPosition}
          </CTableDataCell>
          <CTableDataCell
            rowSpan={
              predict.predict.signerInfoPosition.length === 0
                ? 1
                : predict.predict.signerInfoPosition.length
            }
          ></CTableDataCell>
          <CTableDataCell
            className="text-center"
            rowSpan={
              predict.predict.signerInfoPosition.length === 0
                ? 1
                : predict.predict.signerInfoPosition.length
            }
          >
            <CFormCheck
              checked={checkedList.signerInfoPosition}
              onChange={handleOnChangeSignerInfoPositionCheckedList}
            />
          </CTableDataCell>
        </CTableRow>
        {predict.predict.signerInfoPosition.map((el, ind) => {
          if (ind !== 0)
            return (
              <CTableRow key={ind}>
                <CTableDataCell className="text-center">
                  <CImage
                    src={`${process.env.REACT_APP_BASE_URL}/${el.link}?token=${token}`}
                    width={500}
                    thumbnail
                  />
                </CTableDataCell>
                <CTableDataCell>{el.ocr}</CTableDataCell>
              </CTableRow>
            )
        })}
      </CTableBody>
    </CTable>
  )
}
