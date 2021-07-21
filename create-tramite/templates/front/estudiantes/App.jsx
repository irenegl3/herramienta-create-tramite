import React from 'react';
import axios from 'axios';
import Tramite from './Tramite';
import SuperModal from './SuperModal';
import LoadingOverlay from 'react-loading-overlay';
import {Alert, Button, Modal} from 'react-bootstrap';
import '../../../../assets/scss/main.scss';
const tramites = require('../../../../../back/enums').tramites;
let urljoin = require('url-join');
const service = process.env.SERVICE || 'http://localhost:3000';
// cambiar el como consigo el nombre del tramite
const apiBaseUrl = process.env.NODE_ENV === "development" ? urljoin(service,"/estudiantes/gestion-tramites", nombreTramite) : window.location.href


export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      peticiones: [],
      selected: null,
      info: null,
      loading: null,
      showForm: false
    };
    this.cambioEstadoClick = this.cambioEstadoClick.bind(this);
    this.cambioSelectedClick = this.cambioSelectedClick.bind(this);
    this.solicitarTramite = this.solicitarTramite.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.setState({
      loading: true
    })
    axios.get(urljoin(apiBaseUrl, "api/getPeticiones"))
      .then((response) => {
        this.setState({
          peticiones: response.data,
          loading: null
        })
      })
      .catch((error) => {
        this.setState({
          loading: null
        })
        alert(`Error en la conexión con el servidor. ${error.response && error.response.data ?
           error.response.data.error || '': ''}`)
      })
  }

  cambioEstadoClick(index, params) {
    let peticionesNuevas = this.state.peticiones.slice()
    let formData = new FormData();
    if (params.file) {
      formData.append("file", params.file);
    }
    this.setState({
      loading: true,
      selected: null,
      showForm: false
    })
    let apiPath = index === null ? "api/createPeticion" : "api/updatePeticion";
    formData.append("body", JSON.stringify({ peticion: peticionesNuevas[index], params: params }))
    axios.post(urljoin(apiBaseUrl, apiPath), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        if (index === null) {
          peticionesNuevas.push(response.data);
        } else {
         peticionesNuevas[index].estadoPeticion = response.data[1][0].estadoPeticion
          peticionesNuevas[index].fecha = response.data[1][0].fecha
          peticionesNuevas[index].textCancel = response.data[1][0].textCancel
        }
        this.setState({
          peticiones: peticionesNuevas,
          selected: null,
          info: null,
          loading: null,
          plansCargado: true,
          showForm: false
        })
      })
      .catch((error) => {
        this.setState({
          loading: null
        })
        alert(`Error en la conexión con el servidor. ${error.response && error.response.data ?
          error.response.data.error || '': ''}`)
      })
  }

  cambioSelectedClick(index, info) {
    this.setState({
      selected: index,
      info: info
    })
  }

  solicitarTramite() {
    this.setState({
      showForm: true
    })
  }

  handleClose() {
    this.setState({
      showForm: false,
      selected: null,
      info: null
    })
  }

  render() {
    return (
      <div>
        <div className="cuerpo">
          <h2>Sus peticiones</h2>
          <p><b>Se le enviarán notificaciones a través de su correo @alumnos.upm.es</b></p>

          <LoadingOverlay
            active={this.state.loading}
            spinner
            text='Cargando'
          >
          <Button
              size="lg"
              style={{ marginBottom: "15px" }}
              onClick={() => this.solicitarTramite()}
            >Solicitar trámite</Button>
            {this.state.showForm &&
              <Modal show={true} onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    Solicitud de trámite
                  </Modal.Title>
                </Modal.Header>
                <SuperModal
                  handleClose={this.handleClose}
                  cambioEstadoClick={this.cambioEstadoClick}
                  descripcion={'Usted va a realizar una solicitud del trámite actual'}
                />
              </Modal >
            }
            <Tramite
              selected={this.state.selected}
              info={this.state.info}
              peticiones={this.state.peticiones}
              cambioEstadoClick={this.cambioEstadoClick}
              cambioSelectedClick={this.cambioSelectedClick}
            >
            </Tramite>
          </LoadingOverlay>
        </div>
      </div>

    );
  }

}
