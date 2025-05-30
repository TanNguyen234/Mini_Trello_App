const admin = require("../utils/firebaseAdmin");
const db = admin.firestore();

const cardsRef = db.collection("cards");
const tasksRef = db.collection("tasks");
const boardsRef = db.collection("boards");

//[Get] /boards/:boardId/cards/:id/tasks
exports.getTasksByCard = async (req, res) => {
  const { boardId, id } = req.params;
  const cardDoc = await cardsRef.doc(id).get();
  if (!cardDoc.exists) return res.status(404).json({ error: "Card not found" });

  const snapshot = await tasksRef.where("cardId", "==", id).get();
  const tasks = snapshot.docs.map(doc => {
    const d = doc.data();
    return {
      id: doc.id,
      cardId: d.cardId,
      title: d.title,
      description: d.description,
      status: d.status
    };
  });

  res.status(200).json(tasks);
};

//[POST] /boards/:boardId/cards/:id/tasks
exports.createTask = async (req, res) => {
  const { boardId, id } = req.params;
  const { title, description, status } = req.body;

  const doc = await tasksRef.add({
    cardId: id,
    ownerId: req.user.id,
    title,
    description,
    status
  });

  res.status(201).json({
    id: doc.id,
    cardId: id,
    ownerId: req.user.id,
    title,
    description,
    status
  });
};

//[GET] /boards/:boardId/cards/:id/tasks/:taskkId
exports.getTaskDetails = async (req, res) => {
  const { boardId, id, taskId } = req.params;
  const doc = await tasksRef.doc(taskId).get();
  if (!doc.exists) return res.status(404).json({ error: "Task not found" });

  const data = doc.data();
  res.status(200).json({
    id: doc.id,
    cardId: data.cardId,
    title: data.title,
    description: data.description,
    status: data.status
  });
};

//[PUT] /boards/:boardId/cards/:id/tasks/:taskkId
exports.updateTask = async (req, res) => {
  const { boardId, id, taskId } = req.params;
  const { card_owner_id, card_id, ...rest } = req.body;

  const docRef = tasksRef.doc(taskId);
  const doc = await docRef.get();
  if (!doc.exists) return res.status(404).json({ error: "Task not found" });

  await docRef.update(rest);
  res.status(200).json({ id: taskId, cardId: id });
};

//[DELETE] /boards/:boardId/cards/:id/tasks/:taskkId
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const doc = await tasksRef.doc(taskId).get();
  if (!doc.exists) return res.status(404).json({ error: "Task not found" });

  await tasksRef.doc(taskId).delete();
  res.sendStatus(204);
};

//[POST] /boards/:boardId/cards/:id/tasks/:taskkId/assign
exports.assignMember = async (req, res) => {
  const { taskId } = req.params;
  const { memberId } = req.body;

  await tasksRef.doc(taskId).update({
    assignedMembers: admin.firestore.FieldValue.arrayUnion(memberId)
  });

  res.status(201).json({ taskId, memberId });
};

//[GET] /boards/:boardId/cards/:id/tasks/:taskkId/assign
exports.getAssignedMembers = async (req, res) => {
  const { taskId } = req.params;
  const doc = await tasksRef.doc(taskId).get();
  if (!doc.exists) return res.status(404).json({ error: "Task not found" });

  const data = doc.data();
  const result = (data.assignedMembers || []).map(m => ({
    taskId,
    memberId: m
  }));

  res.status(200).json(result);
};

//[DELETE] /boards/:boardId/cards/:id/tasks/:taskkId/assign/:memberId
exports.removeAssignedMember = async (req, res) => {
  const { taskId, memberId } = req.params;

  await tasksRef.doc(taskId).update({
    assignedMembers: admin.firestore.FieldValue.arrayRemove(memberId)
  });

  res.sendStatus(204);
};