import styled from "styled-components";

import logo from "../../assets/images/app-icon.svg";

export const Container = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 30px;

  background: #8343c8;

  padding-right: 5px;

  user-select: none;

  border-radius: 5px 5px 0 0;

  z-index: 999;
`;

export const Brand = styled.div`
  display: flex;

  align-items: center;

  gap: 5px;
`;

export const Title = styled.div`
  font-size: 10px;
  font-family: "Twitch", sans-serif;

  color: #ffffff;

  margin-top: -10px;
`;

export const Logo = styled.img.attrs({
	src: logo,
	alt: "Twitch",
	draggable: false,
})`
  width: 25px;
  height: 25px;
`;

export const Buttons = styled.div`
  display: flex;
  
  align-items: center;

  gap: 5px;
`;

export const ActionButton = styled.button`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 40px;
  height: 15px;

  padding: 0 5px;

  background-color: #FFFFFF;
  border: none;

  border-radius: 2px;

  font-family: "Inter", sans-serif;
  font-size: 10px;

  color: #8343c8;

  cursor: pointer;
`;
