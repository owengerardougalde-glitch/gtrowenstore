export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const playerId = req.query.player_id || req.query.id;

    if (!playerId) {
        return res.status(400).json({ error: true, message: 'ID no proporcionado' });
    }

    try {
        const apiResponse = await fetch(`https://api.freefireinfo.tech/gg/info?uid=${playerId}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        if (!apiResponse.ok) {
            return res.status(404).json({ error: true, message: "Jugador no encontrado en el sistema" });
        }

        const data = await apiResponse.json();
        const nickname = data.nickname || data.AccountName || data.name || data.player_name;

        if (!nickname) {
            return res.status(404).json({ error: true, message: "El ID no arrojó ningún resultado" });
        }

        return res.status(200).json({
            error: false,
            nickname: nickname,
            status: "success"
        });

    } catch (error) {
        return res.status(500).json({ error: true, message: "Falla de comunicación en el servidor" });
    }
}
