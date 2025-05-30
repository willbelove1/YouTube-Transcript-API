import { getTranscript } from "@delgan/youtube-transcript";

export default async function handler(req, res) {
    const { videoId } = req.query;

    if (!videoId) {
        return res.status(400).json({ error: "Missing videoId" });
    }

    try {
        const transcriptArray = await getTranscript(videoId);
        const transcript = transcriptArray.map(x => x.text).join(" ");
        res.setHeader("Cache-Control", "s-maxage=86400");
        return res.status(200).json({ transcript });
    } catch (err) {
        console.error("Transcript error:", err);
        return res.status(500).json({ error: "Unable to fetch transcript" });
    }
}
