export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const playerId = req.query.player_id || req.query.id;

    if (!playerId) {
        return res.status(400).json({ error: true, message: 'Falta el ID del jugador' });
    }

    try {
        const apiRes = await fetch(`https://api.pagostore.com/auth/player_id?app_id=100067&player_id=${playerId}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://pagostore.com/'
            }
        });

        const data = await apiRes.json();

        if (data && data.nickname) {
            return res.status(200).json({
                error: false,
                nickname: data.nickname,
                bonus_available: true,
                status: "ilimitado"
            });
        } else {
            return res.status(404).json({ error: true, status: "failed", message: "Jugador no encontrado" });
        }

    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error interno en el servidor' });
    }
}
