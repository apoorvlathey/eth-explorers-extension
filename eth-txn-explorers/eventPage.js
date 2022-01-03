const explorersInfo = {
  Etherscan: {
    baseUrl: "https://etherscan.io/tx/",
  },
  Bloxy: {
    baseUrl: "https://bloxy.info/tx/",
  },
  "Ethtx.info": {
    baseUrl: "https://ethtx.info/mainnet/",
  },
  Tenderly: {
    baseUrl: "https://dashboard.tenderly.co/tx/mainnet/",
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
    contexts: ["selection"],
  });
}

chrome.contextMenus.onClicked.addListener((clickData) => {
  if (
    explorersInfo.hasOwnProperty(clickData.menuItemId) &&
    clickData.selectionText
  ) {
    if (!validateTxnHash(clickData.selectionText)) {
      // alert("Txn Hash is invalid!"); // Not available in manifest v3
      return;
    }

    var newURL =
      explorersInfo[clickData.menuItemId].baseUrl + clickData.selectionText;
    chrome.tabs.create({ url: newURL });
  }
});

const validateTxnHash = (str) => {
  return /^0x([A-Fa-f0-9]{64})$/.test(str);
};
