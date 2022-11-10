const Helpers = require("../../commons/helpers");

const rightData = [];
const data = [
  {
    name: "Super user",
    approveOD: true,
    createOD: true,
    readOD: true,
    updateOD: true,
    deleteOD: true,
    createCategories: true,
    readCategories: true,
    updateCategories: true,
    deleteCategories: true,
    createOfficer: true,
    readOfficer: true,
    updateOfficer: true,
    deleteOfficer: true,
    createRight: true,
    readRight: true,
    updateRight: true,
    deleteRight: true,
    scope: 0,
  },
  {
    name: "Thủ trưởng hệ thống",
    approveOD: true,
    createOD: true,
    readOD: true,
    updateOD: true,
    deleteOD: true,
    createCategories: true,
    readCategories: true,
    updateCategories: true,
    deleteCategories: true,
    createOfficer: true,
    readOfficer: true,
    updateOfficer: true,
    deleteOfficer: true,
    scope: 0,
  },
  {
    name: "Văn thư hệ thống",
    approveOD: true,
    createOD: true,
    readOD: true,
    updateOD: true,
    deleteOD: true,
    createCategories: true,
    readCategories: true,
    updateCategories: true,
    deleteCategories: true,
    scope: 0,
  },
  {
    name: "Thủ trưởng đơn vị",
    approveOD: true,
    createOD: true,
    readOD: true,
    updateOD: true,
    deleteOD: true,
    createCategories: true,
    readCategories: true,
    updateCategories: true,
    deleteCategories: true,
    createOfficer: true,
    readOfficer: true,
    updateOfficer: true,
    deleteOfficer: true,
    createRight: true,
    readRight: true,
    updateRight: true,
    deleteRight: true,
    scope: 1,
  },
  {
    name: "Văn thư đơn vị",
    approveOD: true,
    createOD: true,
    readOD: true,
    updateOD: true,
    deleteOD: true,
    createCategories: true,
    readCategories: true,
    updateCategories: true,
    deleteCategories: true,
    scope: 1,
  },
  {
    name: "Cán bộ đơn vị",
    approveOD: true,
    readOD: true,
    scope: 1,
  },
  {
    name: "default",
    readOD: true,
    scope: 0,
  },
];

for (var i = 0; i < data.length; i++) {
  const item = data[i];
  let id = "";
  if (item.name.length > 12) id = item.name.slice(0, 12);
  else id = item.name;
  rightData.push({
    ...item,
    _id: Helpers.toSlug(id) + "0".repeat(12 - id.length),
  });
}

module.exports = rightData;
