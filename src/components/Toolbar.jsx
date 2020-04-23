import React, {useState} from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import FileModal from './FileModal'; 
import {LAYOUTS, LAYOUT_PARAMS} from '../assets/defaults';

const LayoutDropdown = () => {

    const edit = () => {
        alert('Not supported yet');
    }

    const apply = (layout) => {
        const params = layout.defaults;
        if (layout.name in LAYOUT_PARAMS){
            params.update(LAYOUT_PARAMS[layout.name]);
        }
        let runner = window.cy.layout(params);
        runner.run();
    }

    return (
        <DropdownButton
          title="Layout"
          variant="toolbar-button"
          as={ButtonGroup}>
            {LAYOUTS.map((layout, i) => 
                <Dropdown.Item key={i} value={layout} onClick={apply.bind(null, layout)}>{layout.name}</Dropdown.Item>
            )}
            <Dropdown.Divider />
            <Dropdown.Item onClick={edit}>Edit layouts</Dropdown.Item>
        </DropdownButton>
    )
}

const search = (event) => {
    event.preventDefault();
    const query = document.getElementById('query');
    window.cy.startBatch();
    window.cy.elements().deselect();
    window.cy.$(query.value).select()
    window.cy.fit();
    window.cy.endBatch();
}

const Toolbar = () => {
    const [fileModalVisible, setFileModalVisible] = useState(false);
    const toggleFileModal = () => {
        setFileModalVisible(!fileModalVisible);
    }
    
    return (
        <>
        {fileModalVisible && <FileModal handleClose={toggleFileModal}/>}
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Graphing</Navbar.Brand>
            <Nav className="mr-auto" as={ButtonGroup}>
                <Button variant='toolbar-button' onClick={toggleFileModal}>File</Button>
                <Button variant='toolbar-button' onClick={() => window.cy.fit()}>Fit</Button>
                <LayoutDropdown />
            </Nav>
            <Form inline onSubmit={search}>
                <FormControl type="text" id='query' placeholder="Search" className="mr-sm-2" />
                {/* <Button id='search' type='submit' variant="outline-info">Search</Button> */}
            </Form>
        </Navbar>
        </>
    );
}

export default Toolbar;