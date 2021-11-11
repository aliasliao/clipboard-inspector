import { ClipboardEvent, Fragment, useState } from "react";
import "./styles.css";
import beautify from "beautify";

export function List({ data }) {
  if (data.length === 0) {
    return <span>(empty)</span>;
  }
  return (
    <ol>
      {data.map((item) => (
        <li>{JSON.stringify(item)}</li>
      ))}
    </ol>
  );
}

export default function App() {
  const [files, setFiles] = useState([]);
  const [types, setTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [clipboardData, setClipboardData] = useState<DataTransfer>(null);
  const handlePaste = ({
    clipboardData
  }: ClipboardEvent<HTMLTextAreaElement>) => {
    const { files, types, items } = clipboardData;
    setFiles([...files]);
    setTypes([...types]);
    setItems([...items].map(({ kind, type }) => ({ kind, type })));
    setClipboardData(clipboardData);
  };
  return (
    <div className="App">
      <div style={{ display: "flex" }}>
        <textarea
          style={{ width: 801, height: 600 }}
          placeholder="paste here"
          onPaste={handlePaste}
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
                    whiteSpace: "pre",
                    overflow: "auto",
                    maxHeight: 400
                  }}
                >
                  {type === "1text/html"
                    ? beautify(clipboardData.getData(type), { format: "html" })
                    : clipboardData.getData(type)}
                </code>
              </div>
              {type === "text/html" && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    border: "2px solid #a5a5a5",
                    borderRadius: 4
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
