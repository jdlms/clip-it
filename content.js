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

  // Now let's poll for the target divs
  pollForElements(
    ".text-gray-400.flex.self-end",
    (targetDivs) => {
      console.log(targetDivs);

      targetDivs.forEach((targetDiv) => {
        const icon = document.createElement("div");
        icon.className = "gg-data";
        targetDiv.appendChild(icon);
      });
    }
  );
});



// class="text-gray-400 flex self-end lg:self-center justify-center gizmo:lg:justify-start mt-2 gizmo:mt-0 visible lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 gap-2 md:gap-3"

// text-gray-400 flex self-end lg:self-center justify-center gizmo:lg:justify-start mt-2 gizmo:mt-0 visible lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 gap-2 md:gap-3 gizmo:absolute gizmo:right-0 gizmo:top-1/2 gizmo:-translate-y-1/2 gizmo:transform
