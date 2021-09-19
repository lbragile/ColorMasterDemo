import React, { useState } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import { Button, Modal } from "semantic-ui-react";

export default function CodeModal({ code }: { code: string }): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button circular primary>
          Code
        </Button>
      }
    >
      <Modal.Content>
        <Modal.Description>
          <CopyBlock text={code} language="typescript" theme={dracula} wrapLines={true} />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
}
