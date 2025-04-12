// Initialisation Firestore
const db = firebase.firestore();

// Références aux éléments
const marketplaceContainer = document.getElementById("marketplace-container");
const offreForm = document.getElementById("offre-form");
const offresList = document.getElementById("offres-list");

// Afficher/cacher le marketplace
function toggleMarketplace(show) {
    marketplaceContainer.style.display = show ? "block" : "none";
}

// Ajouter une offre
async function ajouterOffre(e) {
    e.preventDefault();
    
    const titre = document.getElementById("titre").value;
    const prix = document.getElementById("prix").value;
    const contact = document.getElementById("contact").value;
    const desc = document.getElementById("desc").value;

    try {
        await db.collection("offres").add({
            titre,
            prix,
            contact,
            desc,
            vendeurId: firebase.auth().currentUser.uid,
            date: new Date()
        });
        
        offreForm.reset();
        chargerOffres();
    } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur est survenue");
    }
}

// Charger les offres
function chargerOffres() {
    offresList.innerHTML = "<h3>Offres récentes</h3>";
    
    db.collection("offres")
        .orderBy("date", "desc")
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                offresList.innerHTML += "<p>Aucune offre disponible</p>";
                return;
            }

            querySnapshot.forEach((doc) => {
                const offre = doc.data();
                offresList.innerHTML += `
                    <div class="offre" style="margin:15px 0; padding:15px; background:#fff; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1)">
                        <h4>${offre.titre} - ${offre.prix} FCFA</h4>
                        <p>${offre.desc}</p>
                        <a href="https://wa.me/${offre.contact}" target="_blank" style="color:var(--primary);">
                            <i class="fab fa-whatsapp"></i> Contacter
                        </a>
                    </div>
                `;
            });
        });
}

// Écouteurs d'événements
if (offreForm) {
    offreForm.addEventListener("submit", ajouterOffre);
}

// Gestion de l'authentification
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        toggleMarketplace(true);
        chargerOffres();
    } else {
        toggleMarketplace(false);
    }
});