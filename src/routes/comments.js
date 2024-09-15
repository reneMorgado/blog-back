import { Router } from "express";
import db from "../database/database.js";
import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/create", checkAuth, async (req, res) => {
    const { content, postId } = req.body;
    if(content.trim() === "") return res.status(400).json({ message: "El comentario no puede estar vacío" });
    try {
        const comment = {
            createdAt: new Date().toISOString(),
            creator: req.user.id,
            content,
            postId,
            approved: false,
        }
        await db.ref("comments").push(comment);
        return res.status(200).json({ message: "Comentario creado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


router.patch("/approve/:commentId", checkAuth, async (req, res) => {
    try {
        await db.ref("comments/" + req.params.commentId).update({ approved: true });
        return res.status(200).json({ message: "Comentario aprobado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.delete("/delete/:commentId", checkAuth, async (req, res) => {
    try {
        await db.ref("comments/" + req.params.commentId).remove()
        return res.status(200).json({ message: "Comentario eliminado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
});

export default router;