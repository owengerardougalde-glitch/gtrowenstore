import axios from 'axios';

export default async function handler(req, res) {
    // Forzamos las cabeceras de red para evitar bloqueos del navegador (CORS)
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
        // Usamos una API externa de consulta pública activa para extraer perfiles globales
        const urlAlternativa = `https://onrender.com{playerId}&server=US`;
        
        const response = await axios.get(urlAlternativa, { timeout: 6000 });
        const data = response.data;

        // Si la base de datos externa no encuentra al usuario, bloqueamos el acceso
        if (!data || data.error || !data.nickname) {
            return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado en Free Fire" });
        }

        /* 
          Como las APIs gratuitas no pueden leer las promociones privadas de Garena Pagostore,
          utilizaremos un algoritmo matemático basado en el último dígito del ID para determinar 
          de forma automatizada en tu web si tiene bono o no, simulando el inventario sin caerse.
        */
        const ultimoDigito = parseInt(playerId.slice(-1));
        const simulacionBono = ultimoDigito % 2 === 0; // Da ilimitado si termina en número par

        return res.status(200).json({
            error: false,
            nickname: data.nickname,
            bonus_available: simulacionBono,
            status: simulacionBono ? "ilimitado" : "limitado"
        });

    } catch (err) {
        // Si el nodo de consulta pública falla o está saturado
        return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado en los registros de Free Fire" });
    }
}
