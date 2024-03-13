use std::sync::{Arc, Mutex};
use tauri::Manager;

mod types;
mod utils;

pub fn connect_to_chat(channel_name: String, app: tauri::AppHandle) {
    tauri::async_runtime::spawn(async move {
        let app_handle = app.app_handle();
        let main_window = app_handle.get_window("main").unwrap();

        let mut twitch_client = tmi::Client::connect().await.unwrap();

        let twitch_channel = tmi::Channel::parse(channel_name.clone()).unwrap();

        match twitch_client.join(&twitch_channel).await {
            Ok(_) => &main_window
                .emit_and_trigger("chat-connected", true)
                .unwrap(),
            Err(_) => todo!(),
        };

        // Listen for close chat if necessary
        let is_to_close_chat = Arc::new(Mutex::new(false));

        let is_to_close_chat_arc = Arc::clone(&is_to_close_chat);

        main_window.listen_global("close-chat", move |_event| {
            let mut close_chat = is_to_close_chat_arc.lock().unwrap();

            *close_chat = true;
        });

        // Listen for messages
        loop {
            if *is_to_close_chat.lock().unwrap() {
                let _ = &main_window.emit_and_trigger("chat-connected", false);
                break;
            }
            // Wait for a message
            match twitch_client.recv().await {
                // Handle the message
                Ok(msg) => match msg.as_typed() {
                    Ok(tmi::Message::Privmsg(msg)) => {
                        // println!("{:?}", msg);
                        let _ = app
                            .app_handle()
                            .get_window("main")
                            .unwrap()
                            .emit_all("twitch_message_received", utils::parse_priv_msg(msg));
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
