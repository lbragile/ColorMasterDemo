import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import styled from "styled-components";
import { FlexRow, FlexColumn } from "../styles/Flex";
import { Heading } from "../styles/Heading";
import { Swatch, SwatchCounter } from "../styles/Swatch";
import { Tooltip } from "../styles/Tooltip";
import { IGridSwatch, IGridRow } from "../types/grid";
import { BreakpointsContext } from "./App";
import ColorIndicator from "./ColorIndicator";
import Spacers from "./Spacers";

const LabelledSwatch = styled(Swatch)`
  position: relative;
`;

const InformationIcon = styled(FontAwesomeIcon)`
  border: 1px solid ${(props) => props.theme.borderLight};
  border-radius: 50%;
  background-color: ${(props) => props.theme.borderLight};
  font-size: 1.2rem;
`;

export default function GridRow({ arr, startCount, page, setColor, alpha, setAlpha }: IGridRow): JSX.Element {
  const { isMobile } = useContext(BreakpointsContext);

  const Title = ({ title, text }: { title: string; text: string }) => {
    return page === "manipulate" ? (
      <FlexRow>
        <Heading $size="h1">{title[0].toUpperCase() + title.slice(1)}</Heading>
        <Spacers width="4px" />
        <Tooltip $top={text.split("\n").length * -30 - 10}>
          <span>{text}</span>
          <InformationIcon icon={faInfoCircle} color="hsla(180, 100%, 40%, 1)" />
        </Tooltip>
      </FlexRow>
    ) : (
      <Heading $size="h1">{text}</Heading>
    );
  };

  const GridSwatch = ({ state, alpha, count }: IGridSwatch) => {
    return (
      <LabelledSwatch
        title={state.stringHSL({ precision: [0, 0, 0, 2], alpha })}
        background={state.stringHSL()}
        onClick={() => setColor(state)}
        $radius={75}
        $borderRadius="4px"
        $cursor="pointer"
      >
        <SwatchCounter $isLight={state.isLight()}>{count}</SwatchCounter>
      </LabelledSwatch>
    );
  };

  return (
    <FlexRow $wrap="wrap" $gap="12px">
      {arr.map((item, i) => (
        <FlexColumn key={item.type} $gap="8px" $cols={isMobile ? 24 : 11}>
          <Title title={item.type} text={item.text} />

          <ColorIndicator
            color={item.state.stringHSL({ precision: [0, 0, 0, 2], alpha: alpha[item.type] })}
            alpha={alpha[item.type]}
            setAlpha={(arg) => setAlpha({ ...alpha, [item.type]: arg })}
            dir="column"
          />

          <GridSwatch state={item.state} alpha={alpha[item.type]} count={i + startCount} />
        </FlexColumn>
      ))}
    </FlexRow>
  );
}
