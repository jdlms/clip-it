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
            const answer = a.innerText
              .replace(/\n/g, "<br>")
              .replace(/;+$/, "");

            console.log("Q:", question);
            console.log("A:", answer);
            console.log(typeof answer);

            let qaObj = {
              question: question,
              answer: answer,
              date: new Date().toLocaleDateString(),
            };

            // Send the data to the background script for IndexedDB storage
            sendMessageToBackground(
              "addToIndexedDB",
              qaObj
            );
          }
          chrome.runtime.sendMessage({ iconClicked: true });
        });

        let commonAncestor = targetDiv.closest(
          ".w-full.text-token-text-primary"
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

        // insert icon only in answers
        let parentDiv = targetDiv.parentNode;
        let parentSibling = parentDiv.previousSibling;
        if (
          parentSibling.querySelector(
            'div[data-message-author-role="assistant"]'
          )
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

////
let debounceTimer;

const observerCallback = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
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
                const answer = a.innerText
                  .replace(/\n/g, "<br>")
                  .replace(/;+$/, "");

                console.log("Q:", question);
                console.log("A:", answer);
                console.log(typeof answer);

                let qaObj = {
                  question: question,
                  answer: answer,
                  date: new Date().toLocaleDateString(),
                };

                // Send the data to the background script for IndexedDB storage
                sendMessageToBackground(
                  "addToIndexedDB",
                  qaObj
                );
              }
              chrome.runtime.sendMessage({
                iconClicked: true,
              });
            });

            let commonAncestor = targetDiv.closest(
              ".w-full.text-token-text-primary"
            );

            if (commonAncestor) {
              // Traverse down 6 divs deep to get to the target text div
              let deepNestedDiv =
                commonAncestor.querySelector(
                  "div > div > div > div > div > div"
                );

              if (deepNestedDiv) {
                deepNestedDiv.classList.add(
                  `unique-id-${i}`
                );
              }
            }

            // insert icon only in answers
            let parentDiv = targetDiv.parentNode;
            let parentSibling = parentDiv.previousSibling;
            if (
              parentSibling.querySelector(
                'div[data-message-author-role="assistant"]'
              ) &&
              !targetDiv.querySelector(".icon-parent")
            ) {
              const iconParent =
                document.createElement("div");
              iconParent.className = "icon-parent";

              // append
              if (
                targetDiv.querySelector(
                  "button.p-1.gizmo\\:pl-0.rounded-md"
                )
              ) {
                iconParent.appendChild(icon);
                targetDiv.appendChild(iconParent);
              }
            }
          });
        }
      );
    });
  }, 1000);
};

// Create a MutationObserver instance
const observer = new MutationObserver(observerCallback);

// Configuration for the observer (watch for changes to child elements)
const config = { childList: true, subtree: true };

// Start observing a target element (e.g., the body of the document)
observer.observe(
  document.querySelector(".overflow-hidden"),
  config
);
