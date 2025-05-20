const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

exports.addProperty = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }
        try {
            const db = admin.firestore();
            const property = {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                imageUrl: req.body.imageUrl,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await db.collection("properties").add(property);
            return res.status(200).json({ message: "Property added successfully" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });
});
