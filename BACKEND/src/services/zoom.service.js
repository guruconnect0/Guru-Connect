const axios = require('axios');

/**
 * Gets a fresh Server-to-Server OAuth token from Zoom.
 */
const getZoomAccessToken = async () => {
    try {
        const accountId = process.env.ZOOM_ACCOUNT_ID;
        const clientId = process.env.ZOOM_CLIENT_ID;
        const clientSecret = process.env.ZOOM_CLIENT_SECRET;

        // Combine Client ID and Secret in base64
        const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        const response = await axios.post(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
            {},
            {
                headers: {
                    Authorization: `Basic ${authHeader}`,
                },
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error("Zoom Token Error:", error.response?.data || error.message);
        throw new Error("Failed to get Zoom access token");
    }
};

/**
 * Creates a new Zoom meeting.
 * @param {string} topic - The title of the meeting
 * @param {number} duration - Duration in minutes
 */
exports.createZoomMeeting = async (topic, duration = 60) => {
    try {
        const token = await getZoomAccessToken();

        const response = await axios.post(
            'https://api.zoom.us/v2/users/me/meetings',
            {
                topic: topic,
                type: 2, // 2 = Scheduled Meeting
                duration: duration,
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: true, // Crucial: Allows both to join freely!
                    mute_upon_entry: true,
                    waiting_room: false
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // We return the join_url so both candidate and mentor can join freely without host limits
        return response.data.join_url;
    } catch (error) {
        console.error("Create Meeting Error:", error.response?.data || error.message);
        throw new Error("Failed to create Zoom meeting");
    }
};
