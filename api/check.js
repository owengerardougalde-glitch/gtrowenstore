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
        // Petición POST estructurada con headers de la app oficial de Garena Topup
        const response = await fetch('https://api.kudos.com.tr/gg/info', { // o pasarela de respaldo oficial
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                'Referer': 'https://shop2game.com/'
            },
            body: JSON.stringify({
                app_id: 100067,
                login_id: playerId,
                region: 'US'
            })
        });

        const textCheck = await response.text();
        let data;
        
        try {
            data = JSON.parse(textCheck);
        } catch (e) {
            data = {};
        }

        const nickname = data.player_name || data.nickname || data.AccountName || data.name;

        if (!response.ok || !nickname) {
            // Respaldo secundario si la pasarela principal requiere token de región dinámico
            const backupRes = await fetch(`https://api.freefireinfo.tech/gg/info?uid=${playerId}`, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const backupData = await backupRes.json();
            const backupName = backupData.nickname || backupData.AccountName || backupData.name || backupData.player_name;

            if (!backupName) {
                return res.status(404).json({ 
                    error: true, 
                    status: "failed", 
                    message: "El ID no existe o no se pudo verificar en los registros oficiales." 
                });
            }

            return res.status(200).json({
                error: false,
                nickname: backupName,
                bonus_available: true,
                status: "ilimitado"
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
            message: "Error al conectar con el servidor oficial de validación." 
        });
    }
}
