const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Utiliser le port donné par Render ou 3000 par défaut
const PORT = process.env.PORT || 3000;

// Route d'accueil pour vérifier que le site marche
app.get('/', (req, res) => {
    res.send('L\'API Free Fire fonctionne ! Utilise /check/UID pour tester.');
});

// Route pour vérifier un UID
app.get('/check/:uid', async (req, res) => {
    const uid = req.params.uid;
    
    // API Externe (Change ce lien si elle ne marche plus)
    const apiURL = `https://free-ff-api-src-5plp.onrender.com/api/get?region=all&uid=${uid}`;
    
    console.log(`Checking UID: ${uid}`);

    try {
        const response = await axios.get(apiURL);
        
        if (response.data && response.data.nickname) {
            res.json({
                success: true,
                uid: uid,
                nickname: response.data.nickname,
                region: response.data.region
            });
        } else {
            res.json({ success: false, message: "UID invalide ou introuvable" });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur de l'API externe" });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
