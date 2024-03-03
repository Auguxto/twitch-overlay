import styled from "styled-components";

export const Container = styled.div<{
	width: number;
	height: number;
	backgroundColor: string;
}>`
  display: flex;

  align-items: center;

  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};

  background-color: ${({ backgroundColor }) => backgroundColor};

  border-radius: ${({ height }) => `${height / 2}px`};

  cursor: pointer;
`;

export const Circle = styled.div<{
	width: number;
	height: number;
	circleColor: string;
	value: boolean;
}>`
  width: ${({ height }) => `${height - 2}px`};
  height: ${({ height }) => `${height - 2}px`};

  margin: 0 2px;

  transform: ${({ value }) => (value ? "translateX(100%)" : "translateX(0%)")};

  background-color: ${({ circleColor }) => circleColor};

  border-radius: 50%;

  transition: 0.2s all ease-in-out;
`;
