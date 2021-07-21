import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default class FormPeticion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabledFile: "disabled"
    }
    this.fileDNI = React.createRef();
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    let params = {
      planCodigo: '09TT',
      planNombre: 'ING TELECO'
    }
    if (!this.fileDNI.current.files[0]) {
      alert("Debe adjuntar una copia de su DNI.")
    } else {
      params.file1 = this.fileDNI.current.files[0];
      if (confirm(`¿Está seguro que quiere pedir este trámite?`)) {
        this.props.cambioEstadoClick(null, params)
      }
    }
  }

  handleClose() {
    this.props.handleClose();
  }

  render() {
    return (
      <div>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group>
              <Form.Label as="legend">
                Adjunte una copia de su DNI escaneado por las dos caras:
                <br />
              </Form.Label>
              <input type="file" ref={this.fileDNI} />
              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">
                Solo pueden adjuntarse archivos con formato pdf y de tamaño máximo 1MB.
              </Tooltip>}>
                <span className="d-inline-block">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </span>
              </OverlayTrigger>
            </Form.Group>
          </Form >
        </Modal.Body>
        { <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>Cancelar</Button>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Enviar</Button>
        </Modal.Footer>}
      </div>
    );
  }
}