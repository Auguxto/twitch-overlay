use serde::Serialize;
use tauri::Manager;

#[derive(Serialize, Clone, Debug)]
struct Reply {
    id: String,
    sender: String,
    text: String,
}

#[derive(Serialize, Clone, Debug)]
struct Message {
    id: String,
    sender: String,
    text: String,
    color: String,
    is_action: bool,
    bits: u64,
    reply_to: Option<Reply>,
    timestamp: String,
}

pub fn connect_to_chat(channel_name: String, app: tauri::AppHandle) {
    tauri::async_runtime::spawn(async move {
        // Connect to Twitch
        let mut twitch_client = tmi::Client::connect().await.unwrap();

        let twitch_channel = tmi::Channel::parse(channel_name).unwrap();

        twitch_client.join(&twitch_channel).await.unwrap();

        // Listen for messages
        loop {
            // Wait for a message
            match twitch_client.recv().await {
                // Handle the message
                Ok(msg) => match msg.as_typed() {
                    Ok(tmi::Message::Privmsg(msg)) => {
                        // println!("{:?}", msg);
                        let _ = app.app_handle().get_window("main").unwrap().emit_all(
                            "twitch_message_received",
                            Message {
                                id: msg.message_id().to_string(),
                                sender: msg.sender().name().to_string(),
                                text: msg.text().to_string(),
                                color: msg.color().unwrap_or("").to_string(),
                                is_action: msg.is_action(),
                                bits: msg.bits().unwrap_or(0),
                                reply_to: msg.reply_to().map(|reply| Reply {
                                    id: reply.message_id().to_string(),
                                    sender: reply.sender().name().to_string(),
                                    text: reply.text().to_string(),
                                }),
                                timestamp: msg.timestamp().to_string(),
                            },
                        );
                    }
                    Ok(tmi::Message::Reconnect) => {
                        if let Err(e) = twitch_client.reconnect().await {
                            twitch_client.join(&twitch_channel).await.unwrap();
                            // eprintln!("Error reconnecting: {}", e);
                        }
                        if let Err(e) = twitch_client.join(&twitch_channel).await {
                            // eprintln!("Error rejoining channel: {}", e);
                        }
                    }
                    Ok(_) => {}
                    Err(e) => {
                        // eprintln!("Error parsing message: {}", e);
                    }
                },
                Err(e) => {
                    twitch_client.reconnect().await.unwrap();
                    twitch_client.join(&twitch_channel).await.unwrap();
                }
            }
        }
    });
}
