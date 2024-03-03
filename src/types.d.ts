interface Message {
	id: string;
	sender: string;
	text: string;
	color?: string;
	is_action: boolean;
	bits: number;
	reply_to?: {
		id: string;
		sender: string;
		text: string;
	};
	timestamp: string;
}
