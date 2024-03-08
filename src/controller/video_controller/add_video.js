const db = require('../../../config/db.config')
const video_call_details = db.video
const User = db.User;


// API for add video call
exports.add_video_call = async(req, res)=>{
    try {
        const {
          user_id,
          expert_id,
          name,
          start_time,
          end_time,
          duration,
          current_used_bal,
        } = req.body;
    
        // Validate request data
        if (!expert_id || !name || !user_id || !start_time || !current_used_bal || !end_time || !duration) {
          return res.status(400).json({
            status: false,
            message: 'Please provide name, expert_id,duration, user_id, start_time, and end_time.',
          });
        }
        // Fetch expert's per minute rate
        const expert = await User.findOne({
          where: {
            id: expert_id,
            user_type: {
              [Op.in]: ['2', '3']
            }
          }
        });
    
        if (!expert) {
          return res.status(404).json({
            status: false,
            message: 'Expert not found or not of the required type.',
          });
        }
    
        // const expert_per_minute_rate = expert.per_minute;
    
        // // Calculate the duration in minutes (assuming duration is in minutes)
        // const start = new Date(start_time);
        // const end = new Date(end_time);
        // const callDuration = Math.round((end - start) / (1000 * 60)); // Duration in minutes
    
        // // Calculate the amount based on the duration and expert's rate
        // const amountDeducted = callDuration * expert_per_minute_rate;
    
        // Update the call record with duration and deducted amount
        const result = await video_call_details.create({
          UserId: user_id,
          expert_id: expert_id,
          senderName: name,
          video_call_duration: duration,
          current_used_bal: current_used_bal, // You might need to adjust this based on your actual logic
          start_time: start_time,
          end_time: end_time,
        });
    
        return res.status(200).json({
          status: true,
          msg: "video Data stored successfully",
          data: result,
        });
    
      } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
          status: false,
          message: 'Internal server error.',
        });
      }
}