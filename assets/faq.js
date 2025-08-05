document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".faq-question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      // Collapse all
      document.querySelectorAll(".faq-question").forEach(function (otherBtn) {
        otherBtn.setAttribute("aria-expanded", "false");
        document.getElementById(
          "faq-answer-" + otherBtn.parentNode.id.split("-").pop()
        ).hidden = true;
      });
      // Expand this one if it was not already expanded
      if (!expanded) {
        btn.setAttribute("aria-expanded", "true");
        document.getElementById(
          "faq-answer-" + btn.parentNode.id.split("-").pop()
        ).hidden = false;
      }
    });
  });
});
