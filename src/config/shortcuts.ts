const blocked_keys = [
	"F1",
	"F2",
	"F3",
	"F4",
	"F5",
	"F6",
	"F7",
	"F8",
	"F9",
	"F10",
	"F11",
	"F12",
];

const blocked_ctrl_keys = ["f", "g", "p", "r", "u"];

window.addEventListener("keydown", (e) => {
	if (
		blocked_keys.includes(e.key) ||
		(e.ctrlKey && blocked_ctrl_keys.includes(e.key.toLocaleLowerCase()))
	) {
		e.preventDefault();
	}
});

export {};
