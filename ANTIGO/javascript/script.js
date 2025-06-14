document.addEventListener("DOMContentLoaded", () => {
    // Efeito de rolagem suave para as seções
    const links = document.querySelectorAll(".nav-link");
  
    links.forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: "smooth"
          });
        }
      });
    });
  });
  