import prisma from "../config/db.config.js";
class ChatsController {
    static async index(req, res) {
        const { group_id } = req.params;
        const chats = await prisma.chats.findMany({
            where: {
                group_id: group_id,
            },
        });
        return res.json({ data: chats });
    }
}
export default ChatsController;
