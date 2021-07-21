import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import InfoPeticion from './InfoPeticion';
import SuperModal from './SuperModal';
//ver lo del nombre del tramite
const estadosOriginal = require('../../../../../back/enums/Tramite_1/enum.json').estadosTramite;
var estadosNuevo = {};
estadosOriginal.forEach(estado => {
    estadosNuevo[[estado.estadoTexto]] = estado.id;
})

export default class ModalStructure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
  }

  cambioEstadoClick(index, paramsToUpdate) {
    this.props.cambioEstadoClick(index, paramsToUpdate)
  }

  handleClose() {
    this.props.handleClose(null)
  }

  render() {
    let form;
    if (this.props.info) {
      form =
        <InfoPeticion
          peticion={this.props.peticion}
          handleClose={this.handleClose}
        >
        </InfoPeticion>
    }
    //TODO
    return (
      <Modal show={true} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Petición - {this.props.peticion.planNombre} ({this.props.peticion.planCodigo})
          </Modal.Title>
        </Modal.Header>
        {form}
      </Modal >
    );
  }
}