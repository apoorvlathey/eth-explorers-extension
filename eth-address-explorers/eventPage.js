const explorersInfo = {
  ABIw1nt3r: {
    baseUrl: "https://abi.w1nt3r.xyz/mainnet/",
    active: true,
  },
  Arbiscan: { 
    baseUrl: "https://arbiscan.io/address/",
    active: true,
  },
  Blockscan: {
    baseUrl: "https://blockscan.com/address/",
    active: true,
  },
  Breadcrumbs: {
    baseUrl: "https://www.breadcrumbs.app/reports/",
    active: true,
  },
  BscScan: {
    baseUrl: "https://bscscan.com/address/",
    active: true,
  },
  Bytegraph: {
    baseUrl: "https://bytegraph.xyz/contract/",
    active: true,
  },
  CeloScan : {
    baseUrl: "https://celoscan.io/address/",
    active: true,
  },
  ContractReader : {
    baseUrl: "https://www.contractreader.io/contract/",
    active: true,
  },
  Debank: {
    baseUrl: "https://debank.com/profile/",
    active: true,
  },
  Dedaub: {
    baseUrl: "https://library.dedaub.com/ethereum/address/",
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
  FTMScan: {
    baseUrl: "https://ftmscan.com/address/",
    active: true,
  },
  GemAccount: {
    baseUrl: "https://www.gem.xyz/profile/",
    active: true,
  },
  GemCollection: {
    baseUrl: "https://www.gem.xyz/collection/",
    active: true,
  },
  GnosisScan: {
    baseUrl: "https://gnosisscan.io/address/",
    active: true,
  },
  Impersonator: {
    baseUrl: "https://www.impersonator.xyz/?address=",
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
  OptimismScan: {
    baseUrl: "https://optimistic.etherscan.io/address/",
    active: true,
  },
  PolygonScan: {
    baseUrl: "https://polygonscan.com/address/",
    active: true,
  },
  Remix: {
    baseUrl: "https://remix.ethereum.org/#address=",
    active: true,
  },
  SIMExplorer: {
    baseUrl: "https://explorer.sim.io/eth/latest/",
    active: true,   
  }
  SnowTrace: {
    baseUrl: "https://snowtrace.io/address/",
    active: true,
  },
  Solidlint: {
    baseUrl: "https://www.solidlint.com/address/",
    active: true,
  },
  StorageViewer: {
    baseUrl: "https://tintinweb.github.io/smart-contract-storage-viewer?",
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
// create a constant array of supported URLs
const supportedURLs = [
  "arbiscan.io/address/",
  "bscscan.com/address/",
  "celoscan.io/address/",
  "etherscan.io/address/",
  "ftmscan.com/address/",
  "gnosisscan.io/address/",
  "optimistic.etherscan.io/address/",
  "polygonscan.com/address/",
  "snowtrace.io/address/",
];

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
    if (supportedURLs.some((el) => link.includes(el))) {
      const address = link.substring(link.length - 42, link.length);
      var newURL = explorersInfo[clickData.menuItemId].baseUrl + address;
      chrome.tabs.create({ url: newURL });
    } else {
      // alert("Invalid Etherscan link"); // Not available in manifest v3
    }
  }
});
