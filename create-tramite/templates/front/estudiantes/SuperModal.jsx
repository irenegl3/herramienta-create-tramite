import React from 'react';
import { Modal, Button, ModalTitle } from 'react-bootstrap';

export default class SuperModal extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        let params = {}
        if (confirm(`¿Está seguro?`)) {
            this.props.cambioEstadoClick(null, params)
        }
    }

    handleClose() {
        this.props.handleClose();
    }

    render() {
        return (
            <div>
                <Modal.Body>
                    <b>{this.props.descripcion}</b>
                </Modal.Body>
                { <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>Cancelar</Button>
                    <Button className="d-inline" type="submit" onClick={this.handleSubmit}>Confirmar</Button>
                </Modal.Footer>}
            </div>
        );
    }
}