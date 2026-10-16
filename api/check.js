import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') return res.status(200).end();

    const playerId = req.query.player_id;

    try {
        /* 
          CONEXIÓN A NODO DE CONSULTA INDEPENDIENTE (Ej: Sipo / Volsever API Checker)
          Este servicio intermedio le pregunta a Garena evadiendo los bloqueos.
          Solo consume de tu cuenta un micro-centavo por la consulta del ID.
        */
        const apiKey = "TU_TOKEN_DE_CONSULTA_AQUÍ"; 
        const urlChecker = `https://proveedor-checker.com{playerId}&region=DO&key=${apiKey}`;

        const response = await axios.get(urlChecker);
        const data = response.data;

        // Si el checker devuelve que el ID no existe en los servidores de Free Fire
        if (data.status === "error" || !data.player_name) {
            return res.status(404).json({ error: true, message: "ID inexistente" });
        }

        // Devolvemos el Nickname real y si los diamantes promocionales están activos
        return res.status(200).json({
            error: false,
            nickname: data.player_name, 
            bonus_available: data.has_bonus // True si es ilimitado, False si es limitado
        });

    } catch (err) {
        return res.status(500).json({ error: true, message: "Error temporal en el nodo de consulta" });
    }
}
