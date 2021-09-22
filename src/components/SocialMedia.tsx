import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { faGithub, faNpm, IconDefinition } from "@fortawesome/free-brands-svg-icons";

const LinkIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  margin: 0 8px;
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
    <span>
      {LINKS.map((link) => {
        return (
          <a key={link.href} href={link.href}>
            <LinkIcon key={link.href} icon={link.icon} color={link.color} size="2x" />
          </a>
        );
      })}
    </span>
  );
}
