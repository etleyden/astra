/**
 * Routes that retrieve metadata about the application such as 
 * what kind of account types a user can select, what subscription tiers are available, etc. 
 * Data retrieved from these endpoints should be generally static and user independent, 
 * but may be stored in a database to allow for dynamic adjustments independent of the codebase
 */

import express from "express";
import pool from "../db";
import dotenv from "dotenv";
import cors from "cors";

const router = express.Router();
router.use(express.json());
router.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
dotenv.config();

router.get("/account_types", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM acct_types`
        );
        res.status(200).json(result.rows);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error: "Database error"
        });
    }
});

export default router;