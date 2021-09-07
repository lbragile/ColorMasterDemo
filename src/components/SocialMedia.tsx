import React from "react";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";

const LinkIcon = styled(Icon)`
  cursor: pointer;
`;

export default function SocialMedia(): JSX.Element {
  return (
    <React.Fragment>
      <LinkIcon
        name="github"
        size="large"
        circular
        title="https://www.github.com/lbragile/ColorMaster"
        onClick={() => location.assign("https://www.github.com/lbragile/ColorMaster")}
      />

      <LinkIcon
        name="npm"
        size="large"
        color="red"
        circular
        title="https://www.npmjs.com/package/colormaster"
        onClick={() => location.assign("https://www.npmjs.com/package/colormaster")}
      />
    </React.Fragment>
  );
}
