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

    if (!playerId) {
        return res.status(400).json({ error: true, message: 'ID inválido' });
    }

    try {
        const response = await fetch(`https://api.freefireinfo.tech/gg/info?uid=${playerId}`);
        const textData = await response.text();

        // Esto nos devolverá exactamente qué respondió la API externa para analizarlo
        return res.status(200).json({
            error: false,
            debug_raw_response: textData,
            status: "ok"
        });

    } catch (err) {
        return res.status(500).json({ error: true, message: err.message });
    }
}
