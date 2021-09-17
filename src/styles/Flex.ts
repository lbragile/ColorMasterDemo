import styled from "styled-components";

export const FlexRow = styled.div.attrs((props: { $gap: string }) => props)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.$gap ?? ""};
`;

export const FlexColumn = styled.div.attrs((props: { $gap: string }) => props)`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.$gap ?? ""}; ;
`;
