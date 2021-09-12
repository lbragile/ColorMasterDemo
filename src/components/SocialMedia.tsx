import React from "react";
import { Icon } from "semantic-ui-react";
import { SemanticCOLORS } from "semantic-ui-react/dist/commonjs/generic";
import styled from "styled-components";

const LinkIcon = styled(Icon)`
  cursor: pointer;
`;

const LINKS: { href: string; name: string; color: SemanticCOLORS }[] = [
  {
    href: "https://www.github.com/lbragile/ColorMaster",
    name: "github",
    color: "black"
  },
  {
    href: "https://www.npmjs.com/package/colormaster",
    name: "npm",
    color: "red"
  }
];

export default function SocialMedia(): JSX.Element {
  return (
    <React.Fragment>
      {LINKS.map((link) => {
        return (
          <a href={link.href} key={link.href}>
            <LinkIcon name={link.name} color={link.color} size="large" circular title={link.href} />
          </a>
        );
      })}
    </React.Fragment>
  );
}
