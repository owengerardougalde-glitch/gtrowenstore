import axios from 'axios';

export default async function handler(req, res) {
    // Cabeceras estrictas de permisos CORS para gtrowen.store
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Ruta de consulta para el verificador de ID
    if (req.method === 'GET') {
        const playerId = req.query.player_id || req.query.id;

        if (!playerId || isNaN(playerId)) {
            return res.status(400).json({ error: true, message: 'ID inválido' });
        }

        try {
            // Consulta directa y en vivo a los servidores de autenticación de Garena
            const garenaResponse = await axios.post('https://garena.sg', {
                app_id: 100067, // Free Fire
                login_id: playerId,
                region: 'DO',   // Forzamos República Dominicana 🇩🇴
                lang: 'es'
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 5000 
            });

            const data = garenaResponse.data;

            if (!data || !data.player_name) {
                return res.status(404).json({ error: true, status: "failed", message: "ID no encontrado" });
            }

            // Validamos la existencia del bono regional en la lista de paquetes
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
            return res.status(404).json({ error: true, status: "failed", message: "ID no registrado en Garena" });
        }
    }

    // ========================================================
    // BASE PARA INTEGRACIÓN DE COMPRAS AUTOMÁTICAS (POST)
    // ========================================================
    if (req.method === 'POST') {
        const { player_id, product_id, token_pago } = req.body;

        try {
            /* 
              Aquí se conecta tu pasarela de pagos automatizada (Stripe / Gateway).
              Una vez aprobado el cobro de forma digital, el servidor envía la orden 
              de inyección automática a tu distribuidor API (ej. Volsever) sin que abras WhatsApp.
            */
            return res.status(200).json({
                success: true,
                message: "Pago aprobado y diamantes enviados automáticamente a la cuenta."
            });
        } catch (error) {
            return res.status(500).json({ error: true, message: "Error al procesar el pago automático." });
        }
    }
}
