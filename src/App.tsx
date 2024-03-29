import { ClipboardEvent, Fragment, useState } from "react";
import "./styles.css";
// import beautify from "beautify";

export function List({ data }) {
  if (data.length === 0) {
    return <span>(empty)</span>;
  }
  return (
    <ol>
      {data.map((item, index) => (
        <li key={index}>{JSON.stringify(item)}</li>
      ))}
    </ol>
  );
}

export default function App() {
  const [files, setFiles] = useState([]);
  const [types, setTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [clipboardData, setClipboardData] = useState<DataTransfer>(null);

  const handlePaste = ({ clipboardData }: ClipboardEvent<HTMLTextAreaElement>) => {
    const { files, types, items } = clipboardData;
    const itemDict = [...items].map(({ kind, type }) => ({ kind, type }))
    setFiles([...files]);
    setTypes([...types]);
    setItems(itemDict);
    setClipboardData(clipboardData);
    console.table({
      'text/plain': clipboardData.getData('text/plain'),
      'text/html': clipboardData.getData('text/html'),
    })
  };

  const handleCopy = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const { clipboardData, currentTarget } = event;
    console.log('>>>value:', currentTarget.value);
    clipboardData.setData('text/html', currentTarget.value);
    clipboardData.setData('text/plain', currentTarget.value);
    event.preventDefault();
  };

  return (
    <div className="App">
      <div style={{ display: "flex" }}>
        <textarea
          style={{ width: 801, height: 600 }}
          placeholder="paste here"
          onPaste={handlePaste}
          onCopy={handleCopy}
        />
        <div style={{ marginLeft: 32 }}>
          <div>clipboardData.files:</div>
          <List data={files} />
          <hr />
          <div>clipboardData.types:</div>
          <List data={types} />
          <hr />
          <div>clipboardData.items: </div>
          <List data={items} />
        </div>
      </div>

      {items
        .filter(({ kind }) => kind === "string")
        .map(({ type }, index) => (
          <Fragment key={type}>
            {index !== 0 && <hr />}
            <div style={{ margin: "32px 0" }}>
              <h1>{type}</h1>
              <div style={{ display: "flex" }}>
                <code
                  style={{
                    padding: 16,
                    border: "2px solid #a5a5a5",
                    borderRadius: 4,
                    whiteSpace: type === 'text/html' ? "pre-wrap" : "pre",
                    overflow: "auto",
                    maxHeight: 400,
                  }}
                >
                  {clipboardData.getData(type)}
                </code>
              </div>
              {type === "text/html" && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    border: "2px solid #a5a5a5",
                    borderRadius: 4,
                    whiteSpace: "pre",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: clipboardData.getData(type)
                  }}
                />
              )}
            </div>
          </Fragment>
        ))}
    </div>
  );
}
