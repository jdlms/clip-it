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

        let qDiv = targetDiv
          .closest(".overflow-hidden")
          .querySelector(
            "div.flex.flex-col.items-start.gap-3.whitespace-pre-wrap.break-words.overflow-x-auto"
          );

        if (qDiv) {
          qDiv.classList.add(`${i}`);
          console.log(qDiv);
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

