export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') { return res.status(200).end(); }
    if (req.method !== 'POST') { return res.status(405).json({ error: 'Method not allowed' }); }

    try {
        const { base64Data, customPrompt } = req.body;
        if (!base64Data) { return res.status(400).json({ error: 'Missing base64Data' }); }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) { return res.status(500).json({ error: 'Chưa cấu hình biến GEMINI_API_KEY trên Vercel!' }); }

        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        // Sử dụng prompt tùy chỉnh từ ô nhập liệu, nếu trống sẽ dùng prompt mặc định
        const finalPrompt = customPrompt || "Bức ảnh này được chụp ở chế độ siêu zoom kỹ thuật số, hãy phân tích độ nét vật thể và độ sáng.";

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: finalPrompt },
                        { inlineData: { mimeType: "image/jpeg", data: base64Data } }
                    ]
                }]
            })
        });

        const jsonResult = await response.json();
        return res.status(response.status).json(jsonResult);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
