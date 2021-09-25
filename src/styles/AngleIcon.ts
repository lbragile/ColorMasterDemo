import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const StyledAngleIcon = styled(FontAwesomeIcon).attrs((props: { $disabled: boolean }) => props)`
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  color: ${(props) => props.theme.colors.arrowColor};

  & path {
    opacity: ${(props) => (props.$disabled ? 0.5 : 1)};

    &:hover {
      fill: ${(props) => (props.$disabled ? props.theme.colors.arrowColor : props.theme.colors.arrowColorHover)};
    }
  }
`;
