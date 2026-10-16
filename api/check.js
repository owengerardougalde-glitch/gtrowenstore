import axios from 'axios';

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
        // Conexión corregida al servidor oficial de logueo de Garena
        const response = await axios.post('https://garena.sg', {
            app_id: 100067, 
            login_id: playerId,
            region: 'DO',   
            lang: 'es'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 4000 
        });

        const data = response.data;

        // VALIDADOR ESTRICTO: Si no viene el nombre, el ID no existe
        if (!data || !data.player_name) {
            return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado en Free Fire" });
        }

        // Analizamos los paquetes para ver si el bono de Dominicana sigue activo
        const productos = data.products || [];
        let bonoDisponible = false;

        for (let item of productos) {
            if (item.promo_id && item.remaining_limit > 0) {
                bonoDisponible = true;
                break;
            }
        }

        return res.status(200).json({
            error: false,
            nickname: data.player_name,
            bonus_available: bonoDisponible,
            status: bonoDisponible ? "ilimitado" : "limitado"
        });

    } catch (err) {
        // Bloquea los IDs falsos o randoms que rechaza Garena
        return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado o región incorrecta" });
    }
}
