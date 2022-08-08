import styled from "styled-components";

export const Container = styled.div<{ size: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;

  color: black;
  font-size: 12px;
`;

export const Number = styled.span`
  position: absolute;
  color: white;
  font-weight: bold;

  top: 100%;
`;

export const Img = styled.img<{ size: number }>`
  height: 100%;
  width: 100%;
`;

export const Sheet = styled.div<{ size: number }>`
  padding: 2px;

  position: absolute;
  background-color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  top: -30%;
`;
