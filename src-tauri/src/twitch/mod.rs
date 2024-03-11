use reqwest::Client;
use serde::Serialize;
use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};
use tauri::Manager;

#[derive(Serialize, Clone, Debug)]
struct Reply {
    id: String,
    sender: String,
    login: String,
    text: String,
}

#[derive(Serialize, Clone, Debug)]
struct Message {
    id: String,
    sender: String,
    login: String,
    text: String,
    color: String,
    is_action: bool,
    bits: u64,
    reply_to: Option<Reply>,
    timestamp: String,
}

pub fn connect_to_chat(channel_name: String, app: tauri::AppHandle) {
    tauri::async_runtime::spawn(async move {
        let handle = app.app_handle();
        let main_window = handle.get_window("main").unwrap();

        let close_chat = Arc::new(Mutex::new(false));

        // Connect to Twitch
        let mut twitch_client = tmi::Client::connect().await.unwrap();

        let twitch_channel = tmi::Channel::parse(channel_name.clone()).unwrap();

        match twitch_client.join(&twitch_channel).await {
            Ok(_) => &main_window
                .emit_and_trigger("chat-connected", true)
                .unwrap(),
            Err(_) => todo!(),
        };

        let close_chat_event_clone = Arc::clone(&close_chat);

        main_window.listen_global("close-chat", move |_event| {
            let mut close_chat = close_chat_event_clone.lock().unwrap();

            *close_chat = true;
        });

        // let client = Client::new();

        // let mut params = HashMap::new();
        // params.insert("client_id", "jv608hc6t3a2j1j5htkaemrwt0bajs");

        // Listen for messages
        loop {
            if *close_chat.lock().unwrap() {
                let _ = &main_window.emit_and_trigger("chat-connected", false);
                break;
            }
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
                                login: msg.sender().login().to_string(),
                                text: msg.text().to_string(),
                                color: msg.color().unwrap_or("").to_string(),
                                is_action: msg.is_action(),
                                bits: msg.bits().unwrap_or(0),
                                reply_to: msg.reply_to().map(|reply| Reply {
                                    id: reply.message_id().to_string(),
                                    sender: reply.sender().name().to_string(),
                                    login: reply.sender().login().to_string(),
                                    text: reply.text().to_string(),
                                }),
                                timestamp: msg.timestamp().to_string(),
                            },
                        );
                    }
                    Ok(tmi::Message::RoomState(_state)) => {
                        // println!("{:?}", state);
                    }
                    Ok(tmi::Message::Notice(_notice)) => {
                        // println!("{:?}", _notice);
                    }
                    Ok(tmi::Message::UserState(_state)) => {
                        // println!("{:?}", _state);
                    }
                    Ok(tmi::Message::UserNotice(_notice)) => {
                        // println!("{:?}", _notice);
                    }

                    Ok(tmi::Message::Reconnect) => {
                        if let Err(_e) = twitch_client.reconnect().await {
                            twitch_client.join(&twitch_channel).await.unwrap();
                        }
                        if let Err(_e) = twitch_client.join(&twitch_channel).await {}
                    }
                    Ok(_) => {}
                    Err(_e) => {}
                },
                Err(_e) => {}
            }
        }
    });
}
