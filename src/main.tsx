import React from "react";
import ReactDOM from "react-dom/client";

import App from "./app";

import ChatProvider from "./context/chat";

import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ChatProvider>
			<App />
		</ChatProvider>
	</React.StrictMode>,
);
