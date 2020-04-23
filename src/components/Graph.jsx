import React from 'react';
import cytoscape from 'cytoscape';
import CytoComponent from 'react-cytoscapejs';
import edgehandles from 'cytoscape-edgehandles';

import Editor from './Editor';

import {initCy} from '../assets/initCy';
import {STYLESHEET} from '../assets/defaults';

cytoscape.use( edgehandles );

export default class Graph extends React.Component {
    constructor(){
        super();
        this.state = {
            cy: null
        }
    }

    onCreate = (cy) => {
        if (this.state.cy){
            return;
        }
        initCy(cy);
        this.setState({cy});
    }

    render(){
        const {
            cy
        } = this.state;
        return (
            <>
                <CytoComponent 
                    id="cyto"
                    stylesheet={STYLESHEET}
                    cy={this.onCreate}
                    elements={[]}
                />
                {cy && <Editor />}
            </>
        )
    }
}
