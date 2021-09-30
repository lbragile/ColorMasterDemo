import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { faGithub, faNpm, IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { ThemeContext } from "styled-components";

const LinkIcon = styled(FontAwesomeIcon).attrs((props: { color: string }) => props)`
  cursor: pointer;
  margin: 0 8px;
`;

const LINKS: { href: string; icon: IconDefinition; color?: string; label: string }[] = [
  {
    href: "https://www.github.com/lbragile/ColorMaster",
    icon: faGithub,
    label: "GitHub"
  },
  {
    href: "https://www.npmjs.com/package/colormaster",
    icon: faNpm,
    label: "NPM"
  }
];

export default function SocialMedia(): JSX.Element {
  const themeContext = useContext(ThemeContext);

  return (
    <span>
      {LINKS.map((link) => {
        return (
          <a key={link.href} href={link.href} aria-label={link.label} target="_blank" rel="noreferrer noopener">
            <LinkIcon key={link.href} icon={link.icon} color={themeContext.text} size="2x" />
          </a>
        );
      })}
    </span>
  );
}
