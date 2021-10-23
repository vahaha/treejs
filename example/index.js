const nodes = require('./data.json')
const TreeJS = require('../index')

// const tree1 = TreeJS.buildTree(nodes, 'id', 'parentId', {
//     sort: (a, b) => (a.id > b.id ? 1 : -1),
// })
// console.log(JSON.stringify(tree1, null, 2))

const tree2 = TreeJS.fromNodes(nodes, {
    key: 'id',
    parentKey: 'parentId',
    sort: (a, b) => (a.id > b.id ? 1 : -1),
}).trees
console.log(JSON.stringify(tree2, null, 2))

// const baseTree = JSON.parse(JSON.stringify(tree2))

// const tree3 = new TreeJS(baseTree, {
//     key: 'id',
//     parentKey: 'parentId',
//     sort: (a, b) => (a.id > b.id ? 1 : -1),
// })
// console.log(JSON.stringify(tree3, null, 2))
