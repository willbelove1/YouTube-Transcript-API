import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { videoId } = req.query;

    if (!videoId) {
        return res.status(400).json({ error: "Missing videoId parameter" });
    }

    try {
        const response = await fetch(`https://video.google.com/timedtext?lang=en&v=${videoId}`);
        const xml = await response.text();

        if (!xml || xml.includes("<transcript />")) {
            return res.status(404).json({ error: "Transcript not available." });
        }

        const transcript = Array.from(xml.matchAll(/<text.+?>(.*?)<\/text>/g))
            .map(match => decodeURIComponent(match[1].replace(/&#39;/g, "'").replace(/&quot;/g, '"')))
            .join(" ");

        return res.status(200).json({ transcript });
    } catch (err) {
        console.error("Transcript fetch error:", err);
        return res.status(500).json({ error: "Server error fetching transcript." });
    }
}
