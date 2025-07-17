// Vercel serverless function to get Mento stable token balances using @mento-protocol/mento-sdk
import { MentoSdk, Network } from '@mento-protocol/mento-sdk';

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { address, network = "alfajores" } = req.query;
  if (!address) {
    res.status(400).json({ error: "Missing address parameter" });
    return;
  }

  try {
    const sdkNetwork = network === "mainnet" ? Network.MAINNET : Network.ALFAJORES;
    const sdk = new MentoSdk({ network: sdkNetwork });
    await sdk.init();
    const tokens = await sdk.tokens.getAllTokens();
    const balances = {};
    for (const token of tokens) {
      const bal = await sdk.tokens.balanceOf(token.address, address);
      balances[token.symbol] = {
        symbol: token.symbol,
        address: token.address,
        balance: bal.toString(),
        decimals: token.decimals,
      };
    }
    res.status(200).json({ address, network, balances });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch token balances", details: err.message });
  }
} 