const Helpers = require("../../commons/helpers");
const fileData = require("./file.data");
const languageData = require("./language.data");
const officerData = require("./officer.data");
const organizationData = require("./organization.data");
const priorityData = require("./priority.data");
const rightData = require("./right.data");
const securityData = require("./security.data");
const statusData = require("./status.data");
const typeData = require("./type.data");

const ODTData = [];
let timeStart = new Date("2022-1-1");
let timeEnd = new Date();
let now = new Date();
let aYear = 31536000000;
let rightApproveOD = rightData.filter((el) => el.approveOD).map((el) => el._id);
let rightImporterOD = rightData.filter((el) => el.createOD).map((el) => el._id);
let s = [
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ",
  "Ipsum has been the industry's standard dummy text ever since the 1500s, when an ",
  "unknown printer took a galley of type",
  " and scrambled it to make a type specimen book. ",
  "It has survived not only five centuries, but also the leap into electronic ",
  "typesetting, remaining essentially unchanged. It was popularised in the 1960s with ",
  "the release of Letraset sheets containing Lorem Ipsum passages, and more recently ",
  "with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  "Contrary to popular belief, Lorem Ipsum is n",
  "ot simply random text. It has roots in a piece ",
  "of classical Latin literature from 45 BC, making it over 2000 years old. Richar",
  "d McClintock, a Latin professor at",
  " Hampden-Sydney College in Virginia, looked up one",
  " of the more obscure Latin words, consectetur, ",
  "from a Lorem Ipsum passage, and going through the cites of the word in classical literat",
  "ure, discovered the undoubtabl",
  "e source. Lorem Ipsum comes from sections ",
  "1.10.32 and 1.10.33 of de Finibus Bonorum et Malo",
  "rum (The Extremes of Good and Evil) by Cicero,",
  " written in 45 BC. This book is a treatise on",
  " the theory of ethics, very popular",
  " during the Renaissance. The first line of Lorem ",
  "Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.",
  "The standard chunk of L",
  "orem Ipsum used since the 1500s is reproduced ",
  "below for those interested. Sections 1.10.32 and ",
  "1.10.33 from de Finibus ",
  "Bonorum et Malorum by Cicero are also reproduced in",
  " their exact original form, accompanied by English versions from the 1914",
  " translation by H. Rackham.",
];

const addDay = (d, days) => {
  date = new Date(d.getTime());
  date.setDate(date.getDate() + days);
  return date;
};

const createODT = (
  code,
  subject,
  typeIndex,
  languageIndex,
  pageAmount,
  signerInfoName,
  signerInfoPosition,
  issuedAmount,
  priorityIndex,
  securityIndex,
  organ,
  listOfficer,
  statusIndex
) => {
  let e = Math.floor(Math.random() * 14);
  let issuedDate = Helpers.randomDate(timeStart, timeEnd);
  let dueDate = Helpers.randomDate(issuedDate, addDay(timeEnd, e));
  let file = fileData;
  let listOfficerCanApproveOD = listOfficer.filter((el) =>
    rightApproveOD.includes(el.right)
  );
  let listOfficerCanImporterOD = listOfficer.filter((el) =>
    rightImporterOD.includes(el.right)
  );
  let approver =
    listOfficerCanApproveOD[
      Math.floor(Math.random() * listOfficerCanApproveOD.length)
    ]._id;
  let importer =
    listOfficerCanImporterOD[
      Math.floor(Math.random() * listOfficerCanImporterOD.length)
    ]._id;
  timeStart = issuedDate;
  return {
    code,
    issuedDate,
    subject,
    type: typeData[typeIndex]._id,
    language: languageData[languageIndex]._id,
    pageAmount,
    signerInfoName,
    signerInfoPosition,
    dueDate,
    priority: priorityData[priorityIndex]._id,
    security: securityData[securityIndex]._id,
    issuedAmount,
    organ: organ
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3 + 1)),
    approver,
    importer,
    status: statusData[statusIndex]._id,
    file,
  };
};

for (var i = 0; i < organizationData.length; i++) {
  if (organizationData[i].makeData) {
    const organ = organizationData.filter(
      (el) =>
        el._id !== organizationData[i]._id &&
        (el.inside || el.organ === organizationData[i]._id)
    );
    const listOfficer = officerData.filter(
      (el) => el.organ === organizationData[i]._id
    );
    for (var year = 2021; year < now.getFullYear(); year++) {
      let c = 1;
      timeStart = new Date(year + "-1-1");
      let randomAmount = Math.floor(Math.random() * 1 * 7 + 10);
      for (var j = 0; j < randomAmount; j++) {
        timeEnd = new Date(
          new Date(year + "-1-1").getTime() + aYear * (j / randomAmount)
        );
        let signer =
          listOfficer[Math.floor(Math.random() * listOfficer.length)];
        ODTData.push(
          createODT(
            c++,
            s[Math.floor(Math.random() * s.length)],
            Math.floor(Math.random() * typeData.length),
            Math.floor(Math.random() * languageData.length),
            Math.floor(Math.random() * 10 + 1),
            `${signer.lastName} ${signer.firstName}`,
            signer.position,
            Math.floor(Math.random() * 1000 + 1),
            Math.floor(Math.random() * priorityData.length),
            Math.floor(Math.random() * securityData.length),
            organ,
            listOfficer,
            Math.floor(Math.random() * statusData.length)
          )
        );
      }
    }
    let c = 1;
    timeStart = new Date(new Date().getFullYear() + "-1-1");
    let randomAmount = Math.floor(Math.random() * 1 * 3 + 10);
    for (var j = 0; j < randomAmount; j++) {
      timeEnd = new Date(
        new Date(year + "-1-1").getTime() + aYear * (j / randomAmount)
      );
      let signer = listOfficer[Math.floor(Math.random() * listOfficer.length)];
      ODTData.push(
        createODT(
          c++,
          s[Math.floor(Math.random() * s.length)],
          Math.floor(Math.random() * typeData.length),
          Math.floor(Math.random() * languageData.length),
          Math.floor(Math.random() * 10 + 1),
          `${signer.lastName} ${signer.firstName}`,
          signer.position,
          Math.floor(Math.random() * 1000 + 1),
          Math.floor(Math.random() * priorityData.length),
          Math.floor(Math.random() * securityData.length),
          organ,
          listOfficer,
          Math.floor(Math.random() * statusData.length)
        )
      );
    }
  }
}

module.exports = ODTData;
