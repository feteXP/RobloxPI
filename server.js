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


// API users
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
    const txt = req.query.txt;
    const limit = Number(req.query.limit);

    if (req.query.limit > 500) {
      return res.status(308).send("Limit too high.");
    }
    
    const data = await searchUsers(txt, limit);
    res.json(data);
});

// API games
app.get("/v1/games", async (req,res) => {
  const gameId = Number(req.query.universeId);

  const resp = await fetch(`https://games.roblox.com/v1/games?universeIds=${gameId}`);
  const data = await resp.json();
  
  res.json(data);
});

app.get("/v1/games/votes", async (req,res) => {
  const gameId = Number(req.query.universeId);
  const resp = await fetch(`https://games.roblox.com/v1/games/votes?universeIds=${gameId}`);

  const data = await resp.json();
  res.json(data);
});

app.get("/v1/games/thumbnails", async (req,res) => {
  const gameId = req.query.universeId;
  const resp = await fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${gameId}&size=512x512&format=Png`)

  const data = await resp.json();
  res.json(data);
})

// Host it
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); 
});
