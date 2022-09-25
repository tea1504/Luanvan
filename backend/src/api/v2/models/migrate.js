require("dotenv").config();
const bcrypt = require("bcrypt");
const _type = require("./type.model");
const _language = require("./language.model");
const _security = require("./security.model");
const _priority = require("./priority.model");

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

  console.log("Done");
}

start();
