const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('API Zeno FF est en ligne !');
});

app.get('/check/:uid', async (req, res) => {
    const uid = req.params.uid;
    console.log(`Recherche UID: ${uid}`);

    // --- NOUVEAU FOURNISSEUR ---
    // On utilise une autre source
    const apiURL = `https://ff-api-checker.vercel.app/api/validate/${uid}`;

    try {
        // On met un temps limite de 5 secondes pour ne pas attendre indéfiniment
        const response = await axios.get(apiURL, { timeout: 5000 });
        
        console.log("Réponse reçue:", response.data);

        // Cette nouvelle API renvoie souvent { success: true, data: { nickname: "..." } }
        if (response.data && response.data.success && response.data.data) {
            res.json({
                success: true,
                uid: uid,
                nickname: response.data.data.nickname,
                region: response.data.data.region || "Inconnue"
            });
        } 
        // Parfois elle renvoie directement le nickname sans "data"
        else if (response.data && response.data.nickname) {
             res.json({
                success: true,
                uid: uid,
                nickname: response.data.nickname,
                region: response.data.region || "Inconnue"
            });
        }
        else {
            res.json({ success: false, message: "Joueur introuvable" });
        }

    } catch (error) {
        console.error("Erreur:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Le fournisseur ne répond pas. Réessaie." 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
