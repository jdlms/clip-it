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
          Clip-it
          <img
            className="logo"
            src="/icon_128.png"
            alt="logo"
          />
        </h1>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id} className="items">
            <details>
              <summary role="button">
                <span>Q:</span>{" "}
                <i
                  className="gg-close-o delete-button"
                  onClick={() =>
                    removeFromIndexedDB(item.id, item.key)
                  }
                ></i>
                <span>{item.date}</span>
                {/* <div>{item.question.substring(3)}</div> */}
                <div
                  dangerouslySetInnerHTML={createMarkup(
                    `${item.question}`
                  )}
                ></div>
              </summary>
              <span>A:</span>
              <div
                dangerouslySetInnerHTML={createMarkup(
                  `${item.answer}`
                )}
              />
            </details>
          </li>
        ))}
      </ul>{" "}
    </div>
  );
}
