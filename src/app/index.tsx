import { For } from "million/react";
import { invoke } from "@tauri-apps/api/tauri";
import { useContext, useEffect, useRef } from "react";
import { LogicalSize, appWindow } from "@tauri-apps/api/window";

import TitleBar from "../components/titlebar";

import { ChatContext } from "../context/chat";

import * as S from "./styles";

export default function App() {
	// Refs
	const chatContainer = useRef<HTMLDivElement>(null);
	const chatEnd = useRef<HTMLDivElement>(null);

	// Context
	const {
		setChatIsPaused,
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

				if (!chatIsPaused && chatEnd.current) {
					chatEnd.current.scrollIntoView({ behavior: "instant" });
				}
			},
		);

		return () => {
			// Unlisten
			listenerTwitchMessageReceived.then((listener) => listener());
		};
	}, [chatIsPaused, setMessages]);

	// Setup chat when connected
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (chatContainer.current) {
			chatContainer.current.addEventListener("wheel", () => {
				setChatIsPaused(true);
			});
		}

		if (chatIsConnected) {
			appWindow.setSize(new LogicalSize(300, 600));
		}

		return () => {
			if (chatContainer.current) {
				chatContainer.current.removeEventListener("wheel", () => {});
			}
		};
	}, [chatIsConnected, chatContainer]);

	// Functions
	function connectToChat() {
		if (!channel) {
			return;
		}

		invoke("connect_to_chat", { value: `#${channel.toLowerCase()}` });
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
									broadcaster={
										message.login.toLowerCase() === channel.toLowerCase()
									}
								>
									<S.MessageSender color={message.color}>
										{message.sender}:
									</S.MessageSender>
									<S.MessageText>{message.text}</S.MessageText>
								</S.MessageContainer>
							)}
						</For>
						<div ref={chatEnd} />
						{chatIsPaused && messages.length > 0 && (
							<S.PauseContainer>
								<S.PauseButton
									onClick={() => {
										setChatIsPaused(false);
									}}
								>
									Chat Paused
								</S.PauseButton>
							</S.PauseContainer>
						)}
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
