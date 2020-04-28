import React, { createRef, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Dropdown from 'react-bootstrap/Dropdown';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FormControl from 'react-bootstrap/FormControl';

import JsonEditor from './JsonEditor';
import { LAYOUTS, DEFAULT_LAYOUTS } from '../assets/defaults';


const NewLayoutModal = ({ defaultValue, handleClose, show }) => {
    const layoutInput = createRef();
    const [feedback, setFeedback] = useState('');

    const onSubmit = (evt) => {
        evt.preventDefault();
        const name = layoutInput.current.value;
        if (Object.keys(LAYOUTS).includes(name)) {
            setFeedback('Error: Layout name already exists.');
            return;
        }
        LAYOUTS[name] = LAYOUTS[defaultValue] || {name: 'grid'};
        handleClose(evt, name);
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Layout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form invalidated={feedback} onSubmit={onSubmit}>
                    <Form.Group autoFocus controlId="selector-input">
                        <Form.Label>Layout name</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl isInvalid={feedback !== ''} ref={layoutInput} defaultValue={defaultValue} placeholder="Layout name" />
                            <InputGroup.Append>
                                <Button type="submit">Create</Button>
                            </InputGroup.Append>
                            <Form.Control.Feedback type="invalid">
                                {feedback}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>);
}

export default class LayoutEditor extends React.Component {

    constructor(props) {
        super(props);
        this.editor = createRef();
        this.state = {
            layout: "Grid",
            newLayoutModal: null
        };
        window.editor = this.editor;
        this.errors = [];
    }

    componentDidMount = () => {
        this.setLayout(this.state.layout);
    }

    setLayout = (layout) => {
        const params = LAYOUTS[layout];
        this.editor.current.jsonEditor.set(params);
        this.setState({ layout });
    }

    handleDropdownAction = (event) => {
        let action = event;
        if (event.target) {
            action = event.target.value;
        }
        let newLayoutModal = {}
        if (action === 'add') {
            newLayoutModal['show'] = true;
        } else if (action === 'copy') {
            newLayoutModal['show'] = true;
            newLayoutModal['defaultValue'] = this.state.layout;
        } else if (action === 'delete') {
            this.setState({ layout: 'grid' });
        }
        this.setState({ newLayoutModal })
    }

    layoutChanged = (event) => {
        this.setLayout(event.target.value);
    }

    onChange = (newLayout) => {
        const {
            layout
        } = this.state;
        LAYOUTS[layout] = newLayout;
    }

    handleModalClose = (evt, name) => {
        const params = LAYOUTS[name];
        this.editor.current.jsonEditor.set(params);
        this.setState({
            layout: name,
            newLayoutModal: null
        })
    }

    apply = () => {
        const {
            layout
        } = this.state;
        const params = LAYOUTS[layout];
        let runner = window.cy.layout(params);
        runner.run();
    }

    onEditable = (node) => {
        const {
            layout
        } = this.state;
        if (DEFAULT_LAYOUTS.includes(layout)){
            return node['field'] !== 'name';
        }
        return true;
    }

    render() {
        const {
            layout,
            newLayoutModal
        } = this.state;

        return (
            <ListGroup style={{ height: "100%" }}>
                <NewLayoutModal
                    handleClose={this.handleModalClose}
                    {...newLayoutModal}
                />
                <ListGroupItem>
                    <InputGroup>
                        <Form.Control
                            id="layout-dropdown"
                            as="select"
                            placeholder="Layout"
                            value={layout}
                            onChange={this.layoutChanged}>
                            {Object.keys(LAYOUTS).map(s => {
                                return (
                                    <option
                                        key={s}
                                        value={s}>
                                        {s}
                                    </option>);
                            })}
                        </Form.Control>
                        <Dropdown as={InputGroup.Append} onSelect={this.handleDropdownAction}>
                            <Button onClick={e => this.handleDropdownAction('add')}>Add</Button>
                            <Dropdown.Toggle split />
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="copy">Copy</Dropdown.Item>
                                <Dropdown.Item disabled={DEFAULT_LAYOUTS.includes(layout)} eventKey="delete">Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </InputGroup>
                </ListGroupItem>
                <ListGroupItem style={{ height: "100%" }}>
                    <JsonEditor
                        ref={this.editor}
                        onEditable={this.onEditable}
                        onChange={this.onChange}
                    />
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-end">
                    <Button onClick={this.apply}>Apply</Button>
                </ListGroupItem>
            </ListGroup>
        )
    }
}
