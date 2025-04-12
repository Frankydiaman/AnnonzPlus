<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MegaMarket</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #4361ee;
            --secondary: #3f37c9;
            --accent: #4895ef;
            --light: #f8f9fa;
            --dark: #212529;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
            margin: 0;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .auth-card, .offer-card, .product-card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s;
            margin: 5px;
        }
        
        .btn:hover {
            background: var(--secondary);
        }
        
        .btn-group {
            display: flex;
            justify-content: center;
            margin: 20px 0;
        }
        
        input, textarea {
            width: 100%;
            padding: 12px;
            margin: 8px 0;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 16px;
        }
        
        .hidden {
            display: none;
        }
        
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .product-item {
            background: white;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        
        .image-preview {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 8px;
            margin: 10px 0;
            border: 2px dashed var(--accent);
            display: none;
        }
        
        .upload-btn {
            background: var(--accent);
            color: white;
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            margin: 10px 0;
        }
        
        .product-item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Écran de connexion -->
        <div id="auth-screen" class="auth-card">
            <h2 style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-store"></i> MegaMarket
            </h2>
            <form id="loginForm">
                <div>
                    <label>Email</label>
                    <input type="email" id="email" placeholder="votre@email.com" required>
                </div>
                <div>
                    <label>Mot de passe</label>
                    <input type="password" id="password" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn" style="width: 100%; margin-top: 15px;">
                    <i class="fas fa-sign-in-alt"></i> Se connecter
                </button>
            </form>
        </div>

        <!-- Interface après connexion -->
        <div id="main-screen" class="hidden">
            <div style="text-align: right; margin-bottom: 15px;">
                <button id="logoutBtn" class="btn">
                    <i class="fas fa-sign-out-alt"></i> Déconnexion
                </button>
            </div>
            
            <div class="btn-group">
                <button id="btnOffers" class="btn active">
                    <i class="fas fa-bullhorn"></i> Publier une offre
                </button>
                <button id="btnProducts" class="btn">
                    <i class="fas fa-shopping-bag"></i> Marketplace
                </button>
            </div>
            
            <!-- Section Offres -->
            <div id="offers-section">
                <div class="offer-card">
                    <h3><i class="fas fa-plus-circle"></i> Nouvelle offre</h3>
                    <form id="offerForm">
                        <input type="text" id="offer-title" placeholder="Titre" required>
                        <input type="number" id="offer-price" placeholder="Prix (FCFA)" required>
                        
                        <label class="upload-btn">
                            <i class="fas fa-camera"></i> Choisir une image
                            <input type="file" id="image-upload" accept="image/*" style="display:none;">
                        </label>
                        <img id="image-preview" class="image-preview">
                        
                        <input type="text" id="offer-contact" placeholder="WhatsApp (ex: 221701234567)" required>
                        <textarea id="offer-desc" placeholder="Description" rows="3" required></textarea>
                        <button type="submit" class="btn" style="width: 100%;">
                            <i class="fas fa-paper-plane"></i> Publier
                        </button>
                    </form>
                </div>
            </div>
            
            <!-- Section Produits -->
            <div id="products-section" class="hidden">
                <div class="product-card">
                    <h3><i class="fas fa-store-alt"></i> Marketplace</h3>
                    <div id="products-list" class="product-grid">
                        <!-- Les produits s'afficheront ici -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Firebase SDK + ImgBB Intégration -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
        import { 
            getAuth, 
            signInWithEmailAndPassword,
            signOut,
            onAuthStateChanged
        } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
        import { 
            getFirestore,
            collection,
            addDoc,
            getDocs,
            query,
            orderBy
        } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

        // Configuration Firebase
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

        // =============================================
        // INTÉGRATION IMGBB
        // =============================================
        let selectedFile = null;
        const IMGBB_API_KEY = "0b2386aaacc431a5a5997a611c004190"; // 🚨 TA CLÉ ICI
        
        document.getElementById('image-upload').addEventListener('change', (e) => {
            selectedFile = e.target.files[0];
            const preview = document.getElementById('image-preview');
            
            if (selectedFile) {
                // Vérifie la taille (5MB max)
                if (selectedFile.size > 5_000_000) {
                    alert("L'image est trop lourde (max 5MB)");
                    return;
                }
                preview.src = URL.createObjectURL(selectedFile);
                preview.style.display = 'block';
            }
        });

        async function uploadToImgBB(file) {
            const formData = new FormData();
            formData.append('image', file);
            
            try {
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) throw new Error("Échec de l'upload");
                const data = await response.json();
                return data.data.url; // Retourne l'URL de l'image
                
            } catch (error) {
                console.error("Erreur ImgBB:", error);
                throw error;
            }
        }

        // Gestion du formulaire
        document.getElementById('offerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publication...';

            try {
                const title = document.getElementById('offer-title').value;
                const price = document.getElementById('offer-price').value;
                const contact = document.getElementById('offer-contact').value;
                const desc = document.getElementById('offer-desc').value;
                
                let imageUrl = '';
                if (selectedFile) {
                    imageUrl = await uploadToImgBB(selectedFile);
                }

                await addDoc(collection(db, "offers"), {
                    title,
                    price,
                    contact,
                    desc,
                    imageUrl, // URL de l'image depuis ImgBB
                    date: new Date(),
                    userId: auth.currentUser.uid
                });
                
                // Réinitialisation du formulaire
                e.target.reset();
                document.getElementById('image-preview').style.display = 'none';
                selectedFile = null;
                
                alert("✅ Offre publiée avec succès !");
                loadProducts(); // Actualise la liste
                
            } catch (error) {
                console.error("Erreur:", error);
                alert("❌ Erreur : " + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publier';
            }
        });

        // =============================================
        // AFFICHAGE DES PRODUITS (À COPIER À PARTIR D'ICI)
        // =============================================

        async function loadProducts() {
            const productsList = document.getElementById('products-list');
            productsList.innerHTML = '<p>Chargement en cours...</p>';
            
            const q = query(collection(db, "offers"), orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            
            productsList.innerHTML = '';
            
            if (querySnapshot.empty) {
                productsList.innerHTML = '<p class="text-center">Aucune offre disponible</p>';
                return;
            }

            querySnapshot.forEach((doc) => {
                const product = doc.data();
                productsList.innerHTML += `
                    <div class="product-item">
                        ${product.imageUrl ? 
                          `<img src="${product.imageUrl}" alt="${product.title}" loading="lazy">` : 
                          `<div class="placeholder-image">
                            <i class="fas fa-image"></i>
                           </div>`
                        }
                        <h4>${product.title}</h4>
                        <p class="price"><strong>${product.price} FCFA</strong></p>
                        <p class="description">${product.desc.substring(0, 60)}${product.desc.length > 60 ? '...' : ''}</p>
                        <a href="https://wa.me/${product.contact}" target="_blank" class="btn whatsapp-btn">
                            <i class="fab fa-whatsapp"></i> Contacter
                        </a>
                    </div>
                `;
            });
        }

        // =============================================
        // GESTION DE L'INTERFACE
        // =============================================
        function showAuthScreen() {
            document.getElementById('auth-screen').classList.remove('hidden');
            document.getElementById('main-screen').classList.add('hidden');
        }

        function showMainScreen() {
            document.getElementById('auth-screen').classList.add('hidden');
            document.getElementById('main-screen').classList.remove('hidden');
            showOffersSection();
        }

        function showOffersSection() {
            document.getElementById('offers-section').classList.remove('hidden');
            document.getElementById('products-section').classList.add('hidden');
            document.getElementById('btnOffers').classList.add('active');
            document.getElementById('btnProducts').classList.remove('active');
        }

        function showProductsSection() {
            document.getElementById('offers-section').classList.add('hidden');
            document.getElementById('products-section').classList.remove('hidden');
            document.getElementById('btnOffers').classList.remove('active');
            document.getElementById('btnProducts').classList.add('active');
            loadProducts();
        }

        // =============================================
        // ÉCOUTEURS D'ÉVÉNEMENTS
        // =============================================
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const submitBtn = e.target.querySelector('button');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
                
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                let message = "Erreur de connexion";
                switch(error.code) {
                    case "auth/invalid-email": message = "Email invalide"; break;
                    case "auth/user-not-found": message = "Compte inexistant"; break;
                    case "auth/wrong-password": message = "Mot de passe incorrect"; break;
                }
                alert(message);
                
                const submitBtn = e.target.querySelector('button');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Se connecter';
            }
        });

        document.getElementById('logoutBtn').addEventListener('click', async () => {
            try {
                await signOut(auth);
            } catch (error) {
                alert("Erreur lors de la déconnexion: " + error.message);
            }
        });

        document.getElementById('btnOffers').addEventListener('click', showOffersSection);
        document.getElementById('btnProducts').addEventListener('click', showProductsSection);

        // =============================================
        // SURVEILLANCE DE L'AUTHENTIFICATION
        // =============================================
        onAuthStateChanged(auth, (user) => {
            if (user) {
                showMainScreen();
                loadProducts();
            } else {
                showAuthScreen();
            }
        });

        // =============================================
        // STYLE DYNAMIQUE (OPTIONNEL)
        // =============================================
        document.querySelectorAll('input, textarea').forEach(el => {
            el.addEventListener('focus', () => {
                el.style.borderColor = 'var(--accent)';
                el.style.boxShadow = '0 0 0 3px rgba(72, 149, 239, 0.2)';
            });
            el.addEventListener('blur', () => {
                el.style.borderColor = '#e9ecef';
                el.style.boxShadow = 'none';
            });
        });
    </script>
</body>
</html>