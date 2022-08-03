import styled from "styled-components";

export const AbsoluteContainer = styled.div<{
  left?: string;
  top?: string;
}>`
  position: absolute;
  transition: all 1s ease;

  top: ${(props) => props.top && props.top};
  left: ${(props) => props.left && props.left};
  transform: translate(-50%, -50%);

  width: 50px;
  height: 50px;
`;

export const Img = styled.img`
  width: 100%;
`;
