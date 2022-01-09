const explorersInfo = {
  Breadcrumbs: {
    baseUrl: "https://www.breadcrumbs.app/reports/",
    active: true,
  },
  Debank: {
    baseUrl: "https://debank.com/profile/",
    active: true,
  },
  Etherscan: {
    baseUrl: "https://etherscan.io/address/",
    active: true,
  },
  Ethtective: {
    baseUrl: "https://ethtective.com/address/",
    active: true,
  },
  Nansen: {
    baseUrl: "https://pro.nansen.ai/wallet-profiler?address=",
    active: true,
  },
  OpenSea: {
    baseUrl: "https://opensea.io/",
    active: true,
  },
  Zapper: {
    baseUrl: "https://zapper.fi/account/",
    active: true,
  },
  Zerion: {
    baseUrl: "https://app.zerion.io/",
    active: true,
  },
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(
    {
      explorers: explorersInfo,
    },
    createContextMenus
  );
});

const createContextMenus = () => {
  chrome.storage.sync.get("explorers", ({ explorers }) => {
    const explorerIds = [];

    for (var key in explorers) {
      if (explorers.hasOwnProperty(key) && explorers[key].active) {
        explorerIds.push(key);
      }
    }

    for (var i = 0; i < explorerIds.length; i++) {
      chrome.contextMenus.create({
        id: explorerIds[i],
        title: explorerIds[i],
        contexts: ["selection", "link"],
      });
    }
  });
};

// receives message from the popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.request === "updateContextMenu") {
    // hide from context menu
    chrome.contextMenus.update(msg.explorerId, { visible: msg.status });

    // update active status in chrome storage
    chrome.storage.sync.get("explorers", ({ explorers }) => {
      explorers[msg.explorerId].active = msg.status;
      chrome.storage.sync.set({
        explorers,
      });
    });
  }
});

chrome.contextMenus.onClicked.addListener((clickData) => {
  // pick out address from the selected text
  if (clickData.selectionText) {
    var newURL =
      explorersInfo[clickData.menuItemId].baseUrl + clickData.selectionText;
    chrome.tabs.create({ url: newURL });
  }
  // pick out address from the href of a supported link
  else if (clickData.linkUrl) {
    const link = clickData.linkUrl;
    if (link.includes("etherscan.io/address/")) {
      const address = link.substring(link.length - 42, link.length);
      var newURL = explorersInfo[clickData.menuItemId].baseUrl + address;
      chrome.tabs.create({ url: newURL });
    } else {
      // alert("Invalid Etherscan link"); // Not available in manifest v3
    }
  }
});
