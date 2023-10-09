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

pollForElement(".overflow-hidden", () => {
  console.log(".overflow-hidden found");

  // Start a new poll for the specific target div.
  pollForElement(
    ".text-gray-400.flex.self-end",
    (targetDiv) => {
      console.log("targetDiv found:", targetDiv);

      const icon = document.createElement("div");
      icon.className = "gg-data";
      targetDiv.appendChild(icon);

      const targetDivs = document.querySelectorAll(
        ".text-gray-400.flex.self-end"
      );

      console.log(targetDivs);

      targetDivs.forEach((targetDiv) => {
        const icon = document.createElement("div");
        icon.className = "gg-data";
        targetDiv.appendChild(icon);
      });
    }
  );
});
