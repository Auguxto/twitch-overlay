import { useContext, useEffect, useRef } from "react";
import { LogicalSize, appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";

import TitleBar from "../components/titlebar";

import { ChatContext } from "../context/chat";

import * as S from "./styles";
import { For } from "million/react";

export default function App() {
	// Refs
	const chatContainer = useRef<HTMLDivElement>(null);
	const chatEnd = useRef<HTMLDivElement>(null);

	// Context
	const {
		chatIsPaused,
		messages,
		setMessages,
		channel,
		setChannel,
		chatIsConnected,
	} = useContext(ChatContext);

	// Listening for messages
	useEffect(() => {
		const listenerTwitchMessageReceived = appWindow.listen(
			"twitch_message_received",
			({ payload }: { payload: Message }) => {
				setMessages((prevMessages) => [...prevMessages, payload]);

				if (!chatIsPaused) {
					chatEnd.current?.scrollIntoView({ behavior: "instant" });
				}
			},
		);

		return () => {
			// Unlisten
			listenerTwitchMessageReceived.then((listener) => listener());
		};
	}, [chatIsPaused, setMessages]);

	// Setup chat when connected
	useEffect(() => {
		if (chatIsConnected) {
			appWindow.setSize(new LogicalSize(300, 600));
		}
	}, [chatIsConnected]);

	// Functions
	function connectToChat() {
		if (!channel) {
			return;
		}

		invoke("connect_to_chat", { value: `#${channel}` });
	}

	return (
		<>
			<TitleBar />
			{chatIsConnected ? (
				<S.Container>
					<S.MessagesContainer
						ref={chatContainer}
						className="messages-container"
					>
						<For each={messages}>
							{(message) => (
								<S.MessageContainer
									key={message.id}
									// Change to sernder login not username
									broadcaster={message.sender === channel}
								>
									<S.MessageSender color={message.color}>
										{message.sender}:
									</S.MessageSender>
									<S.MessageText>{message.text}</S.MessageText>
								</S.MessageContainer>
							)}
						</For>
						<div ref={chatEnd} />
					</S.MessagesContainer>
				</S.Container>
			) : (
				<S.ChannelContainer>
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
			)}
		</>
	);
}
