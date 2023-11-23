import { useState, useEffect } from "preact/hooks";
import "./app.css";
import { List } from "./components/list";

export function App() {
  const [items, setItems] = useState([]);
  const [myBool, setMyBool] = useState(false);

  useEffect(() => {
    // fetch items from IndexedDB
    const fetchItemsFromIndexedDB = () => {
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
          const items = event.target.result.map(
            (item, idx) => ({
              ...item,
              id: idx,
            })
          );
          console.log(items);
          const reversedItems = items.reverse();
          setItems(reversedItems);
        };

        getAllRequest.onerror = (event) => {
          console.error(
            "Error retrieving items: ",
            event.target.error
          );
        };
      };
    };

    // listener for new items
    const itemAddedListener = (message) => {
      setMyBool((prevState) => !prevState);
      if (message.itemAdded) {
        fetchItemsFromIndexedDB();
      }
    };
    console.log("item added!");
    chrome.runtime.onMessage.addListener(itemAddedListener);

    fetchItemsFromIndexedDB();

    // clean up
    return () => {
      chrome.runtime.onMessage.removeListener(
        itemAddedListener
      );
    };
  }, [myBool]);

  return (
    <div>
      <div id="logo-container">
        <img
          className="logo"
          src="/icon_128.png"
          alt="logo"
        />
      </div>
      <List items={items} setItems={setItems} />
    </div>
  );
}
