// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle, Manager};

mod twitch;

#[tauri::command]
fn set_always_on_top(value: bool, handle: AppHandle) {
    let window = handle.get_window("main").unwrap();
    let _ = match value {
        true => window.set_always_on_top(true),
        false => window.set_always_on_top(false),
    };
}

fn main() {
    tauri::Builder::default()
        .setup(move |app| {
            let handle = app.handle();

            twitch::connect_to_chat("#ale_apoka".to_string(), handle);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![set_always_on_top])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
