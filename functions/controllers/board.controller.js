const admin = require("../utils/firebaseAdmin");
const db = admin.firestore();
const boardsRef = db.collection("boards");

exports.getBoards = async (req, res) => {
  const snapshot = await boardsRef.where("ownerId", "==", req.user.id).get();
  const boards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(boards);
};

exports.createBoard = async (req, res) => {
  const { name, description } = req.body;

  const doc = await boardsRef.add({
    name,
    description,
    ownerId: req.user.id,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  res.status(201).json({ id: doc.id, name, description });
};

exports.getBoardById = async (req, res) => {
  const doc = await boardsRef.doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: "Board not found" });

  const board = doc.data();
  if (board.ownerId !== req.user.id)
    return res.status(403).json({ error: "Unauthorized" });

  res.json({ id: doc.id, ...board });
};

exports.updateBoard = async (req, res) => {
  const docRef = boardsRef.doc(req.params.id);
  const doc = await docRef.get();

  if (!doc.exists) return res.status(404).json({ error: "Board not found" });
  if (doc.data().ownerId !== req.user.id)
    return res.status(403).json({ error: "Unauthorized" });

  await docRef.update(req.body);
  res.json({ message: "Board updated" });
};

exports.deleteBoard = async (req, res) => {
  const docRef = boardsRef.doc(req.params.id);
  const doc = await docRef.get();

  if (!doc.exists) return res.status(404).json({ error: "Board not found" });
  if (doc.data().ownerId !== req.user.id)
    return res.status(403).json({ error: "Unauthorized" });

  await docRef.delete();
  res.json({ message: "Board deleted" });
};