
const slugify = require('slugify')
const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");


router.get("/", async (req, res, next) => {
    try {
        const result = await db.query(
            `SELECT i.code, i.industry, c.code
               FROM industries AS i
                 LEFT JOIN comp_industries AS ci 
                   ON i.code = ci.ind_code
                 LEFT JOIN companies AS c ON ci.ind_code = c.code`);
  
      let { code, industry } = result.rows[0];
      let comp_codes = result.rows.map(r => r.code);
  
      return res.json({ code, industry, comp_codes });
    } catch (err) {
        return next(err);
    }
});



router.post("/", async (req, res, next) => {
    try {
        let {name, industry} = req.body;
    
        const result = await db.query(
              `INSERT INTO industries (code, industry) 
               VALUES ($1, $2) 
               RETURNING code, industry`,
            [code, industry]);
    
        return res.status(201).json({"industry": result.rows[0]});
      }
    
      catch (err) {
        return next(err);
      }
    });

router.post("/comp_industries", async (req, res, next) => {
    try {
        let {comp_code, ind_code} = req.body;
    
        const result = await db.query(
                `INSERT INTO comp_industries (comp_code, ind_code) 
                VALUES ($1, $2) 
                RETURNING comp_code, ind_code`,
            [comp_code, ind_code]);
    
        return res.status(201).json({"comp_industry": result.rows[0]});
        }
    
        catch (err) {
        return next(err);
        }
    });  
    

module.exports = comRoutes;