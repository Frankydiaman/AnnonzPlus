// firebase-app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCNBk3z90lMmJ-Xped7MGFTTiZSF3u1kMM",
    authDomain: "megamarket-8f9e5.firebaseapp.com",
    projectId: "megamarket-8f9e5",
    storageBucket: "megamarket-8f9e5.appspot.com",
    messagingSenderId: "147912633197",
    appId: "1:147912633197:web:a21331716107770f328864"
};

// Initialisation
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    const authScreen = document.getElementById("auth-screen");
    const marketScreen = document.getElementById("marketplace-screen");

    function showAuthScreen() {
        authScreen.classList.remove("hidden");
        marketScreen.classList.add("hidden");
    }

    function showMarketplaceScreen() {
        authScreen.classList.add("hidden");
        marketScreen.classList.remove("hidden");
        loadOffers();
    }

    // Auth state
    onAuthStateChanged(auth, (user) => {
        if (user) showMarketplaceScreen();
        else showAuthScreen();
    });

    // Login
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            alert("Erreur : " + error.message);
        }
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", async () => {
        await signOut(auth);
    });

    // Afficher/Nouvelle offre
    document.getElementById("newOfferBtn").addEventListener("click", () => {
        document.getElementById("offer-form-container").classList.toggle("hidden");
    });

    // Publier offre
    document.getElementById("offerForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("offer-title").value;
        const price = document.getElementById("offer-price").value;
        const contact = document.getElementById("offer-contact").value;
        const desc = document.getElementById("offer-desc").value;

        try {
            const user = auth.currentUser;
            await addDoc(collection(db, "offers"), {
                title,
                price,
                contact,
                desc,
                userId: user.uid,
                createdAt: serverTimestamp()
            });
            document.getElementById("offerForm").reset();
            document.getElementById("offer-form-container").classList.add("hidden");
            loadOffers();
            alert("Offre publiée avec succès !");
        } catch (err) {
            alert("Erreur : " + err.message);
        }
    });

    // Charger offres
    async function loadOffers() {
        const offersList = document.getElementById("offers-list");
        offersList.innerHTML = "<h3 class='text-center'>Chargement...</h3>";

        const q = query(collection(db, "offers"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            offersList.innerHTML = "<p class='text-center'>Aucune offre disponible</p>";
            return;
        }

        offersList.innerHTML = "";
        snapshot.forEach(doc => {
            const offer = doc.data();
            offersList.innerHTML += `
                <div class="offer-card">
                    <h4>${offer.title} - ${offer.price} FCFA</h4>
                    <p>${offer.desc}</p>
                    <a href="https://wa.me/${offer.contact}" target="_blank" style="color: var(--primary);">
                        <i class="fab fa-whatsapp"></i> Contacter
                    </a>
                </div>
            `;
        });
    }
});