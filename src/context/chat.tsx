import { appWindow } from "@tauri-apps/api/window";
import { type ReactNode, createContext, useState, useEffect } from "react";
import { useInterval } from "usehooks-ts";

type ChatContextProps = {
	messages: Message[];
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	channel: string;
	setChannel: React.Dispatch<React.SetStateAction<string>>;
	chatIsPaused: boolean;
	setChatIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
	chatIsConnected: boolean;
};

export const ChatContext = createContext({} as ChatContextProps);

type ChatProviderProps = {
	children: ReactNode;
};

export default function ChatProvider({ children }: ChatProviderProps) {
	// States
	const [messages, setMessages] = useState<Message[]>([]);
	const [channel, setChannel] = useState("");
	const [chatIsPaused, setChatIsPaused] = useState(false);
	const [chatIsConnected, setChatIsConnected] = useState(false);

	useEffect(() => {
		const chatIsConnectedListener = appWindow.listen(
			"chat-connected",
			({ payload }: { payload: boolean }) => {
				setChatIsConnected(payload);

				if (!payload) {
					setMessages([]);
					setChannel("");
				}
			},
		);

		return () => {
			chatIsConnectedListener.then((unlisten) => unlisten());
		};
	}, []);

	useInterval(
		() => {
			if (messages.length > 300) {
				const lastMessages = messages.slice(-200);
				setMessages(lastMessages);
			}
		},
		1000 * 60 * 2,
	);

	return (
		<ChatContext.Provider
			value={{
				chatIsPaused,
				setChatIsPaused,
				messages,
				setMessages,
				channel,
				setChannel,
				chatIsConnected,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
}
