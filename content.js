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

pollForElement(".overflow-hidden", () => {
  console.log(".overflow-hidden found");

  pollForElements(
    ".text-gray-400.flex.self-end",
    (targetDivs) => {
      console.log(targetDivs);

      targetDivs.forEach((targetDiv, i) => {
        const icon = document.createElement("div");
        icon.className = "gg-data";

        icon.dataset.index = i; // Storing the index in a data-attribute

        icon.addEventListener('click', function(e) {
          // Grab the index from the clicked element
          const idx = e.target.dataset.index;
          
          // Use that index to locate the appropriate text
          const q = document.querySelector(`.unique-id-${idx - 1}`);
          const a = document.querySelector(`.unique-id-${idx}`);
          
          if (a) {
            let question = q.innerText;
            let answer = a.innerText;
            console.log("Q", question);
            console.log("A", answer)
          }
        });


        let commonAncestor = targetDiv.closest('.group.w-full.text-token-text-primary');
  
        if (commonAncestor) {
          // Traverse down 6 divs deep to get to the target text div
          let deepNestedDiv = commonAncestor.querySelector('div > div > div > div > div > div');
          
          if (deepNestedDiv) {
            deepNestedDiv.classList.add(`unique-id-${i}`);
            let text = deepNestedDiv.innerText
            console.log(text)
          }  
        }
        let parentDiv = targetDiv.parentNode;
        if (
          !parentDiv.classList.contains("flex-col") &&
          !parentDiv.classList.contains("gap-1") &&
          !parentDiv.classList.contains("md:gap-3")
        ) {
          targetDiv.appendChild(icon);
        }
      });
    }
  );
});

// for each icon i want to inset the index number into 1 specific div
// then if the icon is clicked i want to get the inner text of the child of that div

// <div class="relative flex w-[calc(100%-50px)] flex-col gizmo:w-full lg:w-[calc(100%-115px)] gizmo:text-gizmo-gray-600 gizmo:dark:text-gray-300"><div class="flex-col gap-1 md:gap-3"><div class="flex flex-grow flex-col gap-3 max-w-full"><div class="min-h-[20px] flex flex-col items-start gap-3 whitespace-pre-wrap break-words overflow-x-auto"><div class="">super cool to learn about the mutationobserver!</div></div></div>

