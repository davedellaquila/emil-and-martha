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

    (story.images || []).forEach(function (src) {
      var figure = el("figure");
      var img = el("img");
      img.src = src;
      img.alt = "Photograph shared by " + (story.name || "a contributor");
      img.loading = "lazy";
      figure.appendChild(img);
      article.appendChild(figure);
    });

    return article;
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
