// Open IndexedDB and specify the version number
const openRequest = indexedDB.open("QA_Clips", 1);

openRequest.onupgradeneeded = function (event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains("QA-Store")) {
    db.createObjectStore("QA-Store", {
      autoIncrement: true,
    });
  }
};

// Handle success and errors
openRequest.onsuccess = function (event) {
  console.log("IndexedDB is successfully opened.");

  chrome.action.onClicked.addListener(() => {
    const url = chrome.runtime.getURL("src/index.html");
    chrome.tabs.create({ url });
  });

  // Listen for messages from content.js and Preact components
  chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
      if (message.action === "addToIndexedDB") {
        // Open IndexedDB and add data
        const db = event.target.result;
        const transaction = db.transaction(
          "QA-Store",
          "readwrite"
        );
        const objectStore =
          transaction.objectStore("QA-Store");

        // Add data to the object store
        const addRequest = objectStore.add(message.data);

        addRequest.onsuccess = (event) => {
          console.log("Data added to IndexedDB");
        };
      }
    }
  );

  // Listen for connections from Preact components
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "popup") {
      port.onMessage.addListener((message) => {
        if (message.action === "getDataFromIndexedDB") {
          // Open IndexedDB and retrieve data
          const db = event.target.result;
          const transaction = db.transaction(
            "QA-Store",
            "readonly"
          );
          const objectStore =
            transaction.objectStore("QA-Store");

          // Retrieve data from the object store
          const getAllRequest = objectStore.getAll();

          getAllRequest.onsuccess = (event) => {
            const data = event.target.result;
            // Send data to the component
            port.postMessage({
              action: "sendDataFromIndexedDB",
              data,
            });
          };
        }
      });
    }
  });
};

openRequest.onerror = function (event) {
  console.error(
    "Error opening IndexedDB:",
    event.target.error
  );
};
