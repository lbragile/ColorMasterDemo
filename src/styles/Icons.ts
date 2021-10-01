import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const AngleIcon = styled(FontAwesomeIcon).attrs((props: { $disabled: boolean }) => props)`
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  color: ${(props) => props.theme.arrowColor};

  & path {
    opacity: ${(props) => (props.$disabled ? 0.5 : 1)};

    &:hover {
      fill: ${(props) => (props.$disabled ? props.theme.arrowColor : props.theme.arrowColorHover)};
    }
  }
`;

export const InformationIcon = styled(FontAwesomeIcon)`
  border-radius: 50%;
  background-color: ${(props) => props.theme.bgDefault};
  color: ${(props) => props.theme.info};
  font-size: 1.2rem;
`;
