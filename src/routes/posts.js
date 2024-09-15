import { Router } from "express";
import db from "../database/database.js";
import { checkAuth } from "../middlewares/auth.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const snapshot = await db.ref("posts").once("value");
        const posts = [];
        const promises = [];

        snapshot.forEach((doc) => {
            const post = doc.val();
            const promise = db.ref("users/" + post.creator).once("value").then((userSnapshot) => {
                const user = userSnapshot.val();
                posts.push({...post, id: doc.key, creatorName: user ? user.username : "Unknown" });
            });
            promises.push(promise);
        });

        await Promise.all(promises);
        return res.status(200).json({message: 'ok', posts});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post("/create", checkAuth ,async (req, res) => {
    const { content, image, title } = req.body;
    if(content.trim() === "" || title.trim() === "" || image.trim() === "") return res.status(400).json({ message: "Todos los campos son obligatorios" });
    try {
        const post = {
            createdAt: new Date().toISOString(),
            creator: req.user.id,
            content,
            image,
            title
        }
        await db.ref("posts").push(post);
        return res.status(200).json({ message: 'Post creado exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.delete("/delete/:id", checkAuth, (req, res) => {
    try {
        db.ref("posts/" + req.params.id).remove()
        return res.status(200).json({ message: "Post eliminado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
});

router.patch("/update/:id", checkAuth, async (req, res) => {
    const { content, image, title } = req.body;
    if(content.trim() === "" || title.trim() === "" || image.trim() === "") return res.status(400).json({ message: "Todos los campos son obligatorios" });
    try {
        const postRef = db.ref("posts/" + req.params.id);
        const postSnapshot = await postRef.once("value");
        if (!postSnapshot.exists()) return res.status(404).json({ message: "Post no encontrado" });
        const post = postSnapshot.val();
        if (post.creator !== req.user.id) return res.status(403).json({ message: "No tienes permisos para editar este post" });
        await postRef.update({
            createdAt: new Date().toISOString(),
            content,
            image,
            title
        });
        return res.status(200).json({ message: "Post actualizado con éxito" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get("/:id" ,async (req, res) => {
    try {
        const postRef = db.ref("posts/" + req.params.id);
        const postSnapshot = await postRef.once("value");
        if (!postSnapshot.exists()) return res.status(404).json({ message: "Post no encontrado" });
        const post = postSnapshot.val();
        const userSnapshot = await db.ref("users/" + post.creator).once("value");
        const user = userSnapshot.val();
        return res.status(200).json({ message: 'ok', post: {...post, creatorName: user ? user.username : "Unknown" } });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;