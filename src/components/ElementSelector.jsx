import React from 'react';
import MultiSelect from "@kenshooui/react-multi-select";

import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {getElements} from '../assets/util';

import "@kenshooui/react-multi-select/dist/style.css"


const elementsToItems = (elements) => {
    const items = elements.map((ele, i) => {
        const name = ele.data('name');
        if (ele.group() === 'edges'){
            const source = ele.source().data('name');
            const target = ele.target().data('name');
            return {
                id: i, 
                label: `${source} (${name}) ${target}`,
                group: ele.group(),
                element: ele
            }
        }
        return {
            id: i, label: name, group: ele.group(), element: ele
        }
    });
    items.sort((a, b) => a.name > b.name);
    return items;
}


export default class ElementSelector extends React.Component {
    state = {
        selected: []
    };

    componentDidMount() {
        window.cy.on('select unselect', this.selectionChanged);
    }
    componentWillUnmount() {
        window.cy.removeListener('select unselect', this.selectionChanged);
    }



    selectionChanged = (event, selected) => {
        if (selected === undefined){
            selected = getElements(':selected');
        }
        this.setState({selected})
        this.props.onChange(selected);
    }

    multiSelectChanged = (selectedItems) => {
        const elements = window.cy.collection(selectedItems.map(ele => ele.element));

        window.cy.startBatch();
        window.cy.elements().deselect();
        elements.select();
        window.cy.endBatch();

        this.selectionChanged(null, elements);
    }

    render() {
        const elements = getElements();
        const items = elementsToItems(elements);
        const selectedItems = items.filter(el => el.element.selected())
        const popover = (
            <Popover>
                <Popover.Content>
                <MultiSelect
                    items={items}
                    showSelectedItems={true}
                    showSelectedItemsSearch={true}
                    showSearch={true}
                    showSelectAll={true}
                    selectedItems={selectedItems}
                    withGrouping
                    onChange={this.multiSelectChanged}/>
                </Popover.Content>
            </Popover>
        )

        return (
            <InputGroup>
                <FormControl
                    disabled
                    placeholder="Search"
                    value={`${selectedItems.length} elements selected`}
                />
                <InputGroup.Append>
                    <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
                        <Button>Select</Button>
                    </OverlayTrigger>
                </InputGroup.Append>
            </InputGroup>
        )
    }
}
