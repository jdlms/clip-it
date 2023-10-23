import { useState, useEffect } from "preact/hooks";
import "./App.css";

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
      <h1>Chat Clipper version 0.1</h1>
      <h2>Items from IndexedDB:</h2>

      {items.map((item) => (
        <div className="items">
          <div>Q: {item.question}</div>
          <div>A: {item.answer.substring(7)}</div>
        </div>
      ))}
    </div>
  );
}
