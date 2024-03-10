import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  width: 100%;
  height: calc(100vh - 30px);

  flex-direction: column;

  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);

  border-radius: 5px;

  overflow: hidden;
`;

export const MessagesContainer = styled.div`
  display: flex;

  flex: 1;

  width: 100%;
  height: 100%;

  padding: 5px;

  flex-direction: column;

  overflow-x: hidden;
`;

export const MessageContainer = styled.div<{ broadcaster: boolean }>`
  background-color: ${({ broadcaster }) =>
		broadcaster ? "#8343c8" : "transparent"};

    text-align: justify;
`;

export const MessageSender = styled.span<{ color?: string }>`
  color: ${({ color }) => (color ? color : "#ffffff")};

  font-size: 12px;
  font-weight: bold;
`;

export const MessageText = styled.span`
  font-size: 12px;

  color: #ffffff;

  margin-left: 5px;
`;

export const ChannelContainer = styled.div`
  display: flex;

  flex-direction: column;

  width: 100%;
  height: 300px;

  background-color: #1c1c1c;

  border-radius: 5px;

  overflow: hidden;
`;

export const ChannelForm = styled.div`
  display: flex;

  flex: 1;

  flex-direction: column;

  gap: 10px;

  align-items: center;
  justify-content: center;
`;

export const ChannelInput = styled.input`
  width: 200px;
  height: 30px;

  border-radius: 3px;
  border: none;

  background-color: #2c2c2c;

  padding: 0 10px;

  outline: none;
  
  font-family: "Inter", sans-serif;

  color: #FFFFFF;
`;

export const ChannelButton = styled.button`
  padding: 5px 10px;

  border-radius: 3px;
  border: none;

  background-color: #8343c8;

  font-size: 12px;
  font-family: "Inter", sans-serif;
  font-weight: bold;

  color: #FFFFFF;

  cursor: pointer;

  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #6f2da8;
  }
`;

export const PauseContainer = styled.div`
  position: absolute;

  bottom: 10px;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: auto;
`;

export const PauseButton = styled.button`
  display: flex;

  align-items: center;
  justify-content: center;

  padding: 5px 10px;

  background-color: rgba(0,0,0,0.5);
  border: #000000 solid 2px;
  border-radius: 5px;

  color: #FFFFFF;

  cursor: pointer;

  transition: all 0.2s;

  font-family: "Inter";

  &:hover {
    scale: 1.02;
  }
`;
