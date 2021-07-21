
import React from 'react';


export default class NoPermiso extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div>
                <p><b>Usted no tiene permiso para gestionar este trámite.</b></p>
                <p>Si cree que debería tener permiso, contacte con la persona encargada de secretaría.</p>
            </div>
        );
    }
} 