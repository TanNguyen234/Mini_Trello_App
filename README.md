
# Mini Trello App

**Mini Trello App** is a Trello-like kanban board application, featuring full backend APIs and a modern frontend design. The backend is complete and functional, while the frontend is currently under development with its UI designed in Figma.

## Project Structure

- **functions/** – Node.js source for Firebase Cloud Functions (the backend API).
- **web/** – Frontend application source (React app under development).
- **public/** – Static assets and hosting root (e.g., `index.html`).
- **firebase.json** – Firebase project configuration.
- **firestore.rules** & **firestore.indexes.json** – Firestore security rules and index definitions.
- **.github/** – CI/CD workflow files.
- **.firebase/** – Firebase CLI local state.

## Prerequisites

- **Node.js** (v14 or newer): [Download here](https://nodejs.org/)
- **Firebase CLI**: Install via `npm install -g firebase-tools`
- **Git** (optional)

---

## How to Run the Project in Development (Windows)

---

## 🔐 Environment Variable Setup

### Backend (`functions/.env`)

Create a `.env` file inside the `functions/` directory with the following content:

```env
MAIL_USER=
MAIL_PASS=
ACCESS_TOKEN_SECRET=jdgaqet39e2y89eykasajkge39qaksjk28l
FRONTEND_URL=http://localhost:3000/
```
### Frontend (`web/.env`)
Create a `.env` file inside the `web/` directory with the following content:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyDH3kayt5wIlvCpcbCKPoDm7bMukPVCrkQ
REACT_APP_FIREBASE_AUTH_DOMAIN=minitrelloapp.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=minitrelloapp
REACT_APP_FIREBASE_STORAGE_BUCKET=minitrelloapp.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=525948028560
REACT_APP_FIREBASE_APP_ID=1:525948028560:web:cfe50c3dfec2a7a7b1fa15
REACT_APP_API_URL=http://localhost:5001/minitrelloapp/us-central1/api
REACT_APP_FIREBASE_MEASUREMENT_ID=G-NXLZ6NKWJC
```

### Backend (Firebase Functions)

```bash
cd functions
npm install
# If using TypeScript:
# npm run build
cd ..
firebase emulators:start
```

This will start the Functions and Firestore emulators locally.

### Frontend (React App)

```bash
cd web
npm install
npm start
```

This will launch the development server, typically at `http://localhost:3000`.

---

## Screenshots

### UI Design

![Board Design](./screenshots/board_ui.PNG)
![Card Design](./screenshots/card_ui.PNG)
![Invite Popup Design](./screenshots/invite_popup_ui.PNG)
![Task Design](./screenshots/task_ui.PNG)
![Login Design](./screenshots/login_ui.PNG)
![Verify Design](./screenshots/verify_code_ui.PNG)

---

## Notes

- The backend API is complete and functional with full support for boards, cards, tasks, GitHub integration, and email-based authentication.
- The frontend is partially implemented and currently supports limited API interactions. The entire UI is available in the linked Figma design.