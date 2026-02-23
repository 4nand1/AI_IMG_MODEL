export async function POST(req: Request) {
  const { prompt } = await req.json();

  const encodedPrompt = encodeURIComponent(prompt.trim());

  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

  const imageRes = await fetch(imageUrl,  {
  headers: {
    "User-Agent": "Mozilla/5.0",
  },
});

  if (!imageRes.ok) {
    console.log(imageRes)
    return new Response("Failed to generate image", { status: 500 });
  }

  return new Response(imageRes.body, {
    headers: { "Content-Type": "image/png" },
  });
}
