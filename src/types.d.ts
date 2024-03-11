interface Message {
	id: string;
	sender: string;
	login: string;
	text: string;
	color?: string;
	is_action: boolean;
	bits: number;
	reply_to?: {
		id: string;
		sender: string;
		loin: string;
		text: string;
	};
	timestamp: string;
}
