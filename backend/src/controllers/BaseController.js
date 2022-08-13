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
        message: message || 'Error occured. Please try again later.',
    });
};

export const home = async (req, res) => {
    return sendSuccess(res, 'Welcome to Dukka API.');
};
