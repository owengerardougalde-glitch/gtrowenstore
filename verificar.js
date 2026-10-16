export default async function handler(req, res) {
    const { uid } = req.query;

    if (!uid) {
        return res.status(400).json({ error: 'Falta el UID' });
    }

    try {
        // Estructura lista para conectar con el servidor real del proveedor
        const estadoReal = (parseInt(uid.slice(-1)) % 2 === 0) ? "ILIMITADO" : "LIMITADO";

        res.status(200).json({ uid: uid, status: estadoReal });

    } catch (error) {
        res.status(500).json({ error: 'Error de servidor' });
    }
}
