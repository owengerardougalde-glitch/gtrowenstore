export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const playerId = req.query.player_id || req.query.id;

    if (!playerId || isNaN(playerId) || playerId.length < 5) {
        return res.status(400).json({ error: true, message: 'ID inválido' });
    }

    try {
        // Consulta directa al endpoint de validación de región de Pagostore
        const url = `https://api.pagostore.com/auth/player_id?app_id=100067&player_id=${playerId}`;
        
        const apiRes = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Referer': 'https://pagostore.com/'
            }
        });

        const textData = await apiRes.text();
        let data;
        try {
            data = JSON.parse(textData);
        } catch (e) {
            data = null;
        }

        // Si Garena responde con el perfil real del jugador
        if (data && (data.nickname || data.player_name || data.name)) {
            const realName = data.nickname || data.player_name || data.name;
            return res.status(200).json({
                error: false,
                nickname: realName,
                bonus_available: true,
                status: "ilimitado"
            });
        }

        // Si la IP de Vercel recibe bloqueo por parte de Cloudflare de Pagostore,
        // usamos una consulta alternativos de respaldo en tiempo de ejecución para asegurar la data real del UID:
        const backupRes = await fetch(`https://checker-freefire.p.rapidapi.com/v1/player?uid=${playerId}`, {
            headers: {
                'x-rapidapi-host': 'checker-freefire.p.rapidapi.com',
                'User-Agent': 'Mozilla/5.0'
            }
        }).catch(() => null);

        if (backupRes && backupRes.ok) {
            const backupData = await backupRes.json();
            if (backupData && backupData.username) {
                return res.status(200).json({
                    error: false,
                    nickname: backupData.username,
                    bonus_available: true,
                    status: "ilimitado"
                });
            }
        }

        // Si de verdad el ID no existe en los registros globales de Garena
        return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado" });

    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error de conexión con el servidor' });
    }
}
