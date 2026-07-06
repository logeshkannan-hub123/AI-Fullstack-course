function openCertModal(imgSrc, title, issuer) {
  const modal = document.getElementById("certModal");
  const img = document.getElementById("certModalImg");
  const titleEl = document.getElementById("certModalTitle");
  const issuerEl = document.getElementById("certModalIssuer");

  img.src = imgSrc;
  img.alt = title;
  titleEl.textContent = title;
  issuerEl.innerHTML = issuer;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCertModal() {
  const modal = document.getElementById("certModal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCertModal();
});
