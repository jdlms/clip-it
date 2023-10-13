// poll funcs

function pollForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    setTimeout(
      () => pollForElement(selector, callback),
      300
    );
  }
}

function pollForElements(selector, callback) {
  const elements = document.querySelectorAll(selector);
  if (elements.length > 0) {
    callback(elements);
  } else {
    setTimeout(
      () => pollForElements(selector, callback),
      300
    );
  }
}

// indexedDB

let db;

let openReq = indexedDB.open("QA_Database", 1);

openReq.onupgradeneeded = function (event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains("qaStore")) {
    db.createObjectStore("qaStore", { autoIncrement: true });
  }
};

openReq.onsuccess = function (event) {
  db = event.target.result;
};

// main func

pollForElement(".overflow-hidden", () => {

  pollForElements(
    ".text-gray-400.flex.self-end",
    (targetDivs) => {


      targetDivs.forEach((targetDiv, i) => {
        const icon = document.createElement("div");
        icon.className = "gg-data";

        icon.dataset.index = i; // Storing the index in a data-attribute

        icon.addEventListener('click', function (e) {
          // Grab the index from the clicked element
          const idx = e.target.dataset.index;

          // Use that index to locate the appropriate text
          const q = document.querySelector(`.unique-id-${idx - 1}`);
          const a = document.querySelector(`.unique-id-${idx}`);

          if (a) {
            let question = q.innerText;
            let answer = a.innerText;
            console.log("Q:", question);
            console.log("A:", answer)
            console.log(typeof answer)
            let qaObj = {
              question: q.innerText,
              answer: a.innerText,
              date: new Date().toISOString()
            };

            if (db) {
              let transaction = db.transaction("qaStore", "readwrite");
              let objectStore = transaction.objectStore("qaStore");

              let request = objectStore.add(qaObj);
              request.onsuccess = function () {
                console.log("Q&A saved with ID ", request.result);
              };

              transaction.oncomplete = function () {
                console.log("Transaction completed.");
              };

              transaction.onerror = function (event) {
                console.log("Transaction failed:", event);
              };
            } else {
              console.log("Database hasn't been opened yet.");
            }
          }
        });

        let commonAncestor = targetDiv.closest('.group.w-full.text-token-text-primary');

        if (commonAncestor) {
          // Traverse down 6 divs deep to get to the target text div
          let deepNestedDiv = commonAncestor.querySelector('div > div > div > div > div > div');

          if (deepNestedDiv) {
            deepNestedDiv.classList.add(`unique-id-${i}`);
          }
        }
        let parentDiv = targetDiv.parentNode;
        if (
          !parentDiv.classList.contains("flex-col") &&
          !parentDiv.classList.contains("gap-1") &&
          !parentDiv.classList.contains("md:gap-3")
        ) {
          const iconParent = document.createElement("div");
          iconParent.className = "icon-parent";

          // append 
          iconParent.appendChild(icon);
          targetDiv.appendChild(iconParent);

        }
      });
    }
  );
});
