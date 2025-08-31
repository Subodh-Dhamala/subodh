const menuButton = document.querySelector(".menu-bar");
let isToggle = false;

menuButton.addEventListener("click", () => {
  const menu = document.querySelector(".menu-list");
  if (!isToggle) {
    menu.style.display = "block";
    isToggle = true;
  } else {
    menu.style.display = "none";
    isToggle = false;
  }
});
