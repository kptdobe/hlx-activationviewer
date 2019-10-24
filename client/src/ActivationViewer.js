import React from "react";
import JSONTree from 'react-json-tree'

import { Container, Row, Col } from 'react-bootstrap';

import './ActivationViewer.css';

class ActivationViewer extends React.Component {
    state = {
        namespace: 'helix-pages',
        id: '45fd60cb80584385bd60cb80580385af',
        // namespace: 'helix',
        // id: '81260509d0aa4c2ca60509d0aa0c2c45',
        activation: {},
        logs: [],
        coralogix: [],
    };

    handleIdChange = e => {
        this.setState({ id: e.target.value });
    }
    
    handleNamespaceChange = e => {
        this.setState({ namespace: e.target.value });
    }
    
    handleSearch = async e => {
        fetch(`/activations/${this.state.namespace}/${this.state.id}`)
            .then(response => response.json())
            .then(json => this.setState({ activation: json }));

        fetch(`/logs/${this.state.namespace}/${this.state.id}`)
            .then(response => response.json())
            .then(json => {
                if (json.logs) {
                    this.setState({ logs: json.logs });
                }

                if (json.error) {
                    this.setState({ logs: [ json.error ] });
                }
            });

        fetch(`/coralogix/${this.state.id}`)
            .then(response => response.json())
            .then(json => {
                if (json.hits) {
                    this.setState({ coralogix: json.hits.hits })
                }

                if (json.error) {
                    this.setState({ coralogix: [ json.error ] });
                }
            });
    };

    render() {
        let logs = this.state.logs.map((log, i) =>
            <li key={i}>{log}</li>
        );
        logs = logs && logs.length > 0 ? logs : 'No logs';

        let coralogix = this.state.coralogix.map((c, i) =>
            <li key={i}><JSONTree data={c} shouldExpandNode={() => true} /></li>
        );
        coralogix = coralogix && coralogix.length > 0 ? coralogix : 'No data in Coralogix';

        return (
            <Container id="ActivationViewer" fluid="true">
                <Row>
                    <Col>
                        <div className="search">
                            <input
                                type="text"
                                value={this.state.namespace}
                                onChange={this.handleNamespaceChange}/>
                            <input
                                type="text"
                                value={this.state.id}
                                onChange={this.handleIdChange}/>
                            <input
                                type="button"
                                value="Search"
                                onClick={this.handleSearch}/>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1>Activation details</h1>
                        <JSONTree data={this.state.activation} shouldExpandNode={() => true} />
                    </Col>
                    <Col>
                        <h1>Activation logs</h1>
                        <ul>{logs}</ul>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1>Coralogix</h1>
                        <ul>{coralogix}</ul>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default ActivationViewer;