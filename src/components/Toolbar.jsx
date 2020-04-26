import React, {useState} from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import FileModal from './FileModal'; 

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
            </Nav>
            <Form inline onSubmit={search}>
                <FormControl type="text" id='query' placeholder="Search" className="mr-sm-2" />
            </Form>
        </Navbar>
        </>
    );
}

export default Toolbar;