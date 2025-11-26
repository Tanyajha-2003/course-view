import React, { useState } from "react";
import API from "../api";

export default function DocumentViewer({ doc }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const summarise = async () => {
    setLoading(true);
    const res = await API.post("/docs/summarise", { text: doc.content });
    setSummary(res.data.summary);
    setLoading(false);
  };

  return (
    <div>
      <h3>{doc.title}</h3>
<pre style={{ background: "#f8f9fa", padding: "10px", whiteSpace: "pre-wrap" }}>
  {doc.content}
</pre>

      <button className="btn btn-warning mt-2" onClick={summarise} disabled={loading}>
        {loading ? "Summarising..." : "Summarise with AI"}
      </button>

      {summary && (
        <div className="alert alert-info mt-3">
          <h5>AI Summary</h5>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
