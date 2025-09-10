import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "CodingGenius2023",
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentId = 1;
let items = [];

//Edit function
const editItem = async (editId, editTitle) => {
  try {
    const findItem = await db.query("SELECT id FROM items");
    let foundItem = findItem.rows;
    console.log(foundItem);
    let idUpdate = editId;
    let titleUpdate = editTitle;
    let item = foundItem.find( find => find.id == idUpdate);
    console.log(item)
    
    if (item) {
      const result = await db.query("UPDATE items SET title = $1 WHERE id = $2 RETURNING title;", [titleUpdate, idUpdate]);
      
      return result.rows[0];
    }
    

  }catch (err) {
    console.log(err);
    

  }
  
}

const deleteItem = async itemId => {
  await db.query("DELETE FROM items WHERE id = $1", [itemId])
};

const insertItem = async title => {
  await db.query("INSERT INTO items (title) VALUES($1)", [title]);
}
app.get("/", async (req, res) => {
  items = await db.query("SELECT * FROM items");
  items = items.rows;
  let date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const day = date.getDate();
  date = `${month}/${day}/${year}`;
  res.render("index.ejs", {
    listTitle: `Today: ${date}`,
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem; //take the input
  insertItem(item); //input inserted in db through function 
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const updatedItem = req.body
console.log(updatedItem);
let itemUpdate = await editItem(updatedItem.updatedItemId, updatedItem.updatedItemTitle);
console.log(itemUpdate.title);

res.redirect("/");
});



app.post("/delete", async (req, res) => {
  let itemId = req.body.deleteItemId;
  deleteItem(itemId);
  res.redirect("/");
});
//use db query to delete id of the item 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
