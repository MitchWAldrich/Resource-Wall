const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const user = req.session.user_id;
    const templateVars = {
      username: user.username
    };
    res.render("create", templateVars);
  })

  router.post("/", (req, res) => {
    const resource = req.body;
    const owner = req.session.user_id

    db.query(`
      INSERT INTO resources(owner_id, category, title, thumbnail_photo_url, summary, description, tag_1, tag_2, tag_3, resource_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
      `, [owner.id, resource.category, resource.title, resource.photo_url, resource.summary, resource.description, resource.tags[0], resource.tags[1], resource.tags[2], resource.resource_url])
    .then((data) => {
      const newResource = data.rows[0];

      res.redirect(`/resource/${newResource.id}`);
      })
    .catch((error) => {
      res.status(400).send(error.message);
    })
  })
  return router;
};
