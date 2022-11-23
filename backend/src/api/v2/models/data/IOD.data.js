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

const IODData = [];
let timeStart = new Date("2022-1-1");
let timeEnd = new Date();
let now = new Date();
let aNow = new Date().getTime() - new Date("2022-1-1").getTime();
let aYear = 31536000000;
let rightApproveOD = rightData.filter((el) => el.approveOD).map((el) => el._id);
let rightImporterOD = rightData.filter((el) => el.createOD).map((el) => el._id);
let max = 5000,
  min = 2500,
  y = 0;
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

const createIOD = (
  code,
  subject,
  typeIndex,
  languageIndex,
  pageAmount,
  signerInfoName,
  signerInfoPosition,
  arrivalNumber,
  priorityIndex,
  securityIndex,
  organID,
  listOfficer,
  statusIndex
) => {
  let s = Math.floor(Math.random() * 14);
  let e = Math.floor(Math.random() * 14);
  let issuedDate = Helpers.randomDate(addDay(timeStart, -s), timeEnd);
  let dueDate = Helpers.randomDate(issuedDate, addDay(timeEnd, e));
  let arrivalDate = Helpers.randomDate(
    s < 0 ? timeStart : issuedDate,
    e > 0 ? timeEnd : dueDate
  );
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
  let handler = [];
  handler.push(listOfficer[Math.floor(Math.random() * listOfficer.length)]._id);
  handler.push(listOfficer[Math.floor(Math.random() * listOfficer.length)]._id);
  handler.push(listOfficer[Math.floor(Math.random() * listOfficer.length)]._id);
  let traceHeaderList = [];
  traceHeaderList.push({
    officer: importer,
    command: statusData[0].description,
    date: arrivalDate,
    header: statusData[0].name,
    status: statusData[0]._id,
  });
  traceHeaderList.push({
    officer: approver,
    command: statusData[1].description,
    date: arrivalDate,
    header: statusData[1].name,
    status: statusData[1]._id,
  });
  traceHeaderList.push({
    officer: approver,
    command: statusData[2].description,
    date: arrivalDate,
    header: statusData[2].name,
    status: statusData[2]._id,
  });
  traceHeaderList.push({
    officer: handler[0],
    command: statusData[3].description,
    date: arrivalDate,
    header: statusData[3].name,
    status: statusData[3]._id,
  });
  traceHeaderList.push({
    officer: handler[0],
    command: statusData[statusIndex].description,
    date: arrivalDate,
    header: statusData[statusIndex].name,
    status: statusData[statusIndex]._id,
  });
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
    arrivalNumber,
    arrivalDate,
    priority: priorityData[priorityIndex]._id,
    security: securityData[securityIndex]._id,
    organ: organID,
    approver,
    importer,
    handler,
    status: statusData[statusIndex]._id,
    traceHeaderList,
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
    for (var year = now.getFullYear() - y; year < now.getFullYear(); year++) {
      let c = 1;
      timeStart = new Date(year + "-1-1");
      let randomAmount = Math.floor(Math.random() * (max - min) + min);
      for (var j = 0; j < randomAmount; j++) {
        timeEnd = new Date(
          new Date(year + "-1-1").getTime() + aYear * (j / randomAmount)
        );
        let signer =
          officerData[Math.floor(Math.random() * officerData.length)];
        IODData.push(
          createIOD(
            Math.floor(Math.random() * 1000 + 1),
            s[Math.floor(Math.random() * s.length)],
            Math.floor(Math.random() * typeData.length),
            Math.floor(Math.random() * languageData.length),
            Math.floor(Math.random() * 10 + 1),
            `${signer.lastName} ${signer.firstName}`,
            signer.position,
            c++,
            Math.floor(Math.random() * priorityData.length),
            Math.floor(Math.random() * securityData.length),
            organ[Math.floor(Math.random() * organ.length)],
            listOfficer,
            Math.floor(Math.random() * statusData.length)
          )
        );
      }
    }
    let c = 1;
    timeStart = new Date(now.getFullYear() + "-1-1");
    let randomAmount = Math.floor(Math.random() * (max - min) + min);
    for (var j = 0; j < randomAmount; j++) {
      timeEnd = new Date(
        new Date(now.getFullYear() + "-1-1").getTime() +
          aNow * (j / randomAmount)
      );
      let signer = listOfficer[Math.floor(Math.random() * listOfficer.length)];
      IODData.push(
        createIOD(
          Math.floor(Math.random() * 1000 + 1),
          s[Math.floor(Math.random() * s.length)],
          Math.floor(Math.random() * typeData.length),
          Math.floor(Math.random() * languageData.length),
          Math.floor(Math.random() * 10 + 1),
          `${signer.lastName} ${signer.firstName}`,
          signer.position,
          c++,
          Math.floor(Math.random() * priorityData.length),
          Math.floor(Math.random() * securityData.length),
          organ[Math.floor(Math.random() * organ.length)],
          listOfficer,
          Math.floor(Math.random() * statusData.length)
        )
      );
    }
  }
}

module.exports = IODData;
