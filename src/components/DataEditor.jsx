import React, {createRef} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { ResizableBox } from 'react-resizable';
import CreatableSelect from 'react-select/creatable';

import JsonEditor from './JsonEditor';
import ElementSelector from './ElementSelector';
import { getElements, getClassSuggestions, getClassesIntersection } from '../assets/util';

const LOCKED_DATA = ['id', 'source', 'target'];

const autocomplete = {
    filter: 'contain',
    trigger: 'focus',
    caseSensitive: false,
    getOptions: (text, path, input, editor) => {
        if (input === 'value'){
            const field = path[1];
            let options = new Set();
            // Add values from other elements.
            window.cy.elements().forEach(ele => {
                let s = ele.data(field);
                console.log(s)
                if (s && typeof(s) !== 'object'){
                    options.add(s);
                }
            });
            return Array.from(options);
        }else if (input === 'field'){
            let fields = new Set();
            window.cy.elements().forEach(ele => {
                Object.keys(ele.data()).forEach(name => fields.add(name));
            })
            return Array.from(fields);
        }
        return [];
    }
}

export default class DataEditor extends React.Component {
    /*
    DataEditor:
        Select: Subset of nodes, edges (use selected)
        Editor:
            - classes as badges
            - Data json
    */
    constructor(props) {
        super(props);
        this.state = {
            selected: window.cy.collection()
        }
        this.editor = createRef();
    }

    componentDidMount = () => {
        const selected = getElements(':selected');
        const data = selected.map(item => item.data());
        this.editor.current.jsonEditor.set(data);
        this.setState({selected});
    }

    onJsonChange = () => {
        const jsons = this.editor.current.jsonEditor.get();
        jsons.forEach(data => {
            const ele = window.cy.$('#' + data.id);
            ele.data(data);
        })
    }

    onEditable = (node) => {
        if (node.path && node.path.length === 2){
            return !LOCKED_DATA.includes(node.field);
        }
        return true;
    }
    
    onSelectionChange = (selected) => {
        const data = selected.map(item => item.data());
        this.editor.current.jsonEditor.set(data);
        this.setState({selected});
    }

    onClassesChange = (newValue) => {
        const {
            selected
        } = this.state;
        let labels = [];
        if (newValue){
            labels = newValue.map(v => v['value']);
        }
        selected.classes(labels)
        // Force update.
        this.setState(this.state);
    }

    onCreate = (newValue) => {
        const {
            selected
        } = this.state;
        selected.addClass([newValue]);
        // Force update.
        this.setState(this.state);
    }

    classItems = (classes) => {
        return classes.map(cls => { return {value: cls, label: cls}});
    }

    render() {
        const {
            selected
        } = this.state;
        let classSuggestions = getClassSuggestions();
        let selectedClasses = getClassesIntersection(getElements(':selected'));
        classSuggestions = this.classItems(classSuggestions);
        selectedClasses = this.classItems(selectedClasses);
        return (
            <>
                <ResizableBox width={500} height={400}
                    minConstraints={[280, 250]}
                    maxConstraints={[1000, 1000]}>
                    <ListGroup style={{ height: "100%" }}>
                        <ListGroupItem>
                            <ElementSelector 
                                onChange={this.onSelectionChange}/>
                        </ListGroupItem>
                        <ListGroupItem>
                            <CreatableSelect
                                isMulti
                                isDisabled={selected.length === 0}
                                isClearable
                                onChange={this.onClassesChange}
                                onCreateOption={this.onCreate}
                                options={classSuggestions}
                                value={selectedClasses}
                                />
                        </ListGroupItem>
                        <ListGroupItem style={{ height: "100%" }}>
                            <JsonEditor
                                ref={this.editor}
                                onEditable={this.onEditable}
                                onChange={this.onJsonChange}
                                autocomplete={autocomplete}
                            />
                        </ListGroupItem>
                        </ListGroup>
                </ResizableBox>
            </>
                    )
                }
            }
