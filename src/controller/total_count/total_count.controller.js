// API for count for chat, video and call
exports.totalCountForCustomer = async(req, res)=>{
    const id = req.query.id;
      try {
        const results = await chat.findAll({
          attributes: ["from_user_id", "to_user_id"],
          where: {
            [Sequelize.Op.or]: [{ from_user_id: id }, { to_user_id: id }],
          },
          group: ["from_user_id", "to_user_id"],
        });
        let uniqueChatsCounts;
        if (results.length > 0) {
          const chats = {};
          results.forEach((row) => {
            const { from_user_id, to_user_id } = row;
            addChat(from_user_id, to_user_id);
            addChat(to_user_id, from_user_id);
          });
    
          function countUniqueChats() {
            const uniqueChats = {};
            if (chats[id]) {
              chats[id].forEach((receiverId) => {
                uniqueChats[receiverId] = (
                  uniqueChats[receiverId] || new Set()
                ).add(id);
              });
            }
            return uniqueChats;
          }
    
          function addChat(userId, counterpartId) {
            if (!chats[userId]) {
              chats[userId] = [];
            }
            if (!chats[userId].includes(counterpartId)) {
              chats[userId].push(counterpartId);
            }
          }
          
          uniqueChatsCounts = countUniqueChats();
          
          // return res.send({
          //   status: true,
          //   message: "Get Data Successfully",
          //   chat_count: Object.keys(uniqueChatsCounts).length,
          // });
        }
        const findUser = await User.findByPk(id)
          const getCall = await video.findAndCountAll({
            where : {
              UserId: id
            }
          })
        const dataForCall = await call.findAndCountAll({
          where : {
            UserId: id
          }
        })
      return res.status(200).json({
        status : true,
        message : "Show total count data for call video and chat",
        call: dataForCall.count || 0,
        video: getCall.count || 0,
        chat_count: Object.keys(uniqueChatsCounts).length || 0,
      })
    }catch(error){
          return res.status(500).json({
            status : false,
            message : error.message
          })
        }
      }