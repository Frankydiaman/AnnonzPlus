const adForm = document.getElementById("adForm");
const adList = document.getElementById("adList");

adForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const contact = document.getElementById("contact").value;
  const desc = document.getElementById("desc").value;

  const ad = document.createElement("div");
  ad.classList.add("ad");
  ad.innerHTML = `
    <h3>${title} - ${price} FCFA</h3>
    <p>${desc}</p>
    <a href="https://wa.me/${contact}" target="_blank">Contacter sur WhatsApp</a>
  `;

  adList.prepend(ad);
  adForm.reset();
});