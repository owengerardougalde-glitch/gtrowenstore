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

    if (!playerId || isNaN(playerId) || playerId.length < 5) {
        return res.status(400).json({ error: true, message: 'ID inválido' });
    }

    try {
        const response = await fetch(`https://api.freefireinfo.tech/gg/info?uid=${playerId}`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(404).json({ error: true, status: "failed", message: "Jugador no encontrado en los registros de Free Fire." });
        }

        const data = await response.json();
        const nickname = data.nickname || data.AccountName || data.name || data.player_name;

        if (!nickname) {
            return res.status(404).json({ error: true, status: "failed", message: "El ID ingresado no existe." });
        }

        return res.status(200).json({
            error: false,
            nickname: nickname,
            bonus_available: true,
            status: "ilimitado"
        });

    } catch (err) {
        return res.status(500).json({ error: true, status: "failed", message: "Error interno en el servidor de validación." });
    }
}
