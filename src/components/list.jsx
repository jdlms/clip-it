import DOMPurify from "dompurify";

export function List({ items }) {
  const removeClickEvent = (id, key) => {
    event.stopPropagation();
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
    <ul>
      {items.map((item) => (
        <li key={item.id} className="items">
          <details>
            <summary role="button">
              <span>Q:</span>{" "}
              <i
                className="gg-close-o delete-button"
                onClick={() =>
                  removeClickEvent(item.id, item.key)
                }
              ></i>
              <span>{item.date}</span>
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
    </ul>
  );
}
