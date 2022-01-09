// sends message to eventPage
const updateContextMenu = async (explorerId, status) => {
  let msg = {
    request: "updateContextMenu",
    explorerId,
    status,
  };

  chrome.runtime.sendMessage(msg);
};

// populate popup with list from chrome storage
chrome.storage.sync.get("explorers", ({ explorers }) => {
  const explorerIds = [];
  for (var key in explorers) {
    if (explorers.hasOwnProperty(key)) {
      explorerIds.push(key);
    }
  }

  const p = document.getElementById("explorers");
  explorerIds.forEach((explorerId) => {
    // create checkbox
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = explorerId;
    cb.checked = explorers[explorerId].active;
    cb.addEventListener("change", (event) => {
      updateContextMenu(event.target.value, event.target.checked);
    });
    cb.id = explorerId;

    const slider = document.createElement("span");
    slider.className = "slider round";

    const toggle = document.createElement("label");
    toggle.className = "switch";
    toggle.appendChild(cb);
    toggle.appendChild(slider);

    // create label
    const label = document.createElement("label");
    label.setAttribute("for", explorerId);
    label.innerHTML = explorerId;
    label.className = "explorerName";

    p.appendChild(toggle);
    p.appendChild(label);
    p.appendChild(document.createElement("br"));
  });
});
