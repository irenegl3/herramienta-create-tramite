import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
//const descuento = require('../../../../../back/enums').descuento

export default class FormInfoPago extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleSubmit(event) {
    event.preventDefault();
    let paramsToUpdate = {}
    this.props.cambioEstadoClick(paramsToUpdate)
  }

  render() {
    let textDescuento = <p>El alumno no ha marcado ningún tipo de descuento por lo que no tiene que comprobar que haya adjuntado el justificante.</p>
    if (this.props.peticion.descuento == descuento.FAMILIA_NUMEROSA_GENERAL){
      textDescuento =<p>El alumno ha marcado descuento de <b>FAMILIA NUMEROSA GENERAL</b>. Debe verificar en el correo que ha adjuntado la información necesaria.</p>
    }
    if (this.props.peticion.descuento == descuento.FAMILIA_NUMEROSA_ESPECIAL){
      textDescuento = <p>El alumno ha marcado descuento de <b>FAMILA NUMEROSA ESPECIAL</b>. Debe verificar en el correo que ha adjuntado la información necesaria.</p>
    }
    return (
      <div>
        <Modal.Body>
          Debe verificar que la carta de pago para {this.props.peticion.nombre} {this.props.peticion.apellido} ({this.props.peticion.irispersonaluniqueid}) ha sido generada en politécnica virtual para el plan {this.props.peticion.planNombre} ({this.props.peticion.planCodigo}).
          <br/>
          {textDescuento}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>Cancelar</Button>
          <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Confirmar</Button>
        </Modal.Footer>
      </div>
    );
  }
}