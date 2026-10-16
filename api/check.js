export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const playerId = req.query.player_id || req.query.id;

    if (!playerId || isNaN(playerId)) {
        return res.status(400).json({ error: true, message: 'ID inválido' });
    }

    try {
        // Usamos una pasarela de respaldo pública optimizada para Free Fire
        const response = await fetch(`https://api.freefireinfo.site/api/player?uid=${playerId}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        const data = await response.json();

        if (data && (data.nickname || data.name || data.userName)) {
            const nombreReal = data.nickname || data.name || data.userName;
            return res.status(200).json({
                error: false,
                nickname: nombreReal,
                bonus_available: true,
                status: "ilimitado"
            });
        }

        return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado" });

    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error interno en el servidor' });
    }
}
