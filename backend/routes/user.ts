/**
 * Modifying user data
 */
import express from "express";
import pool from "../db";
import { authenticate, AuthRequest } from "./auth";
import dotenv from "dotenv";
import cors from "cors";

const router = express.Router();
router.use(express.json());
dotenv.config();
router.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

router.post("/add_account", authenticate, async (req: AuthRequest, res) => {
    const {name, description, type} = req.body;
    
    try {
        // TODO: validate that this user does not already have an account by this exact name
        const result = await pool.query(
            `INSERT INTO acct (name, acct_type_id, description, app_user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id`, 
            [name, type, description, req.user?.userId]);

        res.status(201).json({acct_id: result.rows[0].id});

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Database error"});
    }
    console.log(req.body);
    console.log(req.user?.userId);
    console.log("It works!");
});

// retrieve the nicknames of a logged in user's accounts
router.get("/accounts", authenticate, async (req: AuthRequest, res) => {
    try {
        let result = await pool.query(`
            SELECT id, name FROM acct 
            WHERE app_user_id=$1`, [req.user?.userId]);
        res.status(200).json(result.rows);
        console.log(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
})
export default router;
