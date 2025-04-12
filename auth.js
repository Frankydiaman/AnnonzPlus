import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvViJjco499G0cQfEyhY0m_mORSAmBH4M",
  authDomain: "annonzplus.firebaseapp.com",
  projectId: "annonzplus",
  storageBucket: "annonzplus.firebasestorage.app",
  messagingSenderId: "573875821045",
  appId: "1:573875821045:web:61195685aef44f180ee8bc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    document.getElementById("error").innerText = error.message;
  }
};

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    document.getElementById("error").innerText = error.message;
  }
};