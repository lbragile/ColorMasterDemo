import styled from "styled-components";

export const FlexRow = styled.div.attrs((props: { $gap: string; $wrap: string }) => props)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: ${(props) => props.$wrap ?? "no-wrap"};
  gap: ${(props) => props.$gap ?? ""};
  width: 100%;
`;

export const FlexColumn = styled.div.attrs((props: { $gap: string; $cols?: number }) => props)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.$gap ?? ""};
  width: ${(props) => ((props.$cols ?? 24) * 100) / 24 + "%"};
`;
