import { sendError, sendSuccess } from "./BaseController.js"
import { fetchCards as _fetchCards } from "../repositories/UserCardRepository.js"
import { logger } from "../config/Log.js";

export const fetchCards = async(req, res) => {
    try {
        const cards = await _fetchCards(req.body.user.id);
        return sendSuccess(res, 'User cards retrieved successfully', cards);
    } catch (error) {
        logger.error('Error occured while fetching cards.', { error, req })
        return sendError(res);
    }
}
