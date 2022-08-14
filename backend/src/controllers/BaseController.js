import { DEFAULT_ERROR_MESSAGE } from "../utils/constants.js";

export const sendSuccess = (res, message, data) => {
    return res.status(200).json({
        success: true,
        data: data || {},
        message: message || 'Success.',
    });
};

export const sendError = (res, message, statusCode) => {
    return res.status(statusCode || 500).json({
        success: false,
        message: message || DEFAULT_ERROR_MESSAGE,
    });
};

export const home = async (req, res) => {
    return sendSuccess(res, 'Welcome to Dukka API.');
};
