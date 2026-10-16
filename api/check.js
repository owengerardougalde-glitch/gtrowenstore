import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') return res.status(200).end();

    const playerId = req.query.player_id || req.query.id;

    if (!playerId || isNaN(playerId)) {
        return res.status(400).json({ error: true, message: 'ID inválido' });
    }

    try {
        /* 
          CONEXIÓN A NODO DE CONSULTA PURO (Ej: Servidor Checker independiente de Free Fire)
          Este token y URL te darán acceso directo a los datos de Garena Dominicana.
        */
        const tokenConsulta = "TU_TOKEN_DE_CHECKER_AQUÍ"; 
        const urlAPI = `https://checker-global-ff.com{playerId}&region=DO&token=${tokenConsulta}`;

        const response = await axios.get(urlAPI);
        const data = response.data;

        // Si el validador independiente determina que el ID es falso o no existe
        if (!data || data.status === "error" || !data.player_name) {
            return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado en Free Fire" });
        }

        // Devolvemos los datos reales extraídos de Pagostore a tu index.html
        return res.status(200).json({
            error: false,
            nickname: data.player_name, 
            bonus_available: data.has_dominicana_bonus // True si es ilimitado, False si es limitado
        });

    } catch (err) {
        return res.status(500).json({ error: true, message: "Error temporal en el nodo de consulta externa." });
    }
}
