// Configuration Firebase (Remplace par TES infos)
const firebaseConfig = {
    apiKey: "TA_CLE_API",
    authDomain: "TON_PROJET.firebaseapp.com",
    projectId: "TON_PROJET",
    storageBucket: "TON_PROJET.appspot.com",
    messagingSenderId: "TON_ID",
    appId: "TON_APP_ID"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Charger les produits depuis Firebase
function loadProducts() {
    db.collection("products").onSnapshot((snapshot) => {
        const productsList = document.getElementById("productsList");
        productsList.innerHTML = "";
        snapshot.forEach(doc => {
            const product = doc.data();
            productsList.innerHTML += `
                <div class="product-card">
                    <h3>${product.name}</h3>
                    <p>💰 Prix: ${product.price} €</p>
                    <p>🛒 Vendeur: ${product.seller}</p>
                    <button onclick="startChat('${product.sellerID}')">Contacter</button>
                </div>
            `;
        });
    });
}

// Chat en temps réel
function startChat(sellerID) {
    const chatBox = document.getElementById("chatBox");
    chatBox.style.display = "block";

    db.collection("chats").doc(`${auth.currentUser.uid}_${sellerID}`)
        .collection("messages").onSnapshot((snapshot) => {
            const chatMessages = document.getElementById("chatMessages");
            chatMessages.innerHTML = "";
            snapshot.forEach(doc => {
                const msg = doc.data();
                chatMessages.innerHTML += `<p><b>${msg.sender}:</b> ${msg.text}</p>`;
            });
        });
}

// Envoyer un message
document.getElementById("sendMsgBtn").addEventListener("click", () => {
    const msgInput = document.getElementById("chatInput");
    const sellerID = "ID_DU_VENDEUR"; // À remplacer dynamiquement
    db.collection("chats").doc(`${auth.currentUser.uid}_${sellerID}`)
        .collection("messages").add({
            text: msgInput.value,
            sender: auth.currentUser.email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    msgInput.value = "";
});

// Démarrer l'app
auth.onAuthStateChanged(user => {
    if (user) {
        loadProducts();
    } else {
        auth.signInAnonymously(); // Mode invité
    }
});