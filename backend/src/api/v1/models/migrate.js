require("dotenv").config();
const bcrypt = require("bcrypt");
const _book = require("./book.model");
const _user = require("./user.model");

async function start() {
  await _book.deleteMany();
  await _book.create(
    {
      _id: "book00000000",
      bookId: "1",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 1",
    },
    {
      _id: "book00000001",
      bookId: "2",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 2",
    },
    {
      _id: "book00000003",
      bookId: "3",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 3",
    },
    {
      _id: "book00000005",
      bookId: "4",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 4",
    },
    {
      _id: "book00000006",
      bookId: "5",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 5",
    },
    {
      bookId: "6",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 6",
    },
    {
      bookId: "7",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 7",
    },
    {
      bookId: "8",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 1",
    },
    {
      bookId: "8",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 2",
    },
    {
      bookId: "9",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 3",
    },
    {
      bookId: "10",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 4",
    },
    {
      bookId: "11",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 5",
    },
    {
      bookId: "12",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 6",
    },
    {
      bookId: "13",
      bookAuthor: "Tran Van Hoa",
      bookTitle: "Tran Van Hoa 7",
    }
  );

  const password = await bcrypt.hash("12345", parseInt(process.env.SALT));
  await _user.deleteMany();
  await _user.create(
    {
      _id: "user00000001",
      userName: "TranVanHoa",
      userPassword: password,
      userRole: 1,
    },
    {
      _id: "user00000002",
      userName: "TranVanBinh",
      userPassword: password,
      userRole: 2,
    }
  );
  console.log("xong");
}

start();
