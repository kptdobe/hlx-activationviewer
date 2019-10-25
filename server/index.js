// require('dotenv').config()
const fs = require('fs');
const resolve = require('resolve-dir');
const dotenv = require('dotenv');
dotenv.config();
const request = require('request-promise');

const getOW = (namespace) => {
    const wskProps = dotenv.parse(fs.readFileSync(resolve(`~/.wskprops-${namespace}`)));

    return ow = require('openwhisk')({
        apihost: wskProps.APIHOST, 
        api_key: wskProps.AUTH, 
        namespace: wskProps.NAMESPACE });
}

const express = require('express');

const app = express();

app.get('/*',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/activations/:namespace/:id', async (request, response) => {
    const id = request.params.id;
    const namespace = request.params.namespace;
    try {
        const ow = getOW(namespace);
        const ac = await ow.activations.get({ name: id });
        response.send(ac);
    } catch(error) {
        response.send({
            error: error.message
        });
    }
});

app.get('/logs/:namespace/:id', async (request, response) => {
    const id = request.params.id;
    const namespace = request.params.namespace;
    try {
        const ow = getOW(namespace);
        const ac = await ow.activations.logs({ name: id });
        response.send(ac);
    } catch(error) {
        response.send({
            error: error.message
        });
    }
});

app.get('/coralogix/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        
        const coralogix = await request({
            method: 'POST',
            uri: 'https://coralogix-esapi.coralogix.com:9443/*/_search',
            headers: {
                'Content-type': 'application/json',
                'token': process.env.CORALOGIX_TOKEN
            },
            body: {
                "size": 10,
                "query": {
                    "bool": {
                        "must": [{
                            "term": {
                                "ow.activationId": id
                            }
                        }]
                    }
                },
                "sort": [
                    { "timestamp.keyword": "desc" }
                ]
            },
            json: true
        });
        res.send(coralogix);
    } catch(error) {
        res.send({
            error: error.message
        });
    }
});

app.get('/dispatchTrace', async (req, res) => {
    const path = req.query.path;
    const host = req.query.host;
    
    try {
        const coralogix = await request({
            method: 'POST',
            uri: 'https://coralogix-esapi.coralogix.com:9443/*/_search',
            headers: {
                'Content-type': 'application/json',
                'token': process.env.CORALOGIX_TOKEN
            },
            body: {
                "size": 10,
                "query": {
                    "bool": {
                        "filter":
                        [
                            {
                                "query_string": {
                                    "query": `actionOptions.params.__ow_headers.x-old-url:\"${path}\" AND actionOptions.params.__ow_headers.x-forwarded-host:\"${host}\"`
                                }
                            },
                            {
                                "range": {
                                    "coralogix.timestamp": {
                                        "gte": "now-24h",
                                        "lt": "now"
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            json: true
        });
        res.send(coralogix);
    } catch(error) {
        res.send({
            error: error.message
        });
    }
});

app.listen(5000);