const admin = require("../utils/firebaseAdmin");
const db = admin.firestore();

exports.createBoard = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  const boardRef = await db.collection("boards").add({
    name,
    description,
    ownerId: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  res.status(201).json({
    id: boardRef.id,
    name,
    description
  });
};