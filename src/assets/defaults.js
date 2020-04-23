

export const LAYOUTS = [
    {name: 'Grid', defaults: {name: 'grid'}},
    {name: 'Circle', defaults: {name: 'circle'}},
    {name: 'Concentric', defaults: {name: 'concentric'}},
    {name: 'Random', defaults: {name: 'random'}},
    {name: 'Preset', defaults: {name: 'preset'}},
    {name: 'Breadthfirst', defaults: {name: 'breadthfirst'}},
    {name: 'Cose', defaults: {name: 'cose'}},
]

export const LAYOUT_PARAMS = {

}

export const STYLESHEET = [
  {
    selector: 'node',
    style: {},
  },
  {
      selector: 'edge',
      style: {
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle'
      }
    },
    {
      selector: 'node[name]',
      style: {
        'content': 'data(name)',
        'text-valign': 'center'
      }
    },

    // some style for the extension
    {
      selector: '.eh-handle',
      style: {
        'background-color': 'red',
        'width': 12,
        'height': 12,
        'shape': 'ellipse',
        'overlay-opacity': 0,
        'border-width': 12, // makes the handle easier to hit
        'border-opacity': 0
      }
    },

    {
      selector: '.eh-hover',
      style: {
        'background-color': 'red'
      }
    },

    {
      selector: '.eh-source',
      style: {
        'border-width': 2,
        'border-color': 'red'
      }
    },

    {
      selector: '.eh-target',
      style: {
        'border-width': 2,
        'border-color': 'red'
      }
    },

    {
      selector: '.eh-preview, .eh-ghost-edge',
      style: {
        'background-color': 'red',
        'line-color': 'red',
        'target-arrow-color': 'red',
        'source-arrow-color': 'red'
      }
    },

    {
      selector: '.eh-ghost-edge.eh-preview-active',
      style: {
        'opacity': 0
      }
    }
  ];