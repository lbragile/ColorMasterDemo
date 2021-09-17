import React from "react";
import styled from "styled-components";
import useBreakpointMap from "../hooks/useBreakpointMap";
// import useCopyToClipboard from "../hooks/useCopytoClipboard";
import Spacers from "./Spacers";
import CM, { extendPlugins } from "colormaster";
import NamePlugin from "colormaster/plugins/name";
import { FlexRow } from "../styles/Flex";
import Checkbox from "./Checkbox";

extendPlugins([NamePlugin]);

const StyledColorDisplay = styled.input.attrs(
  (props: { $mobile: boolean; action: { color: string; [key: string]: unknown } }) => props
)`
  padding: 10px;
  border-radius: 4px;
`;

export const Heading = styled.h3.attrs((props: { $color?: string }) => props)`
  color: ${(props) => props.color ?? "black"};
  text-align: center;
  margin: 0;
`;

interface IColorIndicator {
  color: string;
  alpha: boolean;
  setAlpha: React.Dispatch<React.SetStateAction<boolean>>;
  showName?: boolean;
}

export default function ColorIndicator({ color, alpha, setAlpha, showName = true }: IColorIndicator): JSX.Element {
  // const [copy, setCopy] = useCopyToClipboard();
  const { isMobile } = useBreakpointMap();

  // const copyAction = useMemo(
  //   () =>
  //     function (text: string) {
  //       return {
  //         icon: (
  //           <Popup
  //             content="Copy to clipboard"
  //             position="top center"
  //             inverted
  //             trigger={<Icon name={copy ? "check circle" : "copy"} />}
  //           />
  //         ),
  //         color: copy ? "green" : "teal",
  //         onClick: () => setCopy(text),
  //         onBlur: () => setCopy("")
  //       };
  //     },
  //   [copy, setCopy]
  // );

  return (
    <>
      {showName && <Heading $color="grey">{CM(color).name({ exact: false })}</Heading>}

      <FlexRow>
        <StyledColorDisplay type="text" value={color} spellCheck={false} readOnly $mobile={isMobile} />

        <Spacers width="4px" />

        <Checkbox value={alpha} setValue={setAlpha} label="Alpha" />
      </FlexRow>
    </>
  );
}
