import * as S from "./styles";

export type SwitchProps = {
	width: number;
	height: number;
	backgroundColor: string;
	circleColor: string;
	value: boolean;
	onClick: () => void;
};

export default function Switch(props: SwitchProps) {
	return (
		<S.Container
			title="Always on Top"
			width={props.width}
			height={props.height}
			backgroundColor={props.backgroundColor}
			onClick={props.onClick}
		>
			<S.Circle
				value={props.value}
				width={props.width}
				height={props.height}
				circleColor={props.circleColor}
			/>
		</S.Container>
	);
}
