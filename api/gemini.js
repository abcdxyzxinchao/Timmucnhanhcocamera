export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-goog-api-key');

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

        // Copy chính xác mã Key từ ảnh số 3 của bạn vào đây
        const GEMINI_API_KEY = "AQ.Ab8RN6K2yWkkCK51pPMk01TjaZbaRARx..."; 
        
        // URL gọi chuẩn không đính key ở đuôi để tránh bị Google từ chối chặn quyền
        const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "x-goog-api-key": GEMINI_API_KEY // Chuyển Key xuống Header theo đúng chuẩn Service Account
            },
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
        
        if (!response.ok) {
            return res.status(response.status).json({ error: jsonResult.error || "Google API Error" });
        }

        return res.status(200).json(jsonResult);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
