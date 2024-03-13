use tmi::Privmsg;

use super::types;

pub fn parse_priv_msg(msg: Privmsg<'_>) -> types::Message {
    types::Message {
        id: msg.message_id().to_string(),
        sender: msg.sender().name().to_string(),
        login: msg.sender().login().to_string(),
        text: msg.text().to_string(),
        color: msg.color().unwrap_or("#FFFFFF").to_string(),
        is_action: msg.is_action(),
        bits: msg.bits().unwrap_or(0),
        reply_to: msg.reply_to().map(|reply| types::Reply {
            id: reply.message_id().to_string(),
            sender: reply.sender().name().to_string(),
            login: reply.sender().login().to_string(),
            text: reply.text().to_string(),
        }),
        timestamp: msg.timestamp().to_string(),
    }
}
