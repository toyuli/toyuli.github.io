(function () {
  var API = "https://v2.jinrishici.com/one.json";

  function render(data) {
    var el = document.getElementById("daily-poetry");
    if (!el) return;
    var text = data.content || "";
    var origin = data.origin || "";
    if (text) {
      el.innerHTML =
        '<p class="poetry-text">\u201C' + text + '\u201D</p>' +
        (origin ? '<p class="poetry-source">\u300A' + origin + '\u300B</p>' : "");
    }
  }

  function fallback() {
    var el = document.getElementById("daily-poetry");
    if (el) el.style.display = "none";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    var el = document.getElementById("daily-poetry");
    if (!el) return;
    fetch(API)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.status === "success" && d.data) {
          render(d.data);
        } else {
          fallback();
        }
      })
      .catch(fallback);
  }
})();
