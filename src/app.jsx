import { useState, useEffect } from "preact/hooks";
import "./app.css";

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

  return (
    <div>
      <div id="title">
        <h1>Chat Clipper version 0.1</h1>
      </div>

      {items.map((item) => (
        <div className="items">
          <div>
            <span>Q:</span> {item.question}
          </div>
          <div>-</div>
          <div>
            <span>A:</span> {item.answer.substring(7)}
          </div>
        </div>
      ))}
    </div>
  );
}
