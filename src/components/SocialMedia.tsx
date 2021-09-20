import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { FlexRow } from "../styles/Flex";
import { faGithub, faNpm, IconDefinition } from "@fortawesome/free-brands-svg-icons";

const LinkIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

const LINKS: { href: string; icon: IconDefinition; color: string }[] = [
  {
    href: "https://www.github.com/lbragile/ColorMaster",
    icon: faGithub,
    color: "black"
  },
  {
    href: "https://www.npmjs.com/package/colormaster",
    icon: faNpm,
    color: "red"
  }
];

export default function SocialMedia(): JSX.Element {
  return (
    <FlexRow $gap="8px">
      {LINKS.map((link) => {
        return (
          <a key={link.href} title={link.href} href={link.href}>
            <LinkIcon key={link.href} icon={link.icon} color={link.color} size="2x" />
          </a>
        );
      })}
    </FlexRow>
  );
}
