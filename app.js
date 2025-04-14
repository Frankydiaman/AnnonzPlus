// Charger les produits depuis Firebase (version moderne)
async function loadProducts() {
    const { db, collection, onSnapshot } = window.firebaseModules;
    
    const productsRef = collection(db, "products");
    onSnapshot(productsRef, (snapshot) => {
        const productsList = document.getElementById("productsList");
        productsList.innerHTML = "";
        
        snapshot.forEach(doc => {
            const product = doc.data();
            productsList.innerHTML += `
                <div class="product-card">
                    <img src="${product.images?.[0] || 'placeholder.jpg'}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>💰 Prix: ${product.price} FCFA</p>
                    <p>📞 Contact: ${product.seller?.phone || ''}</p>
                    <button onclick="startChat('${product.sellerID}')">Contacter</button>
                </div>
            `;
        });
    });
}

// Chat en temps réel (optimisé)
function startChat(sellerID) {
    const { db, doc, collection, onSnapshot, auth } = window.firebaseModules;
    const chatBox = document.getElementById("chatBox");
    chatBox.style.display = "block";

    const chatId = auth.currentUser.uid < sellerID 
        ? `${auth.currentUser.uid}_${sellerID}`
        : `${sellerID}_${auth.currentUser.uid}`;

    const messagesRef = collection(db, "chats", chatId, "messages");
    
    onSnapshot(messagesRef, (snapshot) => {
        const chatMessages = document.getElementById("chatMessages");
        chatMessages.innerHTML = "";
        snapshot.forEach(doc => {
            const msg = doc.data();
            chatMessages.innerHTML += `
                <p class="${msg.senderId === auth.currentUser.uid ? 'sent' : 'received'}">
                    <b>${msg.senderName}:</b> ${msg.text}
                </p>
            `;
        });
    });
}

// Envoyer un message (sécurisé)
document.getElementById("sendMsgBtn")?.addEventListener("click", async () => {
    const { db, doc, collection, addDoc, serverTimestamp, auth } = window.firebaseModules;
    const msgInput = document.getElementById("chatInput");
    const sellerID = document.getElementById("currentSellerId")?.value;

    if (!sellerID || !msgInput.value.trim()) return;

    const chatId = auth.currentUser.uid < sellerID 
        ? `${auth.currentUser.uid}_${sellerID}`
        : `${sellerID}_${auth.currentUser.uid}`;

    await addDoc(collection(db, "chats", chatId, "messages"), {
        text: msgInput.value,
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName || "Anonyme",
        timestamp: serverTimestamp()
    });
    
    msgInput.value = "";
});

// Gestion de l'authentification
const { auth, onAuthStateChanged, signInAnonymously } = window.firebaseModules;
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Utilisateur connecté:", user.uid);
        loadProducts();
    } else {
        signInAnonymously(auth).catch((error) => {
            console.error("Erreur de connexion anonyme:", error);
        });
    }
});