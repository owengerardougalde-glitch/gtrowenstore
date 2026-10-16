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
        // API externa de consulta pública activa para extraer perfiles globales de Free Fire
        const urlAlternativa = `https://onrender.com{playerId}&server=US`;
        
        const response = await axios.get(urlAlternativa, { timeout: 6000 });
        const data = response.data;

        if (!data || data.error || !data.nickname) {
            return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado en Free Fire" });
        }

        // Algoritmo matemático para simular el bono sin depender de los bloqueos de Pagostore Garena
        const ultimoDigito = parseInt(playerId.slice(-1));
        const simulacionBono = ultimoDigito % 2 === 0; 

        return res.status(200).json({
            error: false,
            nickname: data.nickname,
            bonus_available: simulacionBono,
            status: simulacionBono ? "ilimitado" : "limitado"
        });

    } catch (err) {
        return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado en los registros de Free Fire" });
    }
}
