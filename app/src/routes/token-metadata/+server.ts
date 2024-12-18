import { HELIUS_URL } from "$env/static/private";
import { json } from "@sveltejs/kit";

export async function GET({ url }: { url: URL }) {
  const tokenAddress = url.searchParams.get("tokenAddress");

  try {
    const response = await fetch(HELIUS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "test",
        method: "getAsset",
        params: {
          id: tokenAddress,
        },
      }),
    });
    const data = await response.json();

    return json(data, {
      status: 200,
    });
  } catch (error) {
    return json(
      { error: error.toString() },
      {
        status: 500,
      }
    );
  }
}
