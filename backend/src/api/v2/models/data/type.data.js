const Helpers = require("../../commons/helpers");

const typeData = [];
const data = [
  {
    name: "Nghị quyết (cá biệt)",
    notation: "NQ",
  },
  {
    name: "Quyết định (cá biệt)",
    notation: "QĐ",
    description:
      "Quyết định cá biệt là quyết định đã được ban hành về một vấn đề cụ thể và được áp dụng một lần đối với một hoặc một số đối tượng cụ thể. Trường hợp vụ việc dân sự có liên quan đến quyết định này thì phải được Tòa án xem xét trong cùng một vụ việc dân sự đó.",
  },
  {
    name: "Chỉ thị",
    notation: "CT",
    description:
      "Chỉ thị là văn bản quy định các biện pháp chỉ đạo phối hợp hoạt động của các thành viên Chính phủ, đôn đốc kiểm tra hoạt động của các Bộ, cơ quan ngang Bộ, cơ quan thuộc Chính phủ và Uỷ ban nhân dân các cấp trong việc thực hiện chủ trương, chính sách, pháp luật của nhà nước.",
  },
  {
    name: "Quy chế",
    notation: "QC",
    description:
      "Quy chế là quy phạm điều chỉnh các vấn đề như chế độ chính sách, công tác nhân sự, quyền hạn, tổ chức hoạt động…quy chế đưa ra những yêu cầu mà các thành viên thuộc phạm vi điều chỉnh của quy chế cần đạt được và mang tính nguyên tắc.",
  },
  {
    name: "Quy định",
    notation: "QyĐ",
    description:
      "Quy định là Những quy tắc, chuẩn mực trong xử sự; những tiêu chuẩn, định mức về kinh tế, kỹ thuật được cơ quan nhà nước có thẩm quyền ban hành hoặc thừa nhận và buộc các tổ chức, cá nhân có liên quan phải tuân thủ.",
  },
  {
    name: "Thông cáo",
    notation: "TC",
    description:
      "Văn bản do các tổ chức, cơ quan nhà nước ban bố để cho mọi người biết tình hình, sự việc có tầm quan trọng nào.",
  },
  {
    name: "Thông báo",
    notation: "TB",
    description:
      "Thông báo là một văn bản hành chính dùng để truyền đạt những tin tức, nội dung của quyết định cho cá nhân, bộ phận hoặc cơ quan,…",
  },
  {
    name: "Hướng dẫn",
    notation: "HD",
    description:
      "Hướng dẫn là các văn bản được đưa ra để hướng dẫn thực hiện cho văn bản quy phạm pháp luật hiện thời.",
  },
  {
    name: "Chương trình",
    notation: "CTr",
  },
  {
    name: "Kế hoạch",
    notation: "KH",
  },
  {
    name: "Phương án",
    notation: "PA",
  },
  {
    name: "Đề án",
    notation: "ĐA",
  },
  {
    name: "Dự án",
    notation: "DA",
  },
  {
    name: "Báo cáo",
    notation: "BC",
    description:
      "Thể hiện tình hình, kết quả thực hiện công việc nhằm giúp cho cơ quan, người có thẩm quyền có thông tin phục vụ việc phân tích, đánh giá, điều hành và ban hành các quyết định quản lý phù hợp.",
  },
  {
    name: "Biên bản",
    notation: "BB",
    description:
      "Biên bản là một loại văn bản ghi chép lại những sự việc đã xảy ra hoặc đang xảy ra.",
  },
  {
    name: "Tờ trình",
    notation: "TTr",
    description:
      "Tờ trình là văn bản dùng để trình bày, đề xuất với cấp trên một sự việc, đề xuất phê chuẩn một chủ trương, một giải pháp… để xin kết luận, chỉ đạo của cấp trên.",
  },
  {
    name: "Hợp đồng",
    notation: "HĐ",
    description:
      "Hợp đồng là sự thỏa thuận giữa các bên về việc xác lập, thay đổi hoặc chấm dứt quyền, nghĩa vụ dân sự",
  },
  {
    name: "Công điện",
    notation: "CĐ",
    description:
      "Công điện là Điện tín do cơ quan nhà nước hoặc người có thẩm quyền gửi cho các cơ quan, tổ chức có liên quan về vấn đề phát sinh trong tình huống đặc biệt.",
  },
  {
    name: "Bản ghi nhớ",
    notation: "BGN",
    description:
      "Bản ghi nhớ là một loại thỏa thuận giữa hai bên (song phương) trở lên (đa phương)",
  },
  {
    name: "Bản thỏa thuận",
    notation: "BTT",
  },
  {
    name: "Giấy ủy quyền",
    notation: "GUQ",
  },
  {
    name: "Giấy mời",
    notation: "GM",
  },
  {
    name: "Giấy giới thiệu",
    notation: "GGT",
  },
  {
    name: "Giấy nghỉ phép",
    notation: "GNP",
  },
  {
    name: "Phiếu gửi",
    notation: "PG",
  },
  {
    name: "Phiếu chuyển",
    notation: "PC",
  },
  {
    name: "Phiếu báo",
    notation: "PB",
  },
  {
    name: "Bản sao Y",
    notation: "SY",
  },
  {
    name: "Bản trích sao",
    notation: "TrS",
  },
  {
    name: "Bản sao lục",
    notation: "SL",
  },
  {
    name: "Công văn",
    notation: "CV",
  },
];

for (var i = 0; i < data.length; i++) {
  const item = data[i];
  typeData.push({
    ...item,
    _id: Helpers.toSlug(item.notation) + "0".repeat(12 - item.notation.length),
    color: Helpers.generateColor(),
  });
}

module.exports = typeData;
