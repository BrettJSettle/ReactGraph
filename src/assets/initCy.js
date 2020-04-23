import {uuid} from './util';

let NODE_NUM = 0;

export const initCy = (cy) => {
    if (window.cy){
        return;
    }
    window.cy = cy;

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
}