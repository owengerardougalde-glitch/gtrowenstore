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
        // Usamos un servicio de consulta pública estable para extraer los datos reales del jugador
        const response = await fetch(`https://api.freefireinfo.tech/gg/info?uid=${playerId}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error('Error al conectar con el servidor de consulta');
        }

        const data = await response.json();

        // Verificamos si la API devolvió el nombre de la cuenta real
        const nickname = data.nickname || data.AccountName || data.name || data.player_name;

        if (!nickname) {
            return res.status(404).json({ 
                error: true, 
                status: "failed", 
                message: "El ID no existe o no se pudo verificar en los registros de Free Fire" 
            });
        }

        return res.status(200).json({
            error: false,
            nickname: nickname,
            bonus_available: true,
            status: "ilimitado"
        });

    } catch (err) {
        return res.status(500).json({ 
            error: true, 
            status: "failed", 
            message: "Error al procesar la consulta con el servidor oficial" 
        });
    }
}
