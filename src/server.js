import fs from "node:fs/promises";
import http from "node:http";
import open from "open";

const interpolate = (html, data) => {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || "";
  });
};

export const formatNotes = (notes) => {
  return notes
    .map((note) => {
      return `<div class="notes">
    <h2>Note title: ${note.content}</h2>
    <div class="tags">Note tags: 
    ${note.tags.map((tag) => `<span class"tag">${tag}</span>`)}
    <p>Note title: ${note.id}</p>
    </div>
    </div>`;
    })
    .join("\n");
};

export const createServer = (notes) => {
  return http.createServer(async (req, res) => {
    const HTML = new URL("./template.html", import.meta.url).pathname;
    const template = await fs.readFile(HTML, "utf-8");
    const html = interpolate(template, { notes: formatNotes(notes) });

    res.writeHead(200, { "content-type": "text/html" });
    res.end(html);
  });
};

export const start = (notes, port) => {
  const server = createServer(notes);
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
  open(`http://localhost:${port}`);
};

const server = http.createServer((req, res) => {
  req.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello there");
});

server.listen(4000, () => {
  console.log("server running on port http://localhost:4000");
});
