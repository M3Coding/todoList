import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const db = new Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "CodingGenius2023",
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

//Edit function
const editItem = edit => {
  edit = {
    title: item.title,
    id: item.id
  }
  await db.query("UPDATE items SET title = $1 WHERE id = $2;", [title, id] );
}

const deleteItem = itemId => {
  itemId = item.id
  await db.query("DELETE FROM items WHERE id = $1", [itemId])
};

const insertItem = title => {
  title = item
  await db.query("INSERT INTO items (title) VALUES($1) RETURNING *", [title]);
}
app.get("/", async (req, res) => {\
  //1. add db query here to get the items from the db
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  //1. take in the input
  // 2.needs to insert the item that was inputed into the table with db.query
  //3. push the item into the array 
  const item = req.body.newItem;
  const addedItem = insertItem(item);
  items.push(addedItem);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {});
// 1.Grab id from table using find(function(){do something})
// 2.req.body from the input on the ejs file.

//3.use db query to update the table. 
//4. Use the input to update the table 

app.post("/delete", (req, res) => {});
//use db query to delete id of the item 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
