import React from "react";
import url from "url";
import JSONTree from 'react-json-tree'

import { Container, Row, Col } from 'react-bootstrap';

import './DispatchTrace.css';

class DispatchTrace extends React.Component {
    state = {
        url: 'https://alex.helix-demo.xyz/favicon.ico',
        host: 'alex.helix-demo.xyz',
        path: '/favicon.ico',
        coralogix: [],
    };

    handleUrlChange = e => {
        const u = url.parse(e.target.value);
        this.setState({ 
            url: e.target.value,
            host: u.host,
            path: u.path
        });
    }
   
    handleSearch = async e => {
        fetch(`/dispatchTrace?host=${this.state.host}&path=${this.state.path}`)
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
        let coralogix = this.state.coralogix.map((c, i) =>
            <li key={i}><JSONTree data={c} shouldExpandNode={() => true} /></li>
        );
        coralogix = coralogix && coralogix.length > 0 ? coralogix : 'No data in Coralogix';

        return (
            <Container id="DispatchTrace" fluid="true">
                <Row>
                    <Col>
                        <div className="search">
                            <input
                                type="text"
                                value={this.state.url}
                                onChange={this.handleUrlChange}/>
                            <input
                                type="button"
                                value="Search"
                                onClick={this.handleSearch}/>
                        </div>
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

export default DispatchTrace;