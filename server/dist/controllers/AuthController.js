import prisma from "../config/db.config.js";
import jwt from "jsonwebtoken";
class AuthController {
    static async login(request, response) {
        try {
            const body = request.body;
            let findUser = await prisma.user.findUnique({
                where: {
                    email: body.email,
                },
            });
            if (!findUser) {
                findUser = await prisma.user.create({
                    data: body,
                });
            }
            let JWTpayload = {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email,
            };
            const token = jwt.sign(JWTpayload, process.env.JWT_SECRET, {
                expiresIn: "90d",
            });
            return response.json({
                message: "Login Success",
                user: {
                    ...findUser,
                    token: `Bearer ${token}`,
                },
            });
        }
        catch (error) {
            return response.status(500).json({
                message: "Internal Server Error",
            });
        }
    }
}
export default AuthController;
