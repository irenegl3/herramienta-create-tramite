import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default class FormCancel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { textCancel: "" }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeTextCancel = this.handleChangeTextCancel.bind(this);
    }

    handleChangeTextCancel(e) {
        this.setState({ textCancel: e.currentTarget.value })
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.textCancel.trim() == "") {
            alert("Debe indicar el motivo por el que se cancela la petición");
        } else {
            let paramsToUpdate = {
                textCancel : this.state.textCancel.trim()
            }
            this.props.cambioEstadoClick(null, paramsToUpdate)
        }
    }
    render() {
        return (
            <div>
                <Modal.Body>
                    Va a cancelar la petición del trámite solicitado por el alumno. Se le notificará al email de contacto del alumno.
                    <br />
                    <br />
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Indique el motivo de la cancelación:</Form.Label>
                            <Form.Control onChange={this.handleChangeTextCancel} as="textarea" rows="3" />
                        </Form.Group>
                    </Form >
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.handleClose}>Cancelar</Button>
                    <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Confirmar</Button>
                </Modal.Footer>
            </div>
        );
    }
}
