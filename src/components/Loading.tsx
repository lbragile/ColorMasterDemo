import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

export default function Loading(): JSX.Element {
  return (
    <Dimmer active inverted inline="centered">
      <Loader size="massive">Loading...</Loader>
    </Dimmer>
  );
}
