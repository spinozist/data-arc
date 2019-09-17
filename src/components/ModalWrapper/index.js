import React from 'react'
import { Modal } from 'semantic-ui-react';

const ModalWrapper = props => 
    <Modal
      open={props.open}
      dimmer='blurring'
      trigger={props.trigger}
      centered={props.centered}
    >
      <Modal.Header>{props.header}</Modal.Header>
      <Modal.Content>
          {props.content}
      </Modal.Content>
    </Modal>

export default ModalWrapper