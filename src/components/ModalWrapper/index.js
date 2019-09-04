import React from 'react'
import { Modal } from 'semantic-ui-react'

const ModalModalExample = props => (
  <Modal dimmer='blurring' trigger={props.trigger}>
    <Modal.Header>{props.header}</Modal.Header>
    <Modal.Content>
        {props.content}
    </Modal.Content>
  </Modal>
)

export default ModalModalExample