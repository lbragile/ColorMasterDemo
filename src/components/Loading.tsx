import React from "react";
import { Dimmer, Loader, Segment } from "semantic-ui-react";

export default function Loading(): JSX.Element {
  return (
    <Segment>
      <Dimmer active inverted>
        <Loader size="massive">Loading...</Loader>
      </Dimmer>
    </Segment>
  );
}
