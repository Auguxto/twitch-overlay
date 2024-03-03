import styled from "styled-components";

import logo from "../assets/images/app-icon.svg";

export const TitleBar = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 30px;

  background: #8343c8;

  padding-right: 5px;

  user-select: none;
`;

export const TitleBarBrand = styled.div`
  display: flex;

  align-items: center;

  gap: 5px;
`;

export const TitleBarTitle = styled.div`
  font-size: 10px;
  font-family: "Twitch", sans-serif;

  color: #ffffff;

  margin-top: -10px;
`;

export const TitleBarLogo = styled.img.attrs({
	src: logo,
	alt: "Twitch",
	draggable: false,
})`
  width: 25px;
  height: 25px;
`;

export const Container = styled.div`
  display: flex;

  width: 100%;
  height: 100vh;

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
  height: 330px;

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
