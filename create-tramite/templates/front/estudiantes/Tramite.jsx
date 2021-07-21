
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ModalStructure from './ModalStructure';
const estadosOriginal = require('../../../../../back/enums/Tramite_1/enum.json').estadosTramite;

var estadosNuevo = {};
estadosOriginal.forEach(estado => {
    estadosNuevo[[estado.estadoTexto]] = estado.id;
})

export default class Tramite extends React.Component {
    constructor(props) {
        super(props)
        this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
        this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
    }
    cambioEstadoClick(index, paramsToUpdate) {
        this.props.cambioEstadoClick(this.props.selected, paramsToUpdate)
    }
    cambioSelectedClick(index, info) {
        this.props.cambioSelectedClick(index, info)
    }
    render() {
        let peticiones = this.props.peticiones.map((peticion, index) => {
            peticion.idTabla = index;
            peticion.estadoPeticionTexto = Object.keys(estadosNuevo).find(k => estadosNuevo[k] === peticion.estadoPeticion) || "NO_PEDIDO"
            peticion.accion = peticion.estadoPeticionTexto
            return peticion
        })
        const columns = [{
            dataField: 'idTabla',
            text: 'idTabla',
            hidden: true
        },
        {
            dataField: 'planCodigo',
            text: 'Plan'
        },
        {
            dataField: 'planNombre',
            text: 'Plan'
        },
        {
            dataField: 'estadoPeticionTexto',
            text: 'Estado petición',
            formatter: (cellContent, row) => {
                return (
                    <span>{row.estadoPeticionTexto}</span>
                )
            }
        },
        {
            dataField: 'fecha',
            text: 'Última Actualización'
        },
        {
            dataField: 'accion',
            text: 'Acción',
            formatter: (cellContent, row) => {
                //ACCION_ESTUDIANTES
            }
        },
        {
            dataField: '',
            text: 'Info',
            formatter: (cellContent, row) => {
                return (<Button variant="secondary" onClick={() => this.cambioSelectedClick(row.idTabla, true)}><FontAwesomeIcon icon={faInfoCircle} /></Button>)
            }

        }
        ];
        let modal;
        if (this.props.selected !== null) {
            modal =
                <ModalStructure
                    peticion={this.props.peticiones[this.props.selected]}
                    handleClose={this.cambioSelectedClick}
                    info={this.props.info}
                    cambioEstadoClick={this.cambioEstadoClick}
                >
                </ModalStructure>
        }
        return (
            <div>
                <BootstrapTable
                    bootstrap4
                    wrapperClasses="table-responsive"
                    keyField="idTabla"
                    data={peticiones}
                    columns={columns}
                    defaultSorted={defaultSorted}
                    striped={true}
                />
                {modal}


            </div>

        );

    }
}


const defaultSorted = [{
    dataField: 'index',
    order: 'desc'
}];

