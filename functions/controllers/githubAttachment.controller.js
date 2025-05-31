const admin = require("../utils/firebaseAdmin");
const db = admin.firestore();
const attachmentsRef = db.collection("task_attachments");

//[POST] /boards/:boardId/cards/:cardId/tasks/:taskId/
exports.attachGitHubToTask = async (req, res) => {
  const { taskId } = req.params;
  const { type, number } = req.body;

  const doc = await attachmentsRef.add({
    taskId,
    type,
    value: number
  });

  res.status(201).json({
    taskId,
    attachmentId: doc.id,
    type,
    number
  });
};

exports.getTaskAttachments = async (req, res) => {
  const { taskId } = req.params;
  const snapshot = await attachmentsRef.where("taskId", "==", taskId).get();

  const result = snapshot.docs.map(doc => {
    const d = doc.data();
    return {
      attachmentId: doc.id,
      type: d.type,
      ...(d.type === "commit"
        ? { sha: d.value }
        : { number: d.value })
    };
  });

  res.status(200).json(result);
};

exports.removeAttachment = async (req, res) => {
  const { attachmentId } = req.params;
  await attachmentsRef.doc(attachmentId).delete();
  res.sendStatus(204);
};