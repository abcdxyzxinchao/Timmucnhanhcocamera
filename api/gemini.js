export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { base64Data } = req.body;
        if (!base64Data) {
            return res.status(400).json({ error: 'Missing base64Data' });
        }

        // Mã API Key thật của bạn đã tự động lấy từ dòng 23 trong ảnh của bạn
        const GEMINI_API_KEY = "AQ..Ab8RN6J-e1PSoFoUIhtWNESDnyONAu-Rubz5Fiyg2co3X-j-uQ";
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: "Bức ảnh này được chụp ở chế độ siêu zoom kỹ thuật số nên có hiện tượng vỡ hạt mờ đục. Hãy phân tích chuyên sâu phân bổ các hạt nhiễu, biên vật thể, mật độ dải tương phản động và cung cấp phương án cải thiện chi tiết." },
                        { inlineData: { mimeType: "image/jpeg", data: base64Data } }
                    ]
                }]
            })
        });

        const jsonResult = await response.json();
        return res.status(200).json(jsonResult);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
