const userModel = require("../Models/userModel");
const {verifyAccessToken, verifyRefreshToken} = require("../utils/jwt");

const authMiddleware = async (req, res, next) => {
    try {
        // 1. Récupérer le token du header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: "Token manquant ou format invalide. Utilisez 'Bearer [token]'",
                code: 'MISSING_TOKEN'
            });
        }

        // 2. Extraire le token (enlever "Bearer ")
        const token = authHeader.split(' ')[1];

        // 3. Vérifier le token avec le service JWT
        const verification = verifyAccessToken(token);

        if (!verification.valid) {
            if (verification.expired) {
                return res.status(401).json({ 
                    message: "Token expiré. Veuillez vous reconnecter.",
                    code: 'TOKEN_EXPIRED'
                });
            }
            return res.status(401).json({ 
                message: "Token invalide.",
                code: 'INVALID_TOKEN'
            });
        }

        // 4. Récupérer l'utilisateur complet depuis la base de données
        const utilisateur = await userModel.findOne({email:verification.decoded.email})
            .select('-password');  // Ne pas renvoyer le mot de passe
               // Peupler le rôle

        if (!utilisateur) {
            return res.status(401).json({ 
                message: "Utilisateur non trouvé.",
                code: 'USER_NOT_FOUND'
            });
        }

        // 5. Vérifier si le compte est actif à remplacer en haut comme verif initiale
       

        // 6. Attacher l'utilisateur à la requête pour les prochains middlewares/controllers
        req.user = utilisateur;
        req.userId = utilisateur._id;
        req.userRole = utilisateur.role;  // Le rôle peuplé
       

        // 7. Passer au middleware suivant ou au contrôleur
        next();

    } catch (error) {
        console.error('❌ Erreur auth middleware:', error);
        res.status(500).json({ 
            message: "Erreur serveur lors de l'authentification",
            code: 'SERVER_ERROR'
        });
    }
};

module.exports = authMiddleware;