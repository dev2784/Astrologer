import { FastifyInstance } from "fastify";

// Ujjain Coordinates
const UJJAIN_LAT = 23.1765;
const UJJAIN_LON = 75.7885;
const TZ = 5.5;

export async function panchangRoutes(server: FastifyInstance) {
  server.get("/", async (request, reply) => {
    const { date } = request.query as { date?: string };

    if (!date) {
      return reply.code(400).send({ error: "Date parameter (YYYY-MM-DD) is required." });
    }

    const [year, month, day] = date.split("-");

    try {
      // NOTE: Replace this URL and Auth logic with your chosen provider (e.g., AstrologyAPI, ProKerala)
      // This example uses the standard payload structure expected by most Vedic APIs
      const externalApiUrl = "https://json.astrologyapi.com/v1/advanced_panchang";
      
      // const authHeader = "Basic " + Buffer.from(`${process.env.ASTRO_API_USER_ID}:${process.env.ASTRO_API_KEY}`).toString("base64");

      const response = await fetch(externalApiUrl, {
        method: "POST",
        headers: {
          // "Authorization": authHeader,
          "Content-Type": "application/json",
          'x-astrologyapi-key': apiKey,

        },
        body: JSON.stringify({ "day": 12,
			  "month": 3,
			  "year": 1993,
			  "hour": 14,
			  "min": 15,
			  "lat": UJJAIN_LAT,
			  "lon": UJJAIN_LON,
			  "tzone": 5.5,
			  "house_type": "placidus",
			  "is_asteroids": "false"
        })
      });

      if (!response.ok) {
        throw new Error("External API failed");
      }

      const panchangData = await response.json();
      
      // Send the data back to your Next.js frontend
      return reply.send({ data: panchangData });

    } catch (error) {
      console.error("Panchang Fetch Error:", error);
      return reply.code(500).send({ error: "Failed to fetch Panchang data for Ujjain." });
    }
  });
}