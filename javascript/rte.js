let keys = [];
document.addEventListener("keydown", function (event) {
  keys.push(event.key);
  if (keys.slice(-3).join("") === "rte") {
    window.location.href = "https://example.com";
  }
});
