// Vercel serverless function to proxy token balance requests to Celo explorer/blockscout
export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { address, network = "alfajores" } = req.query;
  if (!address) {
    res.status(400).json({ error: "Missing address parameter" });
    return;
  }
  const API_URLS = {
    mainnet: "https://explorer.celo.org/api?module=account&action=tokenlist&address=",
    alfajores: "https://alfajores-blockscout.celo-testnet.org/api?module=account&action=tokenlist&address=",
  };
  const apiUrl = API_URLS[network] + address;
  try {
    const fetchRes = await fetch(apiUrl);
    const data = await fetchRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch token balances", details: err.message });
  }
} 