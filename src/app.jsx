import { useState, useEffect } from "preact/hooks";
import "./app.css";
import DOMPurify from "dompurify";

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
      if (message.itemAdded) {
        fetchItemsFromIndexedDB();
      }
    };
    console.log("item added!");
    setMyBool((prevState) => !prevState);
    chrome.runtime.onMessage.addListener(itemAddedListener);

    fetchItemsFromIndexedDB();

    // clean up
    return () => {
      chrome.runtime.onMessage.removeListener(
        itemAddedListener
      );
    };
  }, [myBool]);

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
                <span>Q:</span>{" "}
                <i
                  className="gg-close-o"
                  onClick={() =>
                    removeFromIndexedDB(item.id, item.key)
                  }
                ></i>
                <span>{item.date}</span>
                <div>{item.question.substring(3)}</div>
              </summary>
              <span>A:</span>
              <div
                dangerouslySetInnerHTML={createMarkup(
                  `${item.answer.substring(26)}`
                )}
              />
            </details>
          </li>
        ))}
      </ul>{" "}
    </div>
  );
}
