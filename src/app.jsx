import { useState, useEffect } from "preact/hooks";

export function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const openRequest = indexedDB.open("YourDBName");

    openRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(
        "qaStore",
        "readonly"
      );
      const objectStore =
        transaction.objectStore("qaStore");

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
      <h2>Items from IndexedDB:</h2>
      <ul>
        {items.map((item) => (
          <li key={item.question}>{item.answer}</li>
        ))}
      </ul>
    </div>
  );
}

export default IndexedDBList;
