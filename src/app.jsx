import { useState, useEffect } from "preact/hooks";
import "./app.css";
import DOMPurify from "dompurify";

export function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const openRequest = indexedDB.open("QA_Clips", 1);

    openRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(
        "QA-Store",
        "readonly"
      );
      const objectStore =
        transaction.objectStore("QA-Store");

      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = (event) => {
        const items = event.target.result;
        setItems(items);
      };

      getAllRequest.onerror = (event) => {
        console.error(
          "Error retrieving items: ",
          event.target.error
        );
      };
    };

    openRequest.onerror = (event) => {
      console.error(
        "Error opening database: ",
        event.target.error
      );
    };
  }, []);

  const createMarkup = (html) => {
    return { __html: DOMPurify.sanitize(html) }; // Sanitize the HTML
  };

  return (
    <div>
      <div id="title">
        <h1>
          Chat Clipper v0.1 <i className="gg-clipboard"></i>
        </h1>
      </div>

      {items.map((item) => (
        <div className="items">
          <details>
            <summary role="button">
              <span>Q:</span>
              {item.question}
            </summary>
            <p>
              <span>A:</span>
              <span>{item.answer.substring(7)}</span>
            </p>
          </details>
        </div>
      ))}
    </div>
  );
}
