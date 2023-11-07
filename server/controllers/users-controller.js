import { db } from "../connectDB.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// get the user
export const getUser = (req, res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id = ?";

    db.query(q, [userId], (err, data) => {
        if (err) {
            console.log("Error fetching user: " + err.message);
            return res.status(500).json(err);
        }

        if (data.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // should not return the password
        const { password, ...userInfo } = data[0];
        return res.json(userInfo);
    })

};

export const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        console.log("Unauthorized update user: No token authenticated.")
        return res.status(401).json({ error : "Unauthorized update user: No token authenticated."});
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
        if (err) {
            console.log("Unauthorized update user: Invalid or expired token.")
            return res.status(401).json("Unauthorized update user: Invalid or expired token.");
        }
        else {
            console.log("Updating user...")
            const q = "UPDATE users SET `name` = ?, `profilePhoto` = ?, `bio` = ? WHERE id = ?";
            db.query(q, [req.body.name, req.body.profilePhoto, req.body.bio, userInfo.id], (err, data) => {
                if (err) {
                    console.log("Error updating user: " + err.message);
                    return res.status(500).json(err);
                }
                if (data.affectedRows > 0) {
                    console.log("Updated successfully.");
                    return res.json("Updated successfully.");
                }
                console.log("You can only update your profile.");
                return res.status(403).json("You can only update your profile.");
            })
        }
    });
};

export const getUserList = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not Signed In.");
    };

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err) => {
        if (err) {
            console.log("Token not valid");
            return res.status(403).json("Token is not valid.");
        };

        const searchInput = req.query.searchQuery;

        if(searchInput) {
            const q = `SELECT id, name, profilePhoto FROM users
                       WHERE name LIKE ?`;

            const searchValue = `%${searchInput}%`; // Add '%' for partial matching

            db.query(q, [searchValue], (err, data) => {
                if (err) {
                    console.log("Error fetching searched user list: " + err.message);
                    return res.status(500).json(err);
                } else {
                    console.log("Fetched searched user list successfully.");
                    return res.json(data);
                }
            });
        }
        else {

            const q = `SELECT id, name, profilePhoto FROM users`;

            db.query(q, [req.query.userId], (err, data) => {
                if (err) {
                    console.log("Error fetching user list: " + err.message);
                    return res.status(500).json(err);
                } else {
                    //console.log("Fetched user list successfully.");
                    return res.json(data);
                }
            });
        }
    });
};

// for testing the route only
// export const testUsersRoute = (req, res) => {
//     res.send("This users route is working.");
// };