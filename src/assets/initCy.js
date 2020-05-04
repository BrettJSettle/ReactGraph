import {uuid, G} from './util';
import Mousetrap from 'mousetrap';

let NODE_NUM = 0;

export const initCy = (cy) => {
    if (window.cy){
        return;
    }
    window.cy = cy;

    cy.setFocus = (val) => {
        cy.focused = val;
        const cyto = document.getElementById('cyto');
        if (val){
            cyto.style.background = cy._background || '';
            if (cy.unfocusTimeout){
                clearTimeout(cy.unfocusTimeout);
            }
        }else{
            cy._background = cyto.style.background;
            cyto.style.background = 'lightgray';
        }
    }

    document.body.onblur = (() => { cy.setFocus(false)})

    const eh_defaults = {
        preview: false, // whether to show added edges preview before releasing selection
        hoverDelay: 150, // time spent hovering over a target node before it is considered selected
        noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
        complete: (s, t, added) => {
            added.select();
        }, edgeParams: (s, t) => {
            return {data: { 
                id: uuid(),
                name: ''
            }}
        }
    };
    cy.edgehandles(eh_defaults);

    const addNode = (data) => {
        const node = cy.add({
            group: "nodes",
            ...data
        });
        setTimeout(() => node.select(), 100);
    };

    cy.on("tap", function(e) {
        if (!cy.focused){
            cy.setFocus(true);
            return;
        }
        var target = e.target;
        if (target === cy){
            addNode({
                data: {
                    id: uuid(),
                    name: `New Node ${NODE_NUM++}`
                }, renderedPosition: {
                    x: e.renderedPosition.x,
                    y: e.renderedPosition.y
                }
            });
        }
    });


    // UndoRedo setup
    var ur_options = {
        actions: {},// actions to be added
        undoableDrag: true, // Whether dragging nodes are undoable can be a function as well
        stackSizeLimit: undefined, // Size limit of undo stack, note that the size of redo stack cannot exceed size of undo stack
    }
    
    var ur = cy.undoRedo(ur_options); // Can also be set whenever wanted.
    window.ur = ur;

    function deleteEles(eles){
        return eles.remove();
    }
    function restoreEles(eles){
        return eles.restore();
    }
    ur.action("delete", deleteEles, restoreEles); // register

    // Clipbaord setup
    var cb_options = {
        // Function executed on the collection of elements being copied, before
        // they are serialized in the clipboard
        // beforeCopy: function(eles) {},
        // Function executed on the clipboard just after the elements are copied.
        // clipboard is of the form: {nodes: json, edges: json}
        // afterCopy: function(clipboard) {},
        // Function executed on the clipboard right before elements are pasted,
        // when they are still in the clipboard.
        // beforePaste: function(clipboard) {},
        // Function executed on the collection of pasted elements, after they
        // are pasted.
        // afterPaste: function(eles) {}
    }
    var cb = cy.clipboard(cb_options);
    window.cb = cb;

    // Keyboard bindings
    Mousetrap.bind(['command+c', 'ctrl+c'], function() {
        cb.copy(G(':selected'));
        // return false to prevent default browser behavior
        // and stop event from bubbling
        return false;
    });
    Mousetrap.bind(['command+v', 'ctrl+v'], function() {
        ur.do('paste');
        // return false to prevent default browser behavior
        // and stop event from bubbling
        return false;
    });
    Mousetrap.bind(['command+a', 'ctrl+a'], function() {
        cy.elements().select();
        // return false to prevent default browser behavior
        // and stop event from bubbling
        return false;
    });
    Mousetrap.bind(['delete'], function() {
        ur.do('delete');
        // return false to prevent default browser behavior
        // and stop event from bubbling
        return false;
    });
    
}