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
          CONEXIÓN A NODO DE CONSULTA INDEPENDIENTE
          Aquí debes colocar la URL y el Token de acceso de tu servicio de Checker contratado.
          Este nodo se encargará de realizar el viaje secreto a Pagostore evadiendo los bloqueos.
        */
        const tokenServicio = "TU_TOKEN_DE_CHECKER_AQUÍ"; 
        const urlAPI = `https://checker-global-ff.com{playerId}&region=DO&token=${tokenServicio}`;

        const response = await axios.get(urlAPI);
        const data = response.data;

        // Si el checker detecta que el ID ingresado es falso o no se encuentra en Garena
        if (!data || data.status === "error" || !data.player_name) {
            return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado en Free Fire" });
        }

        // Devolvemos el Nickname real y el estado del bono regional a tu index.html
        return res.status(200).json({
            error: false,
            nickname: data.player_name, 
            bonus_available: data.has_dominicana_bonus // True para Ilimitado, False para Limitado
        });

    } catch (err) {
        return res.status(500).json({ error: true, message: "Error temporal en el nodo de consulta externo." });
    }
}
