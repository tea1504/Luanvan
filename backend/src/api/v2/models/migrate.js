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
const _status = require("./status.model");
const _IOD = require("./incomingOfficialDispatch.model");
const _ODT = require("./officialDispatchTravel.model");
const Helpers = require("../commons/helpers");

async function start() {
  console.log("Preparing ...");
  console.log("Migrating Type");
  {
    await _type.deleteMany();
    await _type.create([
      {
        _id: "type00000001",
        name: "Nghị quyết (cá biệt)",
        notation: "NQ",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000002",
        name: "Quyết định (cá biệt)",
        notation: "QĐ",
        color: Helpers.generateColor(),
        description:
          "Quyết định cá biệt là quyết định đã được ban hành về một vấn đề cụ thể và được áp dụng một lần đối với một hoặc một số đối tượng cụ thể. Trường hợp vụ việc dân sự có liên quan đến quyết định này thì phải được Tòa án xem xét trong cùng một vụ việc dân sự đó.",
      },
      {
        _id: "type00000003",
        name: "Chỉ thị",
        notation: "CT",
        color: Helpers.generateColor(),
        description:
          "Chỉ thị là văn bản quy định các biện pháp chỉ đạo phối hợp hoạt động của các thành viên Chính phủ, đôn đốc kiểm tra hoạt động của các Bộ, cơ quan ngang Bộ, cơ quan thuộc Chính phủ và Uỷ ban nhân dân các cấp trong việc thực hiện chủ trương, chính sách, pháp luật của nhà nước.",
      },
      {
        _id: "type00000004",
        name: "Quy chế",
        notation: "QC",
        color: Helpers.generateColor(),
        description:
          "Quy chế là quy phạm điều chỉnh các vấn đề như chế độ chính sách, công tác nhân sự, quyền hạn, tổ chức hoạt động…quy chế đưa ra những yêu cầu mà các thành viên thuộc phạm vi điều chỉnh của quy chế cần đạt được và mang tính nguyên tắc.",
      },
      {
        _id: "type00000005",
        name: "Quy định",
        notation: "QyĐ",
        color: Helpers.generateColor(),
        description:
          "Quy định là Những quy tắc, chuẩn mực trong xử sự; những tiêu chuẩn, định mức về kinh tế, kỹ thuật được cơ quan nhà nước có thẩm quyền ban hành hoặc thừa nhận và buộc các tổ chức, cá nhân có liên quan phải tuân thủ.",
      },
      {
        _id: "type00000006",
        name: "Thông cáo",
        notation: "TC",
        color: Helpers.generateColor(),
        description:
          "Văn bản do các tổ chức, cơ quan nhà nước ban bố để cho mọi người biết tình hình, sự việc có tầm quan trọng nào.",
      },
      {
        _id: "type00000007",
        name: "Thông báo",
        notation: "TB",
        color: Helpers.generateColor(),
        description:
          "Thông báo là một văn bản hành chính dùng để truyền đạt những tin tức, nội dung của quyết định cho cá nhân, bộ phận hoặc cơ quan,…",
      },
      {
        _id: "type00000008",
        name: "Hướng dẫn",
        notation: "HD",
        color: Helpers.generateColor(),
        description:
          "Hướng dẫn là các văn bản được đưa ra để hướng dẫn thực hiện cho văn bản quy phạm pháp luật hiện thời.",
      },
      {
        _id: "type00000009",
        name: "Chương trình",
        notation: "CTr",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000010",
        name: "Kế hoạch",
        notation: "KH",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000011",
        name: "Phương án",
        notation: "PA",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000012",
        name: "Đề án",
        notation: "ĐA",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000013",
        name: "Dự án",
        notation: "DA",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000014",
        name: "Báo cáo",
        notation: "BC",
        color: Helpers.generateColor(),
        description:
          "Thể hiện tình hình, kết quả thực hiện công việc nhằm giúp cho cơ quan, người có thẩm quyền có thông tin phục vụ việc phân tích, đánh giá, điều hành và ban hành các quyết định quản lý phù hợp.",
      },
      {
        _id: "type00000015",
        name: "Biên bản",
        notation: "BB",
        color: Helpers.generateColor(),
        description:
          "Biên bản là một loại văn bản ghi chép lại những sự việc đã xảy ra hoặc đang xảy ra.",
      },
      {
        _id: "type00000016",
        name: "Tờ trình",
        notation: "TTr",
        color: Helpers.generateColor(),
        description:
          "Tờ trình là văn bản dùng để trình bày, đề xuất với cấp trên một sự việc, đề xuất phê chuẩn một chủ trương, một giải pháp… để xin kết luận, chỉ đạo của cấp trên.",
      },
      {
        _id: "type00000017",
        name: "Hợp đồng",
        notation: "HĐ",
        color: Helpers.generateColor(),
        description:
          "Hợp đồng là sự thỏa thuận giữa các bên về việc xác lập, thay đổi hoặc chấm dứt quyền, nghĩa vụ dân sự",
      },
      {
        _id: "type00000018",
        name: "Công điện",
        notation: "CĐ",
        color: Helpers.generateColor(),
        description:
          "Công điện là Điện tín do cơ quan nhà nước hoặc người có thẩm quyền gửi cho các cơ quan, tổ chức có liên quan về vấn đề phát sinh trong tình huống đặc biệt.",
      },
      {
        _id: "type00000019",
        name: "Bản ghi nhớ",
        notation: "BGN",
        color: Helpers.generateColor(),
        description:
          "Bản ghi nhớ là một loại thỏa thuận giữa hai bên (song phương) trở lên (đa phương)",
      },
      {
        _id: "type00000020",
        name: "Bản thỏa thuận",
        notation: "BTT",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000021",
        name: "Giấy ủy quyền",
        notation: "GUQ",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000022",
        name: "Giấy mời",
        notation: "GM",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000023",
        name: "Giấy giới thiệu",
        notation: "GGT",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000024",
        name: "Giấy nghỉ phép",
        notation: "GNP",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000025",
        name: "Phiếu gửi",
        notation: "PG",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000026",
        name: "Phiếu chuyển",
        notation: "PC",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000027",
        name: "Phiếu báo",
        notation: "PB",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000028",
        name: "Bản sao Y",
        notation: "SY",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000029",
        name: "Bản trích sao",
        notation: "TrS",
        color: Helpers.generateColor(),
      },
      {
        _id: "type00000030",
        name: "Bản sao lục",
        notation: "SL",
        color: Helpers.generateColor(),
      },
    ]);
  }

  console.log("Migrating Language");
  {
    await _language.deleteMany();
    await _language.create([
      {
        _id: "language0001",
        name: "Tiếng Việt",
        notation: "vn",
        color: Helpers.generateColor(),
      },
      {
        _id: "language0002",
        name: "Tiếng Anh",
        notation: "en",
        color: Helpers.generateColor(),
      },
      {
        _id: "language0003",
        name: "Tiếng Pháp",
        notation: "fr",
        color: Helpers.generateColor(),
      },
      {
        _id: "language0004",
        name: "Tiếng Trung Quốc",
        notation: "cn",
        color: Helpers.generateColor(),
      },
    ]);
  }

  console.log("Migrating Security");
  {
    await _security.deleteMany();
    await _security.create([
      {
        _id: "security0000",
        name: "Không",
        color: Helpers.generateColor(),
      },
      {
        _id: "security0001",
        name: "Mật",
        color: Helpers.generateColor(),
      },
      {
        _id: "security0002",
        name: "Tuyệt mật",
        color: Helpers.generateColor(),
      },
      {
        _id: "security0003",
        name: "Tối mật",
        color: Helpers.generateColor(),
      },
    ]);
  }

  console.log("Migrating Priority");
  {
    await _priority.deleteMany();
    await _priority.create([
      {
        _id: "priority0000",
        name: "Không",
        color: Helpers.generateColor(),
      },
      {
        _id: "priority0001",
        name: "Khẩn",
        color: Helpers.generateColor(),
      },
      {
        _id: "priority0002",
        name: "Thượng khẩn",
        color: Helpers.generateColor(),
      },
      {
        _id: "priority0003",
        name: "Hỏa tốc",
        color: Helpers.generateColor(),
      },
    ]);
  }

  console.log("Migrating Right");
  {
    await _right.deleteMany();
    await _right.create([
      {
        _id: "right0000000",
        approveOD: true,
        createCategories: true,
        createOD: true,
        createOfficer: true,
        createRight: true,
        deleteCategories: true,
        deleteOD: true,
        deleteOfficer: true,
        deleteRight: true,
        name: "Super User",
        readOD: true,
        readRight: true,
        readOfficer: true,
        readCategories: true,
        scope: 0,
        updateCategories: true,
        updateOD: true,
        updateOfficer: true,
        updateRight: true,
      },
      {
        _id: "right0000001",
        createCategories: true,
        createOfficer: true,
        createRight: true,
        name: "System Admin",
        readOD: true,
        readRight: true,
        readOfficer: true,
        readCategories: true,
        scope: 0,
        updateCategories: true,
        updateOfficer: true,
        updateRight: true,
      },
      {
        _id: "right0000002",
        name: "default",
        readOD: true,
        updateOD: true,
        deleteOD: true,
        scope: 1,
      },
    ]);
  }

  console.log("Migrating Officer Status");
  {
    await _officerStatus.deleteMany();
    await _officerStatus.create([
      {
        _id: "officerSta00",
        name: "NEW",
        description: "Tài khoản vừa khởi tạo",
        color: Helpers.generateColor(),
      },
      {
        _id: "officerSta01",
        name: "ACTIVATED",
        description: "Tài khoản đang hoạt động",
        color: Helpers.generateColor(),
      },
      {
        _id: "officerSta02",
        name: "LOCKED",
        description: "Tài khoản bị khóa",
        color: Helpers.generateColor(),
      },
      {
        _id: "officerSta03",
        name: "WRONG_1",
        description: "Sai mật khẩu lần 1",
        color: Helpers.generateColor(),
      },
      {
        _id: "officerSta04",
        name: "WRONG_2",
        description: "Sai mật khẩu lần 2",
        color: Helpers.generateColor(),
      },
      {
        _id: "officerSta05",
        name: "WRONG_3",
        description: "Sai mật khẩu lần 3",
        color: Helpers.generateColor(),
      },
      {
        _id: "officerSta06",
        name: "WRONG_4",
        description: "Sai mật khẩu lần 4",
        color: Helpers.generateColor(),
      },
    ]);
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
    await _organization.create([
      {
        _id: "organ0000002",
        name: "organization 2",
        code: "2",
        emailAddress: "o2.@gmail.com",
        phoneNumber: "0939259665",
        organ: "organ0000001",
      },
      {
        _id: "organ0000003",
        name: "organization 3",
        code: "3",
        emailAddress: "o3.@gmail.com",
        phoneNumber: "0939359665",
        organ: "organ0000001",
      },
      {
        _id: "organ0000004",
        name: "organization 4",
        code: "4",
        emailAddress: "o.4.@gmail.com",
        phoneNumber: "0939549665",
        organ: "organ0000001",
      },
      {
        _id: "organ0000005",
        name: "organization 5",
        code: "5",
        emailAddress: "o.5.@gmail.com",
        phoneNumber: "0939559665",
        organ: "organ0000001",
      },
      {
        _id: "organ0000006",
        name: "organization 6",
        code: "6",
        emailAddress: "o.6.@gmail.com",
        phoneNumber: "0939559666",
        organ: "organ0000001",
      },
      {
        _id: "organ0000007",
        name: "organization 7",
        code: "7",
        emailAddress: "o.7.@gmail.com",
        phoneNumber: "0939579665",
        organ: "organ0000001",
      },
      {
        _id: "organ0000008",
        name: "organization 8",
        code: "8",
        emailAddress: "o.8.@gmail.com",
        phoneNumber: "0939889665",
        organ: "organ0000001",
      },
      {
        _id: "organ0000009",
        name: "organization 9",
        code: "9",
        emailAddress: "o.9.@gmail.com",
        phoneNumber: "0939559669",
        organ: "organ0000001",
      },
      {
        _id: "organ0000010",
        name: "organization 0",
        code: "10",
        emailAddress: "o.1.0.@gmail.com",
        phoneNumber: "0939559661",
        organ: "organ0000001",
      },
      {
        _id: "organ0000011",
        name: "organization 11",
        code: "11",
        emailAddress: "1.1.@gmail.com",
        phoneNumber: "0939159661",
        organ: "organ0000001",
      },
      {
        _id: "organ0000012",
        name: "organization 12",
        code: "12",
        emailAddress: "1.12.@gmail.com",
        phoneNumber: "0939159662",
        organ: "organ0000001",
      },
    ]);
  }

  console.log("Migrate Officer");
  const password = await bcrypt.hash("12345", parseInt(process.env.SALT));
  const oldPassword = await bcrypt.hash("12345", parseInt(process.env.SALT));
  {
    await _officer.deleteMany();
    await _officer.create(
      {
        _id: "officer00001",
        code: "000001",
        position: "Admin",
        firstName: "Hòa",
        lastName: "Trần Văn",
        emailAddress: "tranvanhoa15.042000@gmail.com",
        phoneNumber: "0786882888",
        password: [
          { _id: "officer1pass", value: password },
          { time: new Date("2022-09-25T12:54:45.880Z"), value: oldPassword },
        ],
        organ: "organ0000001",
        file: {
          name: "1.jpg",
          path: "avatars/1.jpg",
        },
        status: "officerSta01",
        right: "right0000000",
      },
      {
        _id: "officer00002",
        code: "000002",
        position: "Admin",
        firstName: "Hòa",
        lastName: "Trần Văn",
        emailAddress: "tranvanhoa1504.2000@gmail.com",
        phoneNumber: "0786882882",
        password: [
          { _id: "officer3pass", value: password },
          { time: new Date("2022-09-25T12:54:45.880Z"), value: oldPassword },
        ],
        organ: "organ0000001",
        file: {
          name: "2.jpg",
          path: "avatars/2.jpg",
        },
        status: "officerSta00",
        right: "right0000001",
      },
      {
        _id: "officer00003",
        code: "000003",
        position: "Cán bộ",
        firstName: "Bình",
        lastName: "Trần Văn",
        emailAddress: "tranvanhoa1504.2000@gmail.com",
        phoneNumber: "0786182882",
        password: [
          { _id: "officer3pass", value: password },
          { time: new Date("2022-09-25T12:54:45.880Z"), value: oldPassword },
        ],
        organ: "organ0000002",
        file: {
          name: "3.jpg",
          path: "avatars/3.jpg",
        },
        status: "officerSta01",
        right: "right0000002",
      }
    );
  }

  console.log("Migrate Status");
  {
    await _status.deleteMany();
    await _status.create({
      _id: "status000001",
      name: "Status 1",
    });
  }

  console.log("Migrate Incoming Official Dispatch");
  {
    await _IOD.deleteMany();
    await _IOD.create({
      _id: "IOD000000001",
      code: 1,
      issuedDate: Date.now(),
      subject: "Subject",
      type: "type00000001",
      language: "language0001",
      pageAmount: 1,
      signerInfoName: "Tên Người Ký",
      signerInfoPosition: "Giám đốc",
      dueDate: Date.now(),
      arrivalNumber: 1,
      arrivalDate: Date.now(),
      priority: "priority0001",
      security: "security0001",
      organ: "organ0000001",
      approver: "officer00001",
      importer: "officer00001",
      handler: ["officer00001", "officer00001"],
      traceHeaderList: [
        {
          officer: "officer00001",
          command: "người nào đó đã thêm",
          date: Date.now(),
          header: "Thêm mới",
          status: "status000001",
        },
        {
          officer: "officer00001",
          command: "người nào đó đã thêm",
          date: Date.now(),
          header: "Thêm mới",
          status: "status000001",
        },
      ],
      file: [
        {
          name: "123",
          path: "123",
        },
        {
          name: "123",
          path: "123",
        },
      ],
    });
  }

  console.log("Migrate Official Dispatch Travel");
  {
    await _ODT.deleteMany();
    await _ODT.create({
      _id: "ODT000000001",
      code: 1,
      issuedDate: Date.now(),
      subject: "Subject",
      type: "type00000001",
      language: "language0001",
      pageAmount: 1,
      signerInfoName: "Tên Người Ký",
      signerInfoPosition: "Giám đốc",
      dueDate: Date.now(),
      issuedAmount: 1,
      priority: "priority0001",
      security: "security0001",
      organ: "organ0000001",
      approver: "officer00001",
      importer: "officer00001",
    });
  }

  console.log("Done");
}

start();
