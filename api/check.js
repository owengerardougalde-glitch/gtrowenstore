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
        // Usamos una ruta de consulta directa alternativa y estable
        const apiRes = await fetch(`https://ff.garena.com/api/server/check?app_id=100067&region=US&uid=${playerId}`);
        const data = await apiRes.json();

        // Si la pasarela oficial responde con el usuario
        if (data && data.nickname) {
            return res.status(200).json({
                error: false,
                nickname: data.nickname,
                bonus_available: true,
                status: "ilimitado"
            });
        }

        // Respaldo de validación por si el servidor oficial exige cabecera de región
        const backupRes = await fetch(`https://api.freefireinfo.tech/gg/info?uid=${playerId}`);
        const backupData = await backupRes.json();
        const realName = backupData.nickname || backupData.AccountName || backupData.name;

        if (realName) {
            return res.status(200).json({
                error: false,
                nickname: realName,
                bonus_available: true,
                status: "ilimitado"
            });
        }

        return res.status(404).json({ 
            error: true, 
            status: "failed", 
            message: "Jugador no encontrado en los registros de Free Fire." 
        });

    } catch (err) {
        return res.status(500).json({ 
            error: true, 
            status: "failed", 
            message: "Error de conexión con el servidor de validación." 
        });
    }
}
