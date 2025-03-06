import express, {Request, Response, NextFunction} from "express";
import pool from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const router = express.Router();
router.use(express.json());
dotenv.config();
const jwtSecret = process.env.JWT_PRIVATE_KEY as string;
if(!jwtSecret) console.error("Environment variable for JWT secret is missing");

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const result = await pool.query(
            `SELECT id, first_name, last_name, password FROM app_user
            WHERE email = $1`, [email]);
        if (result.rows.length == 0) {
            res.status(401).json({ error: "Invalid credentials."});
            return;
        }

        console.log(result.rows);
        const valid = await bcrypt.compare(password, result.rows[0].password);
        if(!valid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const token = jwt.sign({ 
            userId: result.rows[0].id,
            first_name: result.rows[0].first_name,
            last_name: result.rows[0].last_name,
            email: email
        }, jwtSecret, { expiresIn: "1d" });
        res.json({token});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Database error"});
    }
});

router.post("/register", async (req, res) => {
    console.log(req.body);
    const { first_name, last_name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            `INSERT INTO app_user (first_name, last_name, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id`,
            [first_name, last_name, email, hashedPassword]);
        res.status(201).json({
            message: "User created",
            userId: result.rows[0]
        });
    } catch(error: any) {
        console.log(error.code == "23505");
        switch(error.code) {
            case "23505":
                // add a "Forgot password" mechanism
                res.status(409).json({
                    error: "A user with this email address has already been created"
                });
                break;
            default:
                res.status(500).json({
                    error: "Database error"
                });
        }
    }
});

// provide authentication middleware as well
interface AuthRequest extends Request {
    user?: {userId: string};
}
const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization") as string;
    if(!token) res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token, jwtSecret) as {userId: string};
        req.user = verified;
        next();
    } catch(error) {
        res.status(400).json({ error: "Invalid token"});
    }
}


// example of a protected route
// app.get("/api/profile", authenticate, async (req, res) => {
//     const user = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [req.user.id]);
//     res.json(user.rows[0]);
// });
export default router;