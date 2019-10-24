# Helix WSK Activation Viewer

View details of an activation:
- Activation details given by `wsk activation get`
- Activation logs given by `wsk activation logs`
- Coralogix logs for this activation

## Setup

Install client and server

```
cd client
npm install
cd ../server
npm install
touch .env
cd ..
```

Edit `server/.env` and add key `CORALOGIX_TOKEN=<your_token>`.

You also need a `~/.wskprop-<namespace>` per namespace you have access to which includes wsk `NAMESPACE`, `APIHOST` and `AUTH`.

## Run

Just run `npm start` in root folder: 
