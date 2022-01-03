const explorersInfo = {
  Breadcrumbs: {
    baseUrl: "https://www.breadcrumbs.app/reports/",
  },
  Debank: {
    baseUrl: "https://debank.com/profile/",
  },
  Etherscan: {
    baseUrl: "https://etherscan.io/address/",
  },
  Ethtective: {
    baseUrl: "https://ethtective.com/address/",
  },
  Nansen: {
    baseUrl: "https://pro.nansen.ai/wallet-profiler?address=",
  },
  OpenSea: {
    baseUrl: "https://opensea.io/",
  },
  Zapper: {
    baseUrl: "https://zapper.fi/account/",
  },
  Zerion: {
    baseUrl: "https://app.zerion.io/",
  },
};

const explorerIds = [];

for (var key in explorersInfo) {
  if (explorersInfo.hasOwnProperty(key)) {
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

chrome.contextMenus.onClicked.addListener((clickData) => {
  if (explorersInfo.hasOwnProperty(clickData.menuItemId)) {
    if (clickData.selectionText) {
      var newURL =
        explorersInfo[clickData.menuItemId].baseUrl + clickData.selectionText;
      chrome.tabs.create({ url: newURL });
    } else if (clickData.linkUrl) {
      const link = clickData.linkUrl;
      if (link.includes("etherscan.io/address/")) {
        const address = link.substring(link.length - 42, link.length);
        var newURL = explorersInfo[clickData.menuItemId].baseUrl + address;
        chrome.tabs.create({ url: newURL });
      } else {
        // alert("Invalid Etherscan link"); // Not available in manifest v3
      }
    }
  }
});
