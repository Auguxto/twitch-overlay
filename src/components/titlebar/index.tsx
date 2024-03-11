import { invoke } from "@tauri-apps/api";
import { useContext, useReducer } from "react";
import { appWindow } from "@tauri-apps/api/window";

import { ChatContext } from "../../context/chat";

import Switch from "../switch";

import * as S from "./styles";

export default function TitleBar() {
	const { chatIsConnected, channel } = useContext(ChatContext);

	// Always on top toggle
	const [alwaysOnTop, toggleAlwaysOnTop] = useReducer((s) => {
		invoke("set_always_on_top", { value: !s });
		return !s;
	}, false);

	return (
		<S.Container data-tauri-drag-region>
			<S.Brand data-tauri-drag-region>
				<S.Logo data-tauri-drag-region />
				<S.Title data-tauri-drag-region>Twitch Chat</S.Title>
			</S.Brand>
			<S.Buttons>
				{chatIsConnected && (
					<S.ActionButton
						onClick={() =>
							appWindow.emit("close-chat", `#${channel.toLowerCase()}`)
						}
					>
						close
					</S.ActionButton>
				)}
				<Switch
					width={30}
					height={15}
					backgroundColor="#ffffff"
					circleColor="#8343c8"
					value={alwaysOnTop}
					onClick={toggleAlwaysOnTop}
				/>
			</S.Buttons>
		</S.Container>
	);
}
