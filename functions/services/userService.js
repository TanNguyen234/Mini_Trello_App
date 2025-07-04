const admin = require("../utils/firebaseAdmin");
const db = admin.firestore();

const usersRef = db.collection("users");
const codesRef = db.collection("verification_codes");
const boardsRef = db.collection("boards");

exports.createUser = async (email) => {
  const doc = await usersRef.add({ email, createdAt: Date.now() });
  const ok = await boardsRef.add({
        name: "My Trello board",
        description: "",
        ownerId: doc.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
  })
  console.log(ok)
  return { id: doc.id, email };
};

exports.findUserByEmail = async (email) => {
  const snapshot = await usersRef.where("email", "==", email).get();
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

exports.saveVerificationCode = async (email, code) => {
  await codesRef.doc(email).set({ code, createdAt: Date.now() });
};

exports.verifyCode = async (email, code) => {
  const doc = await codesRef.doc(email).get();

  const storedCode = doc.data()?.code;

  return doc.exists && String(storedCode) === String(code);
};