import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { faGithub, faNpm, IconDefinition } from "@fortawesome/free-brands-svg-icons";

const LinkIcon = styled(FontAwesomeIcon).attrs((props: { color: string }) => props)`
  cursor: pointer;
  margin: 0 8px;
  color: ${(props) => props.color ?? props.theme.colors.text};
`;

const LINKS: { href: string; icon: IconDefinition; color?: string; label: string }[] = [
  {
    href: "https://www.github.com/lbragile/ColorMaster",
    icon: faGithub,
    color: undefined,
    label: "GitHub"
  },
  {
    href: "https://www.npmjs.com/package/colormaster",
    icon: faNpm,
    color: "red",
    label: "NPM"
  }
];

export default function SocialMedia(): JSX.Element {
  return (
    <span>
      {LINKS.map((link) => {
        return (
          <a key={link.href} href={link.href} aria-label={link.label} target="_blank" rel="noreferrer noopener">
            <LinkIcon key={link.href} icon={link.icon} color={link.color} size="2x" />
          </a>
        );
      })}
    </span>
  );
}
