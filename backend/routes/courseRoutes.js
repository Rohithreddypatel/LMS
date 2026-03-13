const r = require("express").Router();
const c = require("../controllers/courseController");
const { protect, adminOnly } = require("../middleware/auth");

r.get("/meta/categories",  c.categories);
r.get("/admin/all",        protect, adminOnly, c.adminGetAll);
r.get("/",                 c.getAll);
r.get("/:id",              c.getOne);
r.post("/",                protect, adminOnly, c.create);
r.put("/:id",              protect, adminOnly, c.update);
r.delete("/:id",           protect, adminOnly, c.remove);
module.exports = r;
