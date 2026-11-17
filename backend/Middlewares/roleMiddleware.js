
const checkRole = (roles) => {  //Comparaison entres les roles Router et le role l'utilisateur connecté (venant de la requete authMiddleware) 

return async (req, res, next) => {

    try{
        if (! req.user)
        {
            res.status(401).json({message: "User non authentifié"})
        }
        
        const role = req.user.role; // role du user connecté de authMiddleware
        const tabRoles = Array.isArray(roles)? roles:[roles]; //mettre les roles du routes dans un tableau
        if (!roles.includes(role))
        { 
            res.status(403).json({message: "Acces non autorisé"})
        }
        next();
    }
        catch(error)
        {
            res.status(500).json(error);
        }
    
}
}


module.exports =  checkRole;