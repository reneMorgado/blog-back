import { Router } from "express";
import db from "../database/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { checkAuth, checkPermissions, checkAuthorized } from "../middlewares/auth.js";

const router = Router();

const getUser = async (email, username) => {
    const userSnapshot = await db.ref("users").orderByChild("email").equalTo(email).once("value");
    const userData = userSnapshot.val();
    if (!userData) {
        const usernameSnapshot = await db.ref("users").orderByChild("username").equalTo(username).once("value");
        const usernameData = usernameSnapshot.val();
        if(!usernameData) return null;
        const usernameKey = Object.keys(usernameData)[0];
        const usern = usernameData[usernameKey];
        return {id: usernameKey, ...usern};
    }
    const userKey = Object.keys(userData)[0];
    const user = userData[userKey];
    return {id: userKey, ...user};
}

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getUser(email, email);
        if (user === null) return res.status(404).json({ message: "El usuario no existe" });
        const isPasswordValid = await bcrypt.compare(password, user.encriptedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post("/create", async (req, res) => {
    const { username, email, password, isAdmin = false } = req.body;
    try {
        const user = await getUser(email, username);
        if(user) return res.status(409).json({ message: "El correo electrónico ya está en uso" });
        const encriptedPassword = await bcrypt.hash(password, 10);
        await db.ref("users").push({ username, email, encriptedPassword, isAdmin });
        const newUser = await getUser(email, username);
        const token = jwt.sign(newUser, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get("/validateToken", checkAuthorized, (req, res) => {
    return res.status(200).json({ message: "OK" });
})

router.post("/logout", checkAuth, (req, res) => {
    req.user = null;
    return res.status(200).json({ message: "Sesión finalizada" });
})

router.get("/permissions", checkPermissions, (req, res) => {
    if(req.user.isAdmin) {
        return res.status(200).json({ message: ['ADMIN','READ', 'COMMENT', 'APPROVE' ,'CREATE', 'EDIT', 'REMOVE'] });
    }
    return res.status(200).json({ message: ['READ', 'COMMENT'] });
})

router.get("/data", checkAuth, (req, res) => {
    return res.status(200).json({id: req.user.id, name: req.user.username});
})

export default router;