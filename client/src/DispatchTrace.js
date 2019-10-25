import React from "react";
import url from "url";
import JSONTree from 'react-json-tree'

import { Container, Row, Col, Table } from 'react-bootstrap';

import './DispatchTrace.css';

class DispatchTrace extends React.Component {
    state = {
        url: 'https://helix-sections-playground-kptdobe.hlx.page/header.html',
        host: 'helix-sections-playground-kptdobe.hlx.page',
        path: '/header.html',
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
                    const id = json.hits.hits[0]._source.ow.activationId;
                    fetch(`/coralogix/${id}`)
                        .then(response => response.json())
                        .then(json => {
                            if (json.hits) {
                                this.setState({ coralogix: json.hits.hits })
                            }

                            if (json.error) {
                                this.setState({ coralogix: [ json.error ] });
                            }
                        });
                }

                if (json.error) {
                    this.setState({ coralogix: [ json.error ] });
                }
            });
    };

    render() {
        let coralogix = this.state.coralogix.map((c, i) => 
            <tr>
                <td>{c._source.timestamp}</td>
                <td>{c._source.level}</td>
                <td>{c._source.ow.activationId}</td>
                <td>{c._source.ow.actionName}</td>
                <td>{c._source.message}</td>
                <td><JSONTree data={c._source} shouldExpandNode={() => false} /></td>
            </tr>
        );
        coralogix = coralogix && coralogix.length > 0 ? coralogix : 'No Logs';

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
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Level</th>
                                    <th>Activation Id</th>
                                    <th>Action Name</th>
                                    <th>Message</th>
                                    <th width="30%">Details</th>
                                </tr>
                            </thead>
                            <tbody>{coralogix}</tbody>
                            </Table>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default DispatchTrace;