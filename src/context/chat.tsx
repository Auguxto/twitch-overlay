import { ReactNode, createContext, useReducer, useState } from "react";
import { useInterval } from "usehooks-ts";

type ChatContextProps = {
	messages: Message[];
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
	channel: string;
	setChannel: React.Dispatch<React.SetStateAction<string>>;
	chatIsPaused: boolean;
	toggleChatIsPaused: React.DispatchWithoutAction;
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
	const [chatIsPaused, toggleChatIsPaused] = useReducer((s) => !s, false);

	const chatIsConnected = messages.length > 0;

	useInterval(
		() => {
			const lastMessages = messages.slice(-200);
			setMessages(lastMessages);
		},
		1000 * 60 * 5,
	);

	return (
		<ChatContext.Provider
			value={{
				chatIsPaused,
				toggleChatIsPaused,
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
