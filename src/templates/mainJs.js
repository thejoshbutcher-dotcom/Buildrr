// Source of the exported js/main.js — dependency-free, a few KB.

export const mainJs = `// Light interactions — no dependencies.
(function () {
  "use strict";

  // Scroll reveals
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealed = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealed.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealed.forEach(function (el) { io.observe(el); });
  }

  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) links.classList.remove("open");
    });
  }

  // Forms. data-capture decides the flow:
  //   thanks  — no provider wired: go straight to the thank-you page
  //   native  — let the browser POST (provider shows its own confirmation)
  //   netlify — let the browser POST (Netlify captures it, then redirects here)
  //   ajax    — send in the background, then show your own thank-you page
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      var mode = form.getAttribute("data-capture") || "thanks";
      var thanks = form.getAttribute("data-thanks") || "thank-you.html";
      var action = form.getAttribute("action") || "";

      if (mode === "native" || mode === "netlify") {
        if (!action || action === "#") { e.preventDefault(); window.location.href = thanks; }
        return; // otherwise let the native POST proceed
      }

      e.preventDefault();
      if (mode !== "ajax" || !action || action === "#") { window.location.href = thanks; return; }

      var btn = form.querySelector("[type=submit]");
      var label = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
      var err = form.querySelector(".form-error");

      fetch(action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          window.location.href = thanks;
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = label; }
          if (!err) {
            err = document.createElement("p");
            err.className = "form-error";
            err.setAttribute("role", "alert");
            form.appendChild(err);
          }
          err.textContent = "Something went wrong — please try again.";
        });
    });
  });
})();
`
