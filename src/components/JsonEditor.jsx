import React from 'react';
import {JsonEditor as Editor} from 'jsoneditor-react';

import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

const MODES = ['tree', 'view', 'code', 'text', 'form'];

const JsonEditor = React.forwardRef((props, ref) => {
    const allowedModes = [...MODES, ...(props.extraModes || [])];
    return (
        <Editor
            ref={ref}
            ace={ace}
            allowedModes={allowedModes}
            htmlElementProps={{style: {height: '100%'}}}
            theme="ace/theme/github"
            sortObjectKeys
            history
            {...props}
            />
    )
});

export default JsonEditor;