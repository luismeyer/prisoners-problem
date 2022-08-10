import styled from "styled-components";

export const Grid = styled.div<{ boxCount: number; boxSize: number }>`
  position: relative;
  padding: 16px;

  display: grid;
  grid-gap: ${(props) => props.boxSize}px;
  grid-template-columns: repeat(${(props) => Math.floor(Math.sqrt(props.boxCount))}, 1fr);

  align-items: center;
  justify-items: center;
`;
