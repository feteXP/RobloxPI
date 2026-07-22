const express = require("express");

const app = express();

// AI Help
async function searchUsers(keyword, amount) {
  let users = [];
  let cursor = "";

  while (users.length < amount) {
    const url = new URL("https://users.roblox.com/v1/users/search");
    url.searchParams.set("keyword", keyword);
    url.searchParams.set("limit", "50");

    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }

    const res = await fetch(url);
    const data = await res.json();

    users.push(...data.data);

    cursor = data.nextPageCursor;

    if (!cursor) break; // no more results
  }

  return users.slice(0, amount);
}

// Website
app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, "web", "index.html"));
    res.sendFile(path.join(__dirname, "web", "style.css"));
});


// APIs
app.get("/v1/users", async (req,res) => {
    const userId = req.query.id;
    const resp = await fetch(`https://users.roblox.com/v1/users/${userId}`);

    const data = await resp.json();
    res.json(data);
})

app.get("/v1/users/username-history", async (req,res) => {
    const userId = req.query.id; 
    const resp = await fetch(`Ghttps://users.roblox.com/v1/users/${userId}/username-history`);

    const data = await resp.json();
    res.json(data);
})

app.get("/v1/users/search", async (req,res) => {
    
})

// Host it
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); 
});
