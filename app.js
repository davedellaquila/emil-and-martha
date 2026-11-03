// Renders the story wall from stories.json.
// stories.json: array of {id, name, email, date, title?, paragraphs[], images[]}
(function () {
  var container = document.getElementById("stories");
  if (!container) return;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  }

  function renderStory(story) {
    var article = el("article", "story");

    if (story.title) article.appendChild(el("h3", null, story.title));

    var byline = el("p", "byline");
    byline.appendChild(document.createTextNode("Shared by " + (story.name || "A friend of the family")));
    if (story.email) {
      byline.appendChild(document.createTextNode(" · "));
      var mail = el("a", null, story.email);
      mail.href = "mailto:" + story.email;
      byline.appendChild(mail);
    }
    if (story.date) {
      byline.appendChild(document.createTextNode(" · " + formatDate(story.date)));
    }
    article.appendChild(byline);

    (story.paragraphs || []).forEach(function (para) {
      article.appendChild(el("p", null, para));
    });

    var storyImages = story.images || [];
    storyImages.forEach(function (src, index) {
      var figure = el("figure");
      var img = el("img");
      img.src = src;
      img.alt = "Photograph shared by " + (story.name || "a contributor");
      img.loading = "lazy";
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", "View this photograph full screen");
      img.addEventListener("click", function () {
        openLightbox(storyImages, index, img.alt);
      });
      img.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(storyImages, index, img.alt);
        }
      });
      figure.appendChild(img);
      article.appendChild(figure);
    });

    return article;
  }

  /* ---------- Photo lightbox ----------
     Full-screen viewer, same pattern as the Gazette papers: tap a photo to
     open it as large as the viewport allows; close with ✕, a backdrop tap,
     or Esc; prev/next arrows, arrow keys, and swipe move within the story's
     own photographs, with a position count when there is more than one. */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCount = document.getElementById("lightbox-count");
  var lightboxPrev = document.getElementById("lightbox-prev");
  var lightboxNext = document.getElementById("lightbox-next");
  var lbImages = [];
  var lbIndex = 0;
  var lbAlt = "";
  var touchStartX = null;

  function showCurrent() {
    var multi = lbImages.length > 1;
    lightboxImg.src = lbImages[lbIndex];
    lightboxImg.alt = lbAlt;
    lightboxPrev.style.display = multi ? "" : "none";
    lightboxNext.style.display = multi ? "" : "none";
    lightboxCount.textContent = multi ? (lbIndex + 1) + " / " + lbImages.length : "";
  }

  function openLightbox(images, index, alt) {
    if (!lightbox || !images.length) return;
    lbImages = images;
    lbIndex = index;
    lbAlt = alt || "";
    showCurrent();
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImg.removeAttribute("src");
  }

  function stepLightbox(delta) {
    if (lbImages.length < 2) return;
    lbIndex = (lbIndex + delta + lbImages.length) % lbImages.length;
    showCurrent();
  }

  if (lightbox) {
    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", function () { stepLightbox(-1); });
    lightboxNext.addEventListener("click", function () { stepLightbox(1); });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (lightbox.hidden) return;
      if (event.key === "Escape") closeLightbox();
      else if (event.key === "ArrowLeft") stepLightbox(-1);
      else if (event.key === "ArrowRight") stepLightbox(1);
    });
    lightbox.addEventListener("touchstart", function (event) {
      if (event.changedTouches.length === 1) touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (event) {
      if (touchStartX === null || event.changedTouches.length !== 1) return;
      var dx = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) > 40) stepLightbox(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  fetch("stories.json", { cache: "no-cache" })
    .then(function (res) { return res.json(); })
    .then(function (stories) {
      if (!Array.isArray(stories) || stories.length === 0) return; // keep the gentle empty state
      container.innerHTML = "";
      stories.forEach(function (story) { container.appendChild(renderStory(story)); });
    })
    .catch(function () { /* keep the gentle empty state */ });
})();
