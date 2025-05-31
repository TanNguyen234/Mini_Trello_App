const admin = require("../utils/firebaseAdmin");
const db = admin.firestore();

const cardsRef = db.collection("cards");
const tasksRef = db.collection("tasks");
const boardsRef = db.collection("boards");

//[Get] /boards/:boardId/cards/:id/tasks
exports.getTasksByCard = async (req, res) => {
  const { boardId, id } = req.params; // 'id' ở đây chính là cardId

  // 1. Kiểm tra xem card có tồn tại
  const cardDoc = await cardsRef.doc(id).get();
  if (!cardDoc.exists) {
    return res.status(404).json({ error: "Card not found" });
  }

  const cardData = cardDoc.data();

  // 2. Kiểm tra card thuộc board nào
  if (cardData.boardId !== boardId) {
    return res.status(403).json({ error: "Card does not belong to this board" });
  }

  // 3. Kiểm tra quyền của người dùng: owner hoặc member
  if (cardData.ownerId !== req.user.id && !(cardData.members || []).includes(req.user.id)) {
    return res.sendStatus(403);
  }

  // Nếu qua hết 3 bước, lấy tasks
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

  return res.status(200).json(tasks);
};

//[POST] /boards/:boardId/cards/:id/tasks
exports.createTask = async (req, res) => {
  const { boardId, id } = req.params; // 'id' = cardId
  const { title, description, status } = req.body;

  // 1. Kiểm tra card tồn tại
  const cardDoc = await cardsRef.doc(id).get();
  if (!cardDoc.exists) {
    return res.status(404).json({ error: "Card not found" });
  }

  const cardData = cardDoc.data();

  // 2. Kiểm tra card thuộc board này
  if (cardData.boardId !== boardId) {
    return res.status(403).json({ error: "Card does not belong to this board" });
  }

  // 3. Kiểm tra quyền: chỉ owner hoặc member mới được tạo task
  if (cardData.ownerId !== req.user.id && !(cardData.members || []).includes(req.user.id)) {
    return res.sendStatus(403);
  }

  // 4. Tạo task mới
  const doc = await tasksRef.add({
    cardId: id,
    ownerId: req.user.id,
    title,
    description,
    status
  });

  return res.status(201).json({
    id: doc.id,
    cardId: id,
    ownerId: req.user.id,
    title,
    description,
    status
  });
};

//[GET] /boards/:boardId/cards/:id/tasks/:taskId
exports.getTaskDetails = async (req, res) => {
  const { boardId, id, taskId } = req.params; // 'id' = cardId

  // 1. Kiểm tra task tồn tại
  const taskDoc = await tasksRef.doc(taskId).get();
  if (!taskDoc.exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  const taskData = taskDoc.data();
  const cardIdFromTask = taskData.cardId;

  // 2. Kiểm tra card tồn tại
  const cardDoc = await cardsRef.doc(cardIdFromTask).get();
  if (!cardDoc.exists) {
    return res.status(404).json({ error: "Card not found" });
  }

  const cardData = cardDoc.data();

  // 3. Kiểm tra card thuộc đúng board
  if (cardData.boardId !== boardId || cardIdFromTask !== id) {
    return res.status(403).json({ error: "Task does not belong to this card/board" });
  }

  // 4. Kiểm tra quyền owner hoặc member
  if (cardData.ownerId !== req.user.id && !(cardData.members || []).includes(req.user.id)) {
    return res.sendStatus(403);
  }

  // 5. Trả task
  return res.status(200).json({
    id: taskDoc.id,
    cardId: taskData.cardId,
    title: taskData.title,
    description: taskData.description,
    status: taskData.status
  });
};

//[PUT] /boards/:boardId/cards/:id/tasks/:taskkId
exports.updateTask = async (req, res) => {
  const { boardId, id, taskId } = req.params; // 'id' = cardId
  const { card_owner_id, card_id, ...rest } = req.body; // rest chứa các field muốn update

  // 1. Kiểm tra task tồn tại
  const taskDoc = await tasksRef.doc(taskId).get();
  if (!taskDoc.exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  const taskData = taskDoc.data();
  const cardIdFromTask = taskData.cardId;

  // 2. Kiểm tra card tồn tại
  const cardDoc = await cardsRef.doc(cardIdFromTask).get();
  if (!cardDoc.exists) {
    return res.status(404).json({ error: "Card not found" });
  }

  const cardData = cardDoc.data();

  // 3. Kiểm tra card thuộc board + cardId khớp param `id`
  if (cardData.boardId !== boardId || cardIdFromTask !== id) {
    return res.status(403).json({ error: "Task does not belong to this card/board" });
  }

  // 4. Kiểm tra quyền owner card hoặc thành viên
  if (cardData.ownerId !== req.user.id && !(cardData.members || []).includes(req.user.id)) {
    return res.sendStatus(403);
  }

  // 5. Tiến hành cập nhật với `rest` (các field mong muốn)
  await tasksRef.doc(taskId).update(rest);

  return res.status(200).json({ id: taskId, cardId: id });
};

//[DELETE] /boards/:boardId/cards/:id/tasks/:taskkId
exports.deleteTask = async (req, res) => {
  const { boardId, id, taskId } = req.params; // 'id' = cardId

  // 1. Kiểm tra task tồn tại
  const taskDoc = await tasksRef.doc(taskId).get();
  if (!taskDoc.exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  const taskData = taskDoc.data();
  const cardIdFromTask = taskData.cardId;

  // 2. Kiểm tra card tồn tại
  const cardDoc = await cardsRef.doc(cardIdFromTask).get();
  if (!cardDoc.exists) {
    return res.status(404).json({ error: "Card not found" });
  }

  const cardData = cardDoc.data();

  // 3. Kiểm tra card thuộc đúng board + cardId khớp param `id`
  if (cardData.boardId !== boardId || cardIdFromTask !== id) {
    return res.status(403).json({ error: "Task does not belong to this card/board" });
  }

  // 4. Kiểm tra quyền owner card hoặc thành viên
  if (cardData.ownerId !== req.user.id && !(cardData.members || []).includes(req.user.id)) {
    return res.sendStatus(403);
  }

  // 5. Xóa task
  await tasksRef.doc(taskId).delete();
  return res.sendStatus(204);
};

//[POST] /boards/:boardId/cards/:id/tasks/:taskkId/assign
exports.assignMember = async (req, res) => {
  const { boardId, id, taskId } = req.params; // 'id' = cardId
  const { memberId } = req.body;

  // 1. Kiểm tra task tồn tại
  const taskDoc = await tasksRef.doc(taskId).get();
  if (!taskDoc.exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  const taskData = taskDoc.data();
  const cardIdFromTask = taskData.cardId;

  // 2. Kiểm tra card tồn tại
  const cardDoc = await cardsRef.doc(cardIdFromTask).get();
  if (!cardDoc.exists) {
    return res.status(404).json({ error: "Card not found" });
  }

  const cardData = cardDoc.data();

  // 3. Kiểm tra card thuộc đúng board + cardId khớp param `id`
  if (cardData.boardId !== boardId || cardIdFromTask !== id) {
    return res.status(403).json({ error: "Task does not belong to this card/board" });
  }

  // 4. Kiểm tra quyền: chỉ owner card hoặc thành viên mới gán thêm member
  if (cardData.ownerId !== req.user.id && !(cardData.members || []).includes(req.user.id)) {
    return res.sendStatus(403);
  }

  // 5. Gán member
  await tasksRef.doc(taskId).update({
    assignedMembers: admin.firestore.FieldValue.arrayUnion(memberId)
  });

  return res.status(201).json({ taskId, memberId });
};

//[GET] /boards/:boardId/cards/:id/tasks/:taskkId/assign
exports.getAssignedMembers = async (req, res) => {
  const { boardId, id, taskId } = req.params; // 'id' = cardId

  // 1. Kiểm tra task tồn tại
  const taskDoc = await tasksRef.doc(taskId).get();
  if (!taskDoc.exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  const taskData = taskDoc.data();
  const cardIdFromTask = taskData.cardId;

  // 2. Kiểm tra card tồn tại
  const cardDoc = await cardsRef.doc(cardIdFromTask).get();
  if (!cardDoc.exists) {
    return res.status(404).json({ error: "Card not found" });
  }

  const cardData = cardDoc.data();

  // 3. Kiểm tra card thuộc đúng board + cardId khớp param `id`
  if (cardData.boardId !== boardId || cardIdFromTask !== id) {
    return res.status(403).json({ error: "Task does not belong to this card/board" });
  }

  // 4. Kiểm tra quyền: owner card hoặc thành viên mới xem được assignedMembers
  if (cardData.ownerId !== req.user.id && !(cardData.members || []).includes(req.user.id)) {
    return res.sendStatus(403);
  }

  // 5. Lấy assignedMembers
  const result = (taskData.assignedMembers || []).map(m => ({
    taskId,
    memberId: m
  }));

  return res.status(200).json(result);
};

//[DELETE] /boards/:boardId/cards/:id/tasks/:taskkId/assign/:memberId
exports.removeAssignedMember = async (req, res) => {
  const { boardId, id, taskId, memberId } = req.params; // 'id' = cardId

  // 1. Kiểm tra task tồn tại
  const taskDoc = await tasksRef.doc(taskId).get();
  if (!taskDoc.exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  const taskData = taskDoc.data();
  const cardIdFromTask = taskData.cardId;

  // 2. Kiểm tra card tồn tại
  const cardDoc = await cardsRef.doc(cardIdFromTask).get();
  if (!cardDoc.exists) {
    return res.status(404).json({ error: "Card not found" });
  }

  const cardData = cardDoc.data();

  // 3. Kiểm tra card thuộc đúng board + cardId khớp param `id`
  if (cardData.boardId !== boardId || cardIdFromTask !== id) {
    return res.status(403).json({ error: "Task does not belong to this card/board" });
  }

  // 4. Kiểm tra quyền: chỉ owner card hoặc thành viên mới xóa member assignment
  if (cardData.ownerId !== req.user.id && !(cardData.members || []).includes(req.user.id)) {
    return res.sendStatus(403);
  }

  // 5. Thực hiện xóa assigned member
  await tasksRef.doc(taskId).update({
    assignedMembers: admin.firestore.FieldValue.arrayRemove(memberId)
  });

  return res.sendStatus(204);
};