const express = require("express");
const slugify = require("slugify");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();

router.get("/", async function (req, res, nest) {
    try {
        const results = await db.query(`SELECT code, name FROM companies ORDER BY name`);
        return res.json({
            "companies": results.rows
        })
    } catch (e) {
        next(e);
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        const {
            code
        } = req.params;
        const comResult = await db.query(`SELECT * FROM companies WHERE code=$1`, [code])

        const invResult = await db.query(
            `SELECT id
             FROM invoices
             WHERE comp_code = $1`,
            [code]
        );

        if (comResult.rows.length === 0) {
            throw new ExpressError(`Can't find company wih code of ${code}`, 404)
        }

        const company = compResult.rows[0];
        const invoices = invResult.rows;

        company.invoices = invoices.map(inv => inv.id);

        return res.json({
            "company": company
        });
    } catch (e) {
        return next(e)
    }
})


router.post('/', async (req, res, next) => {
    try {
        const {
            name,
            description
        } = req.body;
        const code = slugify(name, {
            lower: true
        });
        const result = await db.query(`INSERT INTO companies (code,name, description) VALUES ($1, $2) RETURNING code, name, description`, [code, name, description]);
        return res.status(201).json({
            "company": results.rows[0]
        });
    } catch (e) {
        return next(e)
    }
})

router.put('/:code', async (req, res, next) => {
    try {
        const code = req.params.code;
        const {
            name,
            description
        } = req.body;
        const results = await db.query(`UPDATE companies SET name =$1, description=$2 WHERE code=$3 RETURNING code, name, description`, [code, name, description])
        if (results.rows.length === 0) {
            throw new ExpressError(`No company code of ${code}`, 404)
        }
        return res.send({
            user: results.rows[0]
        })
    } catch (e) {
        return next(e)
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        const code = req.params.code;
        const results = db.query(`DELETE FROM companies WHERE code = $1 RETURNING code`, [code])
        if (results.rows.length === 0) {
            throw new ExpressError(`No company code of ${code}`, 404)
        } else {
            return res.json({
                "status": "deleted"
            });
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router;