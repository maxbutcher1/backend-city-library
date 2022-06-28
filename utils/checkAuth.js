import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');


    if (token) {
        try{
            const decoded = jwt.verify(token, "secret123");
            
            req.userId = decoded._id;
            req.isAdmin = decoded.isAdmin;
            if(req.isAdmin === false){
                return res.status(403).json({
                    message: "Немає доступа",
                });
            }
            next();

        }catch(err){
            return res.status(403).json({
                message: "Немає доступа",
            });
        }


    } else {
        return res.status(403).json({
            message: "Немає доступа",
        });
    }
}