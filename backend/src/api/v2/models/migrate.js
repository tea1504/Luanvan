require("dotenv").config();
const bcrypt = require("bcrypt");
const _type = require("./type.model");
const _language = require("./language.model");
const _security = require("./security.model");
const _priority = require("./priority.model");
const _right = require("./right.model");
const _officerStatus = require("./officerStatus.model");
const _organization = require("./organization.model");
const _officer = require("./officer.model");

async function start() {
  console.log("Preparing ...");
  console.log("Migrating Type");
  {
    await _type.deleteMany();
    await _type.create({
      _id: "type00000001",
      name: "type 1",
      notation: "1",
    });
  }

  console.log("Migrating Language");
  {
    await _language.deleteMany();
    await _language.create({
      _id: "language0001",
      name: "language 1",
      notation: "1",
    });
  }

  console.log("Migrating Security");
  {
    await _security.deleteMany();
    await _security.create({
      _id: "security0001",
      name: "security 1",
    });
  }

  console.log("Migrating Priority");
  {
    await _priority.deleteMany();
    await _priority.create({
      _id: "priority0001",
      name: "priority 1",
    });
  }

  console.log("Migrating Right");
  {
    await _right.deleteMany();
    await _right.create({
      _id: "right0000001",
      name: "right 1",
    });
  }

  console.log("Migrating Officer Status");
  {
    await _officerStatus.deleteMany();
    await _officerStatus.create({
      _id: "officerSta01",
      name: "status 1",
    });
  }

  console.log("Migrating Organization");
  {
    await _organization.deleteMany();
    await _organization.create({
      _id: "organ0000001",
      name: "organization 1",
      code: "1",
      emailAddress: "o1.@gmail.com",
      phoneNumber: "0939259664",
    });
    await _organization.create({
      _id: "organ0000002",
      name: "organization 2",
      code: "2",
      emailAddress: "o2.@gmail.com",
      phoneNumber: "0939259665",
      organ: "organ0000001",
    });
  }

  console.log("Migrate Officer");
  const password = await bcrypt.hash("12345", parseInt(process.env.SALT));
  {
    await _officer.deleteMany();
    await _officer.create({
      _id: "officer00001",
      code: "000001",
      position: "Admin",
      firstName: "Hòa",
      lastName: "Trần Văn",
      emailAddress: "hoa@gmail.com",
      phoneNumber: "0786882888",
      password: [{ _id: "officer1pass", value: password }],
      organ: "organ0000001",
      file: {
        name: "123",
        path: "123",
      },
      status: "officerSta01",
      right: "right0000001",
    });
  }

  console.log("Done");
}

start();
