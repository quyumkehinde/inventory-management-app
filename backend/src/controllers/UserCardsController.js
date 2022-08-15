import { sendError, sendSuccess } from "./BaseController.js"
import { fetchCards as _fetchCards } from "../repositories/UserCardRepository.js"

export const fetchCards = async(req, res) => {
    try {
        const cards = await _fetchCards(req.body.user.id);
        return sendSuccess(res, 'User cards retrieved successfully', cards);
    } catch (e) {
        console.log(e)
        return sendError(res);
    }
}
