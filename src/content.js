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

// Function to send a message to the background script
function sendMessageToBackground(action, data) {
  chrome.runtime.sendMessage({ action, data });
}

// main func
pollForElement(".overflow-hidden", () => {
  pollForElements(
    ".text-gray-400.flex.self-end",
    (targetDivs) => {
      targetDivs.forEach((targetDiv, i) => {
        const icon = document.createElement("div");
        icon.className = "gg-clipboard";

        icon.dataset.index = i; // Storing the index in a data-attribute

        icon.addEventListener("click", function (e) {
          // Grab the index from the clicked element
          const idx = e.target.dataset.index;

          const q = document.querySelector(
            `.unique-id-${idx - 1}`
          );
          const a = document.querySelector(
            `.unique-id-${idx}`
          );

          if (a) {
            const question = q.innerText;
            const answer = a.innerText;

            console.log("Q:", question);
            console.log("A:", answer);
            console.log(typeof answer);

            let qaObj = {
              question: q.innerText,
              answer: a.innerText,
              date: new Date().toISOString(),
            };

            // Send the data to the background script for IndexedDB storage
            sendMessageToBackground(
              "addToIndexedDB",
              qaObj
            );
          }
        });

        let commonAncestor = targetDiv.closest(
          ".group.w-full.text-token-text-primary"
        );

        if (commonAncestor) {
          // Traverse down 6 divs deep to get to the target text div
          let deepNestedDiv = commonAncestor.querySelector(
            "div > div > div > div > div > div"
          );

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
