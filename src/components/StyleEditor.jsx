import React, { createRef, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Dropdown from 'react-bootstrap/Dropdown';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FormControl from 'react-bootstrap/FormControl';
import parse from 'cytoscape/src/selector/parse';

import JsonEditor from './JsonEditor';
import { HIDDEN_SELECTORS, DEFAULT_SELECTORS, updateSelector } from '../assets/util';

let TYPE_OPTIONS = null;

const getTypeOptions = (name) => {
    if (TYPE_OPTIONS === null) {
        TYPE_OPTIONS = {};
        window.cy.style().properties.forEach(p => {
            TYPE_OPTIONS[p.name] = p.type
        });
    }
    return getSuggestions(TYPE_OPTIONS[name]);
}

const DEFAULT_COLORS = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'white',
    'black',
    'pink',
    'cyan',
    'magenta',
    [200, 20, 50, 120],
    '#0A0A4b'
]
const getSuggestions = (type) => {
    if (!type) {
        return []
    }
    if (type.enums) {
        return type.enums;
    }
    if (type.number) {
        return [0]
    }
    if (type.color) {
        return DEFAULT_COLORS;
    }
    return []
}

const autocompleteStyle = {
    filter: 'contain',
    trigger: 'focus',
    caseSensitive: false,
    getOptions: (text, path, input, editor) => {
        if (input === 'value') {
            const field = path[0];
            let options = new Set();
            // Add from default properties.
            let defaultValue = window.cy.style().getDefaultProperty(field);
            if (defaultValue !== undefined) {
                options.add(defaultValue.strValue);
                options.add(defaultValue.value);
            }
            // Add values from types list
            getTypeOptions(field).forEach(name => options.add(name))

            // Add values from other elements.
            window.cy.elements().forEach(ele => {
                options.add(ele.style(field));
            });
            return Array.from(options);
        } else if (input === 'field') {
            return window.cy.style().propertyNames;
        }
        return [];
    }
}

const addStyle = (selector, style) => {
    let warning = '';
    if (!parse.parse(selector)) {
        warning = `'${selector}' is not a valid selector.`;
    }
    if (!warning) {
        window.cy.style().appendFromJson([{ selector, style }]);
    }
    return warning;
}

const getStyle = (selector) => {
    const styles = window.cy.style().json().filter(s => s.selector === selector);
    if (styles.length > 0) {
        return styles[0].style;
    }
    return {};
}

const NewSelectorModal = ({ defaultValue, handleClose, show }) => {
    const selectorInput = createRef();
    const [feedback, setFeedback] = useState('');
    const existing = window.cy.style().json().map(s => s.selector);

    const onSubmit = (evt) => {
        evt.preventDefault();
        const name = selectorInput.current.value;
        if (existing.includes(name)) {
            setFeedback('Error: Style selector already exists.');
            return;
        }
        const style = getStyle(defaultValue);
        const err = addStyle(name, style);
        if (err) {
            setFeedback(`Error: ${err}`);
        } else {
            handleClose(evt, name);
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Stylesheet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form invalidated={feedback} onSubmit={onSubmit}>
                    <Form.Group autoFocus controlId="selector-input">
                        <Form.Label>Style selector</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl isInvalid={feedback !== ''} ref={selectorInput} defaultValue={defaultValue} placeholder="Selector name" />
                            <InputGroup.Append>
                                <Button type="submit">Create</Button>
                            </InputGroup.Append>
                            <Form.Control.Feedback type="invalid">
                                {feedback}
                            </Form.Control.Feedback>
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Examples: .className, node[height &lt; 100], and
                            <a target="_blank" rel="noopener noreferrer" href="https://js.cytoscape.org/#selectors">many more</a>
                        </Form.Text>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>);
}

export default class StyleEditor extends React.Component {

    constructor(props) {
        super(props);
        this.editor = createRef();
        this.state = {
            selector: "node",
            newSelectorModal: null
        };
        window.editor = this.editor;
        this.errors = []
    }

    componentDidMount = () => {
        this.setSelector(this.state.selector);
    }

    setSelector = (selector) => {
        const style = getStyle(selector);
        this.editor.current.jsonEditor.set(style);
        this.setState({ selector });
    }

    handleDropdownAction = (event) => {
        const {
            selector
        } = this.state;
        let action = event;
        if (event.target) {
            action = event.target.value;
        }
        let newSelectorModal = {}
        if (action === 'add') {
            newSelectorModal['show'] = true;
        } else if (action === 'copy') {
            newSelectorModal['show'] = true;
            newSelectorModal['defaultValue'] = selector;
        } else if (action === 'delete') {
            const styles = window.cy.style().json().filter(s => s.selector !== selector);
            window.cy.style().fromJson(styles).update();
            this.setState({ selector: 'node' });
        }
        this.setState({ newSelectorModal })
    }

    styleChanged = (event) => {
        this.setSelector(event.target.value);
    }

    onChange = (newStyle) => {
        const {
            selector
        } = this.state;
        if (this.errors.length === 0) {
            updateSelector(selector, newStyle).update();
        }
    }

    onValidate = (json) => {
        var errors = [];

        Object.keys(json).forEach(k => {
            const v = window.cy.style().parse(k, json[k]);
            if (!v) {
                errors.push({ path: [k], 'message': 'Invalid property.' });
            }
        });
        this.errors = errors;
        return errors;
    }

    handleModalClose = (evt, name) => {
        const style = getStyle(name);
        this.editor.current.jsonEditor.set(style);
        this.setState({
            selector: name,
            newSelectorModal: null
        })
    }

    render() {
        const {
            selector,
            newSelectorModal
        } = this.state;

        const selectors = window.cy.style().json()
            .filter(s => !HIDDEN_SELECTORS.includes(s.selector));

        return (
            <ListGroup style={{ height: "100%" }}>
                <NewSelectorModal
                    handleClose={this.handleModalClose}
                    {...newSelectorModal}
                />
                <ListGroupItem>
                    <InputGroup>
                        <Form.Control
                            id="style-dropdown"
                            as="select"
                            placeholder="Style"
                            value={selector}
                            onChange={this.styleChanged}>
                            {selectors.map((s, i) => {
                                return (
                                    <option
                                        key={i}
                                        value={s.selector}>
                                        {s.selector}
                                    </option>);
                            })}
                        </Form.Control>
                        <Dropdown as={InputGroup.Append} onSelect={this.handleDropdownAction}>
                            <Button onClick={e => this.handleDropdownAction('add')}>Add</Button>
                            <Dropdown.Toggle split />
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="copy">Copy</Dropdown.Item>
                                <Dropdown.Item disabled={DEFAULT_SELECTORS.includes(selector)} eventKey="delete">Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </InputGroup>
                </ListGroupItem>
                <ListGroupItem style={{ height: "100%" }}>
                    <JsonEditor
                        ref={this.editor}
                        onValidate={this.onValidate}
                        onChange={this.onChange}
                        autocomplete={autocompleteStyle}
                    />
                </ListGroupItem>
            </ListGroup>
        )
    }
}
