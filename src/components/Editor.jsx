import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

import DataEditor from './DataEditor';
import StyleEditor from './StyleEditor';
import 'react-resizable/css/styles.css';

import 'jsoneditor-react/es/editor.min.css';

export default class Editor extends React.Component {
    state = {
        hidden: false,
        tab: 'style'
    };

    tabChange = (tab) => {
        this.setState({tab})
    }

    toggle = () => {
        const {hidden} = this.state;
        this.setState({hidden: !hidden});
    }

    render = () => {
        const {
            hidden,
            tab
        } = this.state;
        
        if (hidden){
            return (
            <button type="button" className="btn btn-dark" id="editor-button" onClick={this.toggle}>
                <FontAwesomeIcon icon={faCog} />
            </button>);
        }

        return (
            <Card id="editor">
                <Card.Header style={{paddingTop: '.1rem'}}>
                    <Nav variant="tabs" activeKey={tab} onSelect={this.tabChange}>
                        <Nav.Item>
                            <Nav.Link eventKey="data">Data</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="style">Style</Nav.Link>
                        </Nav.Item>
                        <Button className="close ml-auto" onClick={this.toggle} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </Button>
                    </Nav>
                </Card.Header>
                {tab === 'data' && <DataEditor/>}
                {tab === 'style' && <StyleEditor/>}
            </Card>
            )
    }
}