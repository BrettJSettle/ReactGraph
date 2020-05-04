import React, {useState} from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import FileModal from './FileModal';

import {fit, G} from '../assets/util';

const search = (event) => {
    event.preventDefault();
    const query = document.getElementById('query');
    window.cy.startBatch();
    window.cy.elements().deselect();
    window.cy.$(query.value).select()
    fit(G(':selected'));
    window.cy.endBatch();
}

const editOptionSelected = (evt) => {
    console.log(evt);
    if (evt === 'undo'){
        window.ur.undo();
    }else if (evt === 'redo'){
        window.ur.redo();
    } else if (evt === 'copy') {
        window.cb.copy(G(':selected'));
    } else if (evt === 'paste') {
        window.ur.do('paste');
    } else if (evt === 'delete') {
        window.ur.do('delete', G(':selected'));
    }
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
            <Navbar.Brand href='https://github.com/brettjsettle/ReactGraph'>CyGround</Navbar.Brand>
            <Nav className="mr-auto" as={ButtonGroup}>
                <Button variant='toolbar-button' onClick={toggleFileModal}>File</Button>
                <DropdownButton title="Edit" variant='toolbar-button' id="edit-dropdown" as={ButtonGroup} onSelect={editOptionSelected}>
                    <Dropdown.Item active={false} eventKey='undo'>Undo</Dropdown.Item>
                    <Dropdown.Item active={false} eventKey='redo'>Redo</Dropdown.Item>
                    <Dropdown.Item active={false} eventKey='copy'>Copy</Dropdown.Item>
                    <Dropdown.Item active={false} eventKey='paste'>Paste</Dropdown.Item>
                    <Dropdown.Item active={false} eventKey='delete'>Delete</Dropdown.Item>
                </DropdownButton>
                <DropdownButton title="Fit" id="fit-dropdown" variant='toolbar-button' as={ButtonGroup}>
                    <Dropdown.Item active={false} onClick={fit}>Fit All</Dropdown.Item>
                    <Dropdown.Item active={false} onClick={() => fit(G(':selected'))}>Fit Selected</Dropdown.Item>
                </DropdownButton>
            </Nav>
            <Form inline onSubmit={search}>
                <FormControl type="text" id='query' placeholder="Search" className="mr-sm-2" />
            </Form>
        </Navbar>
        </>
    );
}

export default Toolbar;