(function () {
  // Set Copyright to correct year if it isn't alreay set.
  const year = new Date().getFullYear();
  const copyright = document.querySelector("#copyright");
  copyright.innerText = `Copyright © ${year} - Reload, LLC`;

  // Build Header Menus
  buildHeaderMenus();
})();

function buildHeaderMenus() {
  const links = [
    {
      text: "Listen",
      href: "../listen",
    },
    {
      text: "Press",
      href: "../press",
    },
  ];
  const headerNavUl = document.querySelector("header nav ul");
  let nonTextNodes = 0;
  headerNavUl.childNodes.forEach((node) => {
    if (node.nodeType != Node.TEXT_NODE) {
      nonTextNodes++;
    }
  });
  if (nonTextNodes === 1) {
    links.forEach((link) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.href;
      a.innerText = link.text;
      li.appendChild(a);
      headerNavUl.appendChild(li);
    });
  }
}
