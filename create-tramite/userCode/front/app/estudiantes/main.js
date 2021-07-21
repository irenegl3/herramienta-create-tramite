import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
//IMPORT BOOTSTRAP//
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
//IMPORT REACT-BOOTSTRAP-TABLE//
import '../../node_modules/react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
let App = require('../components');
const tramite = process.env.TRAMITE || 'gestionTitulos';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(App[tramite].estudiantes);

if (module.hot) {
  module.hot.accept(App[tramite].estudiantes, () => {
    const newApp = require(App[tramite].estudiantes).default;
    render(newApp);
  });
}
