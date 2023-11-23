# Clip-it

<br>
<p align="center">
  <img src="./public/icon_128.png" alt="clip-it icon">
</p>

### about

---

Clip-it is a Chrome extension that adds an icon to OpenAI's ChatGPT interface, allowing users to save specific question and response blocks to browser storage for later reference. It was built as a small, personal project to learn about browser extensions and APIs. The icon tab interface was built with Preact.

<p align="center">
  <img src="./public/example1.png" alt="first example">
</p>
  
<p align="center">
  <img src="./public/example2.png" alt="second example">
</p>

### installation

---

- Run `npm run build` at the root
- In Chrome, navigate to chrome://extensions
- In the top right enable the Developer mode toggle
- In the top left click Load unpacked and select the extracted `dist` directory

### to-do

---

- add default message when there are no clips
- DOM detection is a messy mix of polling and mutation detection, refactor
- icon color should change after click
- make the question text editable in the extension tab
