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
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const data = await response.json();

        if (!data || (!data.nickname && !data.AccountName && !data.name)) {
            return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado en Free Fire" });
        }

        const nick = data.nickname || data.AccountName || data.name;

        return res.status(200).json({
            error: false,
            nickname: nick,
            bonus_available: true,
            status: "ilimitado"
        });

    } catch (err) {
        return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado o error en los servidores" });
    }
}
