const Tree = require('./index')

const nodes = [
    null,
    {},
    {
        id: '1',
        name: 'Root 1',
    },
    {
        id: '2',
        name: 'Root 2',
    },
    {
        id: '3',
        name: 'Branch 1',
        parentId: '1',
    },
    {
        id: '4',
        name: 'Branch 2',
        parentId: '2',
    },
    {
        id: '5',
        name: 'Branch 3',
        parentId: '1',
    },
    {
        id: '6',
        name: 'Leaf 1',
        parentId: '3',
    },
    {
        id: '7',
        name: 'Leaf 2',
        parentId: '3',
    },
]

console.log(JSON.stringify(Tree.buildTree(nodes, 'id', 'parentId'), null, 4))
