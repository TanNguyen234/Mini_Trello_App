const admin = require("firebase-admin");
const db = admin.firestore();

const usersRef = db.collection("users");
const codesRef = db.collection("verification_codes");

exports.createUser = async (email) => {
  const doc = await usersRef.add({ email, createdAt: Date.now() });
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
  return doc.exists && doc.data().code === code;
};