import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
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
        this.state = {
            page: 1,
            sizePerPage: 50
        }
        this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
        this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
        this.handleTableChange = this.handleTableChange.bind(this);
    }
    cambioEstadoClick(index, paramsToUpdate) {
        this.props.cambioEstadoClick(this.props.selected, paramsToUpdate)
    }
    cambioSelectedClick(index, cancel, info) {
        this.props.cambioSelectedClick(index, cancel, info)
    }

    handleTableChange(type, { page, sizePerPage, filters }) {
        this.setState({
            page: page,
            sizePerPage: sizePerPage
        })
        const filters2 = {};

        setTimeout(() => {
            // Handle column filters
            for (const filter in filters) {
                filters2[filter] = filters[filter].filterVal;
            }
            //call the api
            this.props.findPeticiones(page, sizePerPage, filters2);
        }, 2000);
    }

    render() {
        const planSelect = {};
        this.props.plans.forEach((plan, index) => {
            planSelect[plan.id] = `${plan.nombre} (${plan.id})`
        })

        const estadoSelect = {};
        for (const estado in estadosNuevo) {
            estadoSelect[estado] = estado
        }

        let peticiones = this.props.peticiones.map((peticion, index) => {
            peticion.idTabla = index;
            peticion.estadoPeticionTexto = Object.keys(estadosNuevo).find(k => estadosNuevo[k] === peticion.estadoPeticion) || "NO_PEDIDO"
            peticion.accion = peticion.estadoPeticion
            peticion.accion2 = peticion.estadoPeticion

            return peticion
        })
        const columns = [{
            dataField: 'idTabla',
            text: 'idTabla',
            hidden: true
        },
        {
            dataField: 'nombre',
            text: 'Nombre',
            filter: textFilter(),
        },
        {
            dataField: 'apellido',
            text: 'Apellidos',
            filter: textFilter(),
        },
        {
            dataField: 'planNombre',
            text: 'Plan',
            filter: selectFilter({
                options: planSelect
            })
        },
        {
            dataField: 'planCodigo',
            text: 'Plan Código'
        },
        {
            dataField: 'estadoPeticionTexto',
            text: 'Estado petición',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                return (
                    <span>{row.estadoPeticionTexto}</span>
                )
            },
            filter: selectFilter({
                options: estadoSelect
            })

        },
        {
            dataField: 'fecha',
            text: 'Última Actualización'
        },
        {
            dataField: 'accion',
            text: 'Acción',
            formatter: (cellContent, row) => {
                //ACCION_PAS
            }

        },
        {
            dataField: 'accion2',
            text: 'Acción',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                //ACCION_2
            }

        },
        {
            dataField: '',
            text: 'Info',
            //formatter se usa para poder actualizar la tabla en el render
            formatter: (cellContent, row) => {
                return (<Button variant="secondary" onClick={() => this.cambioSelectedClick(row.idTabla, false, true)}><FontAwesomeIcon icon={faInfoCircle} /></Button>)
            }

        }
        ];
        let modal;
        if (this.props.selected !== null) {
            modal =
                <ModalStructure
                    peticion={this.props.peticiones[this.props.selected]}
                    handleClose={this.cambioSelectedClick}
                    cancel={this.props.cancel}
                    info={this.props.info}
                    cambioEstadoClick={this.cambioEstadoClick}
                >
                </ModalStructure>
        }
        return (
            <div>
                <BootstrapTable
                    remote={
                        { filter: true },
                        { pagination: true }
                    }
                    bootstrap4
                    wrapperClasses="table-responsive"
                    keyField="idTabla"
                    data={peticiones}
                    columns={columns}
                    defaultSorted={defaultSorted}
                    striped={true}
                    filter={filterFactory()}
                    pagination={paginationFactory({ page: this.state.page, sizePerPage: this.state.sizePerPage, totalSize: this.props.numberPeticiones })}
                    onTableChange={this.handleTableChange}
                />
                {modal}
            </div>
        );
    }
}

const defaultSorted = [{
    dataField: 'DNI',
    order: 'desc'
}];

