const explorersInfo = {
  Arbiscan: {
    baseUrl: "https://arbiscan.io/tx/",
  },
  Avaxscan: {
    baseUrl: "https://snowtrace.io/tx/",
  },
  BlockSec: {
    baseUrl: "https://phalcon.blocksec.com/tx/eth/",
  },
  Bloxy: {
    baseUrl: "https://bloxy.info/tx/",
  },
  Celoscan: {
    baseUrl: "https://celoscan.io/tx/",
  },
  Cruise: {
    baseUrl: "https://cruise.supremacy.team/detail/?tx=",
  },
  EigenPhi: {
    baseUrl: "https://tx.eigenphi.io/analyseTransaction?chain=ALL&tx=",
  },
  Etherscan: {
    baseUrl: "https://etherscan.io/tx/",
  },
  "Ethtx.info": {
    baseUrl: "https://ethtx.info/mainnet/",
  },
  FTMscan: {
    baseUrl: "https://ftmscan.com/tx/",
  },
  Openchain: {
    baseUrl: "https://openchain.xyz/trace/ethereum/",
  },
  Optiscan: {
    baseUrl: "https://optimistic.etherscan.io/tx/",
  },
  Polyscan: {
    baseUrl: "https://polygonscan.com/tx/",
  },
  Tenderly: {
    baseUrl: "https://dashboard.tenderly.co/tx/mainnet/",
  },
  Viewblock: {
    baseUrl: "https://viewblock.io/starknet/tx/",
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
