
import axios from 'axios';

export default async function handler(req, res) {
    // 🔥 PERMISOS DE RED (CORS) - Esto evita de raíz el Error de Conexión
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite que gtrowen.store lea los datos sin bloqueos
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    
    // Si el navegador hace una petición de control previa (Preflight), respondemos exitoso de una vez
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const playerId = req.query.player_id || req.query.id;

    if (!playerId || isNaN(playerId)) {
        return res.status(400).json({ error: true, message: 'ID inválido' });
    }

    try {
        // Petición directa usando axios al servidor oficial de logueo de Garena
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
            timeout: 5000 
        });

        const data = response.data;

        // Si no hay player_name, el ID no existe en Free Fire
        if (!data || !data.player_name) {
            return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado en Free Fire" });
        }

        // Revisamos los paquetes disponibles para verificar el bono de Dominicana
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
        // Bloquea los IDs falsos que rechaza el servidor de Garena
        return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado o error en los servidores de Garena" });
    }
}
