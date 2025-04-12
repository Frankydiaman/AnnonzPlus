// auth.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('loginBtn');

  try {
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
    
    await firebase.auth().signInWithEmailAndPassword(email, password);
    
  } catch (error) {
    let message = "";
    switch(error.code) {
      case "auth/user-not-found":
        message = "Email non enregistré";
        break;
      case "auth/wrong-password":
        message = "Mot de passe incorrect";
        break;
      default:
        message = "Erreur : " + error.message;
    }
    alert(message);
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Se connecter';
  }
});