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
        // Consultamos DIRECTO al servidor oficial de Garena forzando República Dominicana
        const response = await axios.post('https://garena.sg', {
            app_id: 100067, // Free Fire
            login_id: playerId,
            region: 'DO',   // Forzamos la región de República Dominicana
            lang: 'es'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 4000 // Si tarda más de 4 segundos, cancela
        });

        const data = response.data;

        // VALIDADOR REAL: Si Garena NO devuelve el "player_name", el ID NO existe
        if (!data || !data.player_name) {
            return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado en Free Fire" });
        }

        // Si el ID existe, revisamos sus paquetes para ver si el bono está activo
        const productos = data.products || [];
        let bonoDisponible = false;

        for (let item of productos) {
            // Evaluamos si tiene una promoción activa y le quedan usos disponibles
            if (item.promo_id && item.remaining_limit > 0) {
                bonoDisponible = true;
                break;
            }
        }

        // Devolvemos la respuesta real a tu index.html
        return res.status(200).json({
            error: false,
            nickname: data.player_name,
            bonus_available: bonoDisponible,
            status: bonoDisponible ? "ilimitado" : "limitado"
        });

    } catch (err) {
        // Si el servidor de Garena tira error (casi siempre un 400 o 404 cuando el ID no existe)
        return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado o región incorrecta" });
    }
}
