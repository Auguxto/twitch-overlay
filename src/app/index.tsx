import { useEffect, useRef, useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";

import logo from "../assets/images/app-icon.svg";

import Switch from "../components/switch";

import "./styles.css";

export default function App() {
	const [alwaysOnTop, setAlwaysOnTop] = useState<boolean>(false);
	const [messages, setMessages] = useState<Message[]>([]);

	const chatContainer = useRef<HTMLDivElement>(null);
	const chatEnd = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const listenerTwitchMessageReceived = appWindow.listen(
			"twitch_message_received",
			({ payload }: { payload: Message }) => {
				setMessages((prevMessages) => [...prevMessages, payload]);

				chatEnd.current?.scrollIntoView({ behavior: "smooth" });
			},
		);

		return () => {
			listenerTwitchMessageReceived.then((listener) => listener());
		};
	}, []);

	useEffect(() => {
		invoke("set_always_on_top", { value: alwaysOnTop });
	}, [alwaysOnTop]);

	return (
		<div className="container">
			<div data-tauri-drag-region className="title-bar">
				<div data-tauri-drag-region className="title-bar-brand">
					<img
						data-tauri-drag-region
						className="title-bar-logo"
						src={logo}
						alt="Twitch"
						draggable={false}
					/>
					<span data-tauri-drag-region className="title-bar-title">
						Twitch Chat
					</span>
				</div>
				<Switch
					width={30}
					height={15}
					backgroundColor="#ffffff"
					circleColor="#8343c8"
					value={alwaysOnTop}
					onClick={() => setAlwaysOnTop((prev) => !prev)}
				/>
			</div>
			<div ref={chatContainer} className="messages-container">
				{messages.map((message) => (
					<div key={message.id}>
						<span className="message-sender" style={{ color: message.color }}>
							{message.sender}:
						</span>
						<span className="message-text">{message.text}</span>
					</div>
				))}
				<div ref={chatEnd} />
			</div>
		</div>
	);
}
