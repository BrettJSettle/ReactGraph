import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';

import { downloadFile } from '../assets/util';

class FileImporter extends React.Component {
    state = {
        invalid: false,
        feedback: ''
    };

    fileSelected = (evt) => {
        const files = evt.target.files;
        if (files.length !== 1) {
            return false;
        }
        const file = files[0];
        console.log(file.name);
        let data = {};
        try {
            data = JSON.parse(file.content);
        } catch {
            this.setState({
                invalid: true,
                feedback: `Unable to parse ${file.name} as JSON.`
            });
            return;
        }
        let type = 'elements';
        if (Array.isArray(data)){
            if ('selector' in data[0]){
                type = 'style';
            }
        }else{
            if ('selector' in data){
                type = 'style';
            }
        }

        this.setState({
            invalid: false,
            feedback: `Loaded ${file.name} as ${type}`
        });
    }

    handleLoad = (evt) => {
        evt.preventDefault();
        const form = evt.target.form;
        window.f = form;
        console.log(form);
    }

    render() {
        const {
            invalid,
            feedback
        } = this.state;
        return (
            <Form onSubmit={this.handleLoad}>
                <Form.Group>
                    <Form.File id="formcheck-api-custom" custom>
                        <Form.File.Input
                            isValid={feedback && !invalid}
                            isInvalid={invalid}
                            onChange={this.fileSelected} />
                        <Form.File.Label>
                            Import Graph/Style JSON
                </Form.File.Label>
                        {feedback &&
                            <Form.Control.Feedback type={invalid ? "invalid" : "valid"}>
                                {feedback}
                            </Form.Control.Feedback>}

                    </Form.File>
                </Form.Group>
                <Button className="float-right" disabled={invalid || !feedback} type="submit">Load</Button>
            </Form>
        )
    }
}

class FileExporter extends React.Component {
    state = {
        type: 'elements',
    };

    setType = (type) => {
        this.setState({type});
    }
    setStyle = (style) => {
        this.setState({style});
    }

    save = (evt) => {
        evt.preventDefault();
        const {
            type,
        } = this.state;
        let data = {};
        if (type === 'elements'){
            data = window.cy.elements().json();
        }else if (type === 'style'){
            data = window.cy.style().json();
        }
        downloadFile(data, type);
    }

    handleTypeChange = (evt) => {
        const type = evt.target.value;
        this.setState({type});
    }

    render(){
        return (
            <Form onSubmit={this.save}>
                <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Export data</Form.Label>
                    <Form.Control as="select" name="type" onChange={this.handleTypeChange}>
                        <option value="elements">Elements</option>
                        <option value="style">Style</option>
                    </Form.Control>
                </Form.Group>
                {/* {type === 'style' &&
                    <Form.Group>
                        <Form.Label>Style(s)</Form.Label>
                        <Form.Control as="select" multiple name="style" defaultValue="all">
                            <option value="all">All styles</option>
                            {window.cy.style().json().map((s, i) => (
                                <option key={i} value={s.selector}>{s.selector}</option>
                            ))}
                        </Form.Control></Form.Group>} */}

                <Button className='float-right' type="submit">
                    Export
                </Button>
            </Form>
        )
    }
}

const FileModal = ({ handleClose }) => {
    return (
        <Modal show={true} onHide={handleClose} as={Card}>
            <Modal.Header as='h4' closeButton>
                <Modal.Title>Import/Export Graphs and Styles</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <FileImporter />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FileExporter />
                    </ListGroup.Item>
                </ListGroup>
            </Modal.Body>

        </Modal>
    )
}

export default FileModal;