const Helpers = require("../../commons/helpers");

const organizationData = [];
const data = [
  {
    name: "Đại học Cần Thơ",
    code: "ĐHCT",
    inside: true,
    sub: [
      { name: "Phòng Công tác Chính trị", code: "CTCT", inside: true, sub: [] },
      { name: "Phòng Công tác Sinh viên", code: "CTSV", inside: true, sub: [] },
      { name: "Phòng Đào tạo", code: "ĐT", inside: true, sub: [] },
      { name: "Phòng Hợp tác Quốc tế", code: "HTQT", sub: [] },
      { name: "Phòng Kế hoạch Tổng hợp", code: "KHTH", sub: [] },
      { name: "Phòng Quản lý Khoa học", code: "QLKH", sub: [] },
      { name: "Phòng Quản trị-Thiết bị", code: "QTTB", sub: [] },
      { name: "Phòng Tài chính", code: "TC", sub: [] },
      { name: "Phòng Thanh tra - Pháp chế", code: "TTPC", sub: [] },
      { name: "Phòng Tổ chức-Cán bộ", code: "TCCB", sub: [] },
      { name: "Ban Quản lý dự án ODA", code: "QLDAODA", sub: [] },
      { name: "Không gian sáng chế", code: "KGSC", sub: [] },
      { name: "Nhà Xuất Bản Đại học Cần Thơ", code: "NXBDHCT", sub: [] },
      { name: "Tạp chí Khoa học Trường ĐHCT", code: "TCKH", sub: [] },
      { name: "Công Ðoàn Trường", code: "CĐT", sub: [] },
      {
        name: "Ðoàn Thanh niên CSHCM & Hội Sinh viên",
        code: "DTN-HSV",
        sub: [],
      },
      { name: "Văn phòng Ðảng ủy", code: "VPĐU", sub: [] },
      { name: "Hội Cựu Chiến binh", code: "CCB", sub: [] },
      { name: "Hội Cựu Sinh viên", code: "CSV", sub: [] },
      {
        name: "Trường Công nghệ thông tin và Truyền thông",
        code: "CNTT&TT",
        inside: true,
        sub: [
          { name: "Công ty TNHH ABC Chấm Com", code: "ABC", sub: [] },
          { name: "Tập đoàn tin học DEF", code: "DEF", sub: [] },
          { name: "Tổ chức 1", code: "TC1", sub: [] },
          { name: "Tổ chức 2", code: "TC2", sub: [] },
          { name: "Tổ chức 3", code: "TC3", sub: [] },
        ],
      },
      {
        name: "Trường Bách khoa",
        code: "BK",
        inside: true,
        sub: [],
      },
      {
        name: "Trường Kinh tế",
        code: "KT",
        inside: true,
        sub: [],
      },
      {
        name: "Trường Nông nghiệp",
        code: "NN",
        inside: true,
        sub: [],
      },
      {
        name: "Khoa dự bị Dân tộc",
        code: "DBDT",
        sub: [],
      },
      {
        name: "Khoa Khoa học Chính trị",
        code: "KHCT",
        sub: [],
      },
      {
        name: "Khoa Khoa học Tự nhiên",
        code: "KHTN",
        sub: [],
      },
      {
        name: "Khoa Khoa học Xã hội và Nhân văn",
        code: "KHXH&NV",
        sub: [],
      },
      {
        name: " Trung tâm Bồi dưỡng Nghiệp vụ Sư phạm",
        code: "BDNVSP",
        sub: [],
      },
      {
        name: " Trung tâm Chuyển giao Công nghệ và Dịch vụ",
        code: "CGCNVDV",
        sub: [],
      },
      {
        name: " Trung tâm Công nghệ Phần mềm",
        code: "CUSC",
        sub: [],
      },
      {
        name: " Trung tâm Dịch vụ Khoa học Nông nghiệp",
        code: "DVKHCN",
        sub: [],
      },
      {
        name: " Trung tâm Đánh giá năng lực Ngoại ngữ",
        code: "DGNLNN",
        sub: [],
      },
      {
        name: " Trung tâm Đào tạo, NC và Tư vấn kinh tế",
        code: "DTNCTVKT",
        sub: [],
      },
      { name: " Trung tâm Điện - Điện tử", code: "DDT", inside: true, sub: [] },
      {
        name: " Trung tâm Điện tử Tin học",
        code: "DTTH",
        sub: [],
      },
      {
        name: " Trung tâm Giáo dục Quốc phòng & An ninh",
        code: "GDQP-AN",
        sub: [],
      },
      { name: " Trung tâm Học liệu", code: "LRC", inside: true, sub: [] },
      {
        name: " Trung tâm Kiểm định và Tư vấn Xây dựng",
        code: "KD&TVXD",
        sub: [],
      },
      {
        name: " Trung tâm Liên kết Đào tạo",
        code: "LKDT",
        sub: [],
      },
      {
        name: " Trung tâm NC và Ứng dụng công nghệ",
        code: "NC&UDCN",
        sub: [],
      },
      { name: " Trung tâm Ngoại ngữ", code: "FLC", inside: true, sub: [] },
      {
        name: " Trung tâm Quản lý chất lượng",
        code: "QLCL",
        sub: [],
      },
      {
        name: " Trung tâm Thông tin và Quản trị mạng",
        code: "TT&QTM",
        sub: [],
      },
      {
        name: " Trung tâm Tư vấn, Hỗ trợ và Khởi nghiệp sinh viên",
        code: "TTHT&KNSV",
        sub: [],
      },
      {
        name: " Công ty TNHH một thành viên KHCN",
        code: "NCKH",
        sub: [],
      },
    ],
  },
];

let stack = [];
for (var i = 0; i < data.length; i++) stack.push(data[i]);

while (stack.length !== 0) {
  item = stack.pop();
  organizationData.push({
    ...item,
    _id: Helpers.toSlug(item.code) + "0".repeat(12 - item.code.length),
    emailAddress: `tranvanhoa15042000+${item.code}@gmail.com`,
    phoneNumber: "0" + Math.floor(Math.random() * 900000000 + 100000000),
  });
  for (var j = 0; j < item.sub.length; j++)
    stack.push({
      ...item.sub[j],
      organ: Helpers.toSlug(item.code) + "0".repeat(12 - item.code.length),
    });
}

module.exports = organizationData;
