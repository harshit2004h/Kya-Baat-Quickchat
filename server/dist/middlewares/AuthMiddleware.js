import jwt from "jsonwebtoken";
const AuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === undefined) {
        return res.status(401).json({
            message: "Authorization header is missing",
        });
    }
    const token = authHeader.split(" ")[1];
    //verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: "Invalid token",
            });
        }
        req.user = user;
        next();
    });
};
export default AuthMiddleware;
