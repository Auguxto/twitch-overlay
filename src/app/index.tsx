import { useEffect, useReducer, useRef, useState } from "react";
import { LogicalSize, appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";

import Switch from "../components/switch";

import * as S from "./styles";

export default function App() {
	// States
	const [messages, setMessages] = useState<Message[]>([]);
	const [channel, setChannel] = useState<string>("");

	const isChatConnected = messages.length > 0;

	// Always on top toggle
	const [alwaysOnTop, toggleAlwaysOnTop] = useReducer((s) => {
		invoke("set_always_on_top", { value: !s });
		return !s;
	}, false);

	// Refs
	const chatContainer = useRef<HTMLDivElement>(null);
	const chatEnd = useRef<HTMLDivElement>(null);

	// Listening for messages
	useEffect(() => {
		const listenerTwitchMessageReceived = appWindow.listen(
			"twitch_message_received",
			({ payload }: { payload: Message }) => {
				setMessages((prevMessages) => [...prevMessages, payload]);

				chatEnd.current?.scrollIntoView({ behavior: "smooth" });
			},
		);

		return () => {
			// Unlisten
			listenerTwitchMessageReceived.then((listener) => listener());
		};
	}, []);

	// Setup chat when connected
	useEffect(() => {
		if (isChatConnected) {
			appWindow.setSize(new LogicalSize(300, 600));
		}
	}, [isChatConnected]);

	// Functions
	function connectToChat() {
		if (!channel) {
			return;
		}

		invoke("connect_to_chat", { value: `#${channel}` });
	}

	return isChatConnected ? (
		<S.Container>
			<S.TitleBar data-tauri-drag-region>
				<S.TitleBarBrand data-tauri-drag-region>
					<S.TitleBarLogo data-tauri-drag-region />
					<S.TitleBarTitle data-tauri-drag-region>Twitch Chat</S.TitleBarTitle>
				</S.TitleBarBrand>
				<Switch
					width={30}
					height={15}
					backgroundColor="#ffffff"
					circleColor="#8343c8"
					value={alwaysOnTop}
					onClick={toggleAlwaysOnTop}
				/>
			</S.TitleBar>
			<S.MessagesContainer ref={chatContainer} className="messages-container">
				{messages.map((message) => (
					<S.MessageContainer
						key={message.id}
						broadcaster={message.sender === channel}
					>
						<S.MessageSender color={message.color}>
							{message.sender}:
						</S.MessageSender>
						<S.MessageText>{message.text}</S.MessageText>
					</S.MessageContainer>
				))}
				<div ref={chatEnd} />
			</S.MessagesContainer>
		</S.Container>
	) : (
		<S.ChannelContainer>
			<S.TitleBar data-tauri-drag-region>
				<S.TitleBarBrand data-tauri-drag-region>
					<S.TitleBarLogo data-tauri-drag-region />
					<S.TitleBarTitle data-tauri-drag-region>Twitch Chat</S.TitleBarTitle>
				</S.TitleBarBrand>
				<Switch
					width={30}
					height={15}
					backgroundColor="#ffffff"
					circleColor="#8343c8"
					value={alwaysOnTop}
					onClick={toggleAlwaysOnTop}
				/>
			</S.TitleBar>
			<S.ChannelForm>
				<S.ChannelInput
					spellCheck={false}
					placeholder="Channel name"
					value={channel}
					onChange={(e) => setChannel(e.target.value)}
				/>
				<S.ChannelButton onClick={connectToChat}>Open Chat</S.ChannelButton>
			</S.ChannelForm>
		</S.ChannelContainer>
	);
}
