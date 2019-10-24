import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import ActivationViewer from './ActivationViewer';
import DispatchTrace from './DispatchTrace';
import './App.css';



function App() {

  return (
    <Tabs defaultActiveKey="activation" id="uncontrolled-tab-example">
      <Tab eventKey="activation" title="View Activation">
        <ActivationViewer/>
      </Tab>
      <Tab eventKey="dispatch" title="Dispatch tracer">
        <DispatchTrace/>
      </Tab>
    </Tabs>
    
  );
}

export default App;
