import React from "react";

import { Breadcrumb } from "semantic-ui-react";
import styled from "styled-components";

export const StyledBreadcrumbSection = styled(Breadcrumb.Section)`
  &&&& {
    cursor: not-allowed;
  }
`;

export default function BreadcrumbPath({ path }: { path: "Contrast" | "Statistics" }): JSX.Element {
  return (
    <Breadcrumb size="large">
      <StyledBreadcrumbSection link>Accessibility</StyledBreadcrumbSection>
      <Breadcrumb.Divider />
      <StyledBreadcrumbSection active>{path}</StyledBreadcrumbSection>
    </Breadcrumb>
  );
}
