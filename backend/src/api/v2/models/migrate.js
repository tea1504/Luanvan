require("dotenv").config();
const _type = require("./type.model");
const _language = require("./language.model");
const _security = require("./security.model");
const _priority = require("./priority.model");
const _right = require("./right.model");
const _officerStatus = require("./officerStatus.model");
const _organization = require("./organization.model");
const _officer = require("./officer.model");
const _status = require("./status.model");
const _IOD = require("./incomingOfficialDispatch.model");
const _ODT = require("./officialDispatchTravel.model");
const Helpers = require("../commons/helpers");
const organizationData = require("./data/organization.data");
const typeData = require("./data/type.data");
const languageData = require("./data/language.data");
const securityData = require("./data/security.data");
const priorityData = require("./data/priority.data");
const rightData = require("./data/right.data");
const officerStatusData = require("./data/officerStatus.data");
const statusData = require("./data/status.data");
const officerData = require("./data/officer.data");
const IODData = require("./data/IOD.data");
const ODTData = require("./data/ODT.data");

async function start() {
  console.log("Preparing ...");
  console.log("Migrating Type");
  await _type.deleteMany();
  await _type.create(typeData);

  console.log("Migrating Language");
  await _language.deleteMany();
  await _language.create(languageData);

  console.log("Migrating Security");
  await _security.deleteMany();
  await _security.create(securityData);

  console.log("Migrating Priority");
  await _priority.deleteMany();
  await _priority.create(priorityData);

  console.log("Migrating Right");
  await _right.deleteMany();
  await _right.create(rightData);

  console.log("Migrating Officer Status");
  await _officerStatus.deleteMany();
  await _officerStatus.create(officerStatusData);

  console.log("Migrate Status");
  await _status.deleteMany();
  await _status.create(statusData);

  console.log("Migrating Organization");
  await _organization.deleteMany();
  await _organization.create(organizationData);

  console.log("Migrate Officer");
  await _officer.deleteMany();
  await _officer.create(officerData);

  console.log("Migrate Incoming Official Dispatch");
  await _IOD.deleteMany();
  await _IOD.create(IODData);

  console.log("Migrate Official Dispatch Travel");
  await _ODT.deleteMany();
  await _ODT.create(ODTData);

  console.log("Done");
}

start();
