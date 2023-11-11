import { useState, useEffect } from "preact/hooks";
import "./app.css";
import DOMPurify from "dompurify";

export function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Function to fetch items from IndexedDB
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

    // Listener for the message indicating item addition
    const itemAddedListener = (message) => {
      if (message.itemAdded) {
        // Trigger a re-fetch of items when an item is added
        fetchItemsFromIndexedDB();
      }
    };

    // Add the message listener
    chrome.runtime.onMessage.addListener(itemAddedListener);

    // Call the function to fetch items when the component mounts
    fetchItemsFromIndexedDB();

    // Clean up the listener when the component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(
        itemAddedListener
      );
    };
  }, []);

  const removeFromIndexedDB = (id, key) => {
    const openRequest = indexedDB.open("QA_Clips", 1);

    openRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(
        "QA-Store",
        "readwrite"
      );
      const objectStore =
        transaction.objectStore("QA-Store");

      const deleteRequest = objectStore.delete(key);

      deleteRequest.onsuccess = () => {
        // Item has been deleted from IndexedDB, update the rendered list
        const updatedItems = items.filter(
          (item) => item.id !== id
        );
        setItems(updatedItems);
      };

      deleteRequest.onerror = (event) => {
        console.error(
          "Error deleting item: ",
          event.target.error
        );
      };
    };
  };

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  return (
    <div>
      <div id="title">
        <h1>
          Chat Clipper v0.1
          {/* <i className="gg-clipboard"></i> */}
        </h1>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id} className="items">
            <details>
              <summary role="button">
                <span>Q:</span>
                <div>{item.question.substring(3)}</div>
              </summary>
              <span>A:</span>
              <div
                dangerouslySetInnerHTML={createMarkup(
                  `${item.answer.substring(26)}`
                )}
              />
              <button
                onClick={() =>
                  removeFromIndexedDB(item.id, item.key)
                }
              >
                Remove
              </button>
            </details>
          </li>
        ))}
      </ul>{" "}
    </div>
  );
}
