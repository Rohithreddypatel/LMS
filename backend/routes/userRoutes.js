const r = require("express").Router();
const c = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/auth");
r.use(protect, adminOnly);
r.get("/stats",  c.stats);
r.get("/",       c.getAll);
r.put("/:id",    c.update);
r.delete("/:id", c.remove);
module.exports = r;
