const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const db = admin.firestore();
const boardsRef = db.collection("boards");
const cardsRef = db.collection("cards");
const tasksRef = db.collection("tasks");

//[GET] /boards/:boardId/cards
exports.getCardsByBoard = async (req, res) => {
  const { boardId } = req.params;
  const boardDoc = await boardsRef.doc(boardId).get();
  if (!boardDoc.exists) return res.status(404).json({ error: "Board not found" });
  if (boardDoc.data().ownerId !== req.user.id) return res.sendStatus(403);

  const snapshot = await cardsRef.where("boardId", "==", boardId).get();
  const cards = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description
    };
  });

  res.status(200).json(cards);
};

//[GET] /boards/:boardId/cards/:id
exports.getCardById = async (req, res) => {
  const { boardId, id } = req.params;
  const doc = await cardsRef.doc(id).get();
  if (!doc.exists) return res.status(404).json({ error: "Card not found" });

  const data = doc.data();
  if (data.boardId !== boardId) return res.sendStatus(403);
  if (data.ownerId !== req.user.id && !(data.members || []).includes(req.user.id)) return res.sendStatus(403);

  res.status(200).json({ id: doc.id, name: data.name, description: data.description });
};

//[GET] /boards/:boardId/cards/user/:user_id
exports.getCardsByUser = async (req, res) => {
  const { boardId, user_id } = req.params;
  const boardDoc = await boardsRef.doc(boardId).get();
  if (!boardDoc.exists) return res.status(404).json({ error: "Board not found" });

  const snapshot = await cardsRef
    .where("boardId", "==", boardId)
    .where("members", "array-contains", user_id)
    .get();

  const results = await Promise.all(
    snapshot.docs.map(async doc => {
      const data = doc.data();
      const tasksSnapshot = await tasksRef.where("cardId", "==", doc.id).get();

      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        tasks_count: tasksSnapshot.size,
        list_member: data.members || [],
        createdAt: data.createdAt || null
      };
    })
  );

  res.status(200).json(results);
};

//[POST] /boards/:boardId/cards
exports.createCard = async (req, res) => {
  const { boardId } = req.params;
  const { name, description } = req.body;
  const boardDoc = await boardsRef.doc(boardId).get();
  if (!boardDoc.exists) return res.status(404).json({ error: "Board not found" });
  if (boardDoc.data().ownerId !== req.user.id) return res.sendStatus(403);

  const doc = await cardsRef.add({
    name,
    description,
    boardId,
    ownerId: req.user.id,   
    members: [req.user.id],
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  res.status(201).json({ id: doc.id, name, description });
};

//[PUT] /boards/:boardId/cards/:id
exports.updateCard = async (req, res) => {
  const { boardId, id } = req.params;
  const docRef = cardsRef.doc(id);
  const doc = await docRef.get();

  if (!doc.exists) return res.status(404).json({ error: "Card not found" });
  if (doc.data().boardId !== boardId) return res.sendStatus(403);
  if (doc.data().ownerId !== req.user.id) return res.sendStatus(403);

  await docRef.update(req.body);
  const updated = await docRef.get();
  const data = updated.data();
  res.status(200).json({
    id: updated.id,
    name: data.name,
    description: data.description
  });
};

//[DELETE] /boards/:boardId/cards/:id
exports.deleteCard = async (req, res) => {
  const { boardId, id } = req.params;
  const docRef = cardsRef.doc(id);
  const doc = await docRef.get();

  if (!doc.exists) return res.status(404).json({ error: "Card not found" });
  if (doc.data().boardId !== boardId) return res.sendStatus(403);
  if (doc.data().ownerId !== req.user.id) return res.sendStatus(403);

  await docRef.delete();
  res.sendStatus(204);
};

//[POST] /boards/:boardId/invite
exports.inviteToBoard = async (req, res) => {
  const { boardId } = req.params;
  const { board_owner_id, member_id, email_member, status = "pending" } = req.body;
  const boardDoc = await boardsRef.doc(boardId).get();

  if (!boardDoc.exists) return res.status(404).json({ error: "Board not found" });
  if (board_owner_id !== req.user.id) return res.sendStatus(403);

  const inviteId = uuidv4(); // mã mời ngẫu nhiên

  await db.collection("invitations").doc(inviteId).set({
    boardId,
    boardName: boardDoc.data().name,
    senderId: req.user.id,
    receiverId: member_id,
    receiverEmail: email_member,
    status: "pending",
    createdAt: Date.now()
  });

  // Gửi email mời nếu có email_member
  if (email_member) {
    const acceptUrl = `${FRONTEND_URL}/boards/invite/accept?inviteId=${inviteId}`;
    await sendBoardInviteEmail(email_member, boardDoc.data().name, acceptUrl);
  }

  res.status(200).json({ success: true });
};

//[POST] /boards/:boardId/cards/:id/invite/accept
exports.acceptCardInvite = async (req, res) => {
  const { boardId, id } = req.params;
  const { invite_id, card_id, member_id, status } = req.body;

  if (status !== "accepted" && status !== "declined")
    return res.status(400).json({ error: "Invalid status" });

  if (status === "accepted") {
    const cardRef = cardsRef.doc(card_id);
    await cardRef.update({
      members: admin.firestore.FieldValue.arrayUnion(member_id)
    });
  }

  res.status(200).json({ success: true });
};