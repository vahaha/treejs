const _ = require('lodash')

const buildTree = (nodes, keyName, parentFieldName) => {
    if (!parentFieldName) {
        throw new Error('parent field name is required')
    }

    const availableNodes = nodes.filter(node => node)
    const indexNodes = _.keyBy(availableNodes, keyName)

    let leafIds = new Set(Object.keys(indexNodes))
    const parentIds = new Set()

    for (let i = 0; i < nodes.length; i++) {
        const parentId = nodes[i][parentFieldName]

        if (parentId) {
            parentIds.add(parentId)
            leafIds.delete(parentId.toString())
        }
    }

    leafIds = Array.from(leafIds)
    let leafs = leafIds.map(id => indexNodes[id])

    const tmpLeafs = []
    const trees = []

    for (let i = 0; i < leafs.length; i++) {
        if (leafs[i][parentFieldName]) {
            tmpLeafs.push(leafs[i])
        } else {
            trees.push(leafs[i])
        }
    }
    leafs = tmpLeafs

    if (!leafs.length) {
        return trees
    }

    const leafGroup = _.groupBy(leafs, parentFieldName)
    const parents = Array.from(parentIds).map(id => {
        const parentId = id.toString()
        const parent = indexNodes[parentId]
        const children = leafGroup[parentId]
        if (children) {
            if (parent.children) {
                parent.children = [...parent.children, ...children]
            } else {
                parent.children = children
            }
        }
        return parent
    })

    return [...trees, ...buildTree(parents, keyName, parentFieldName)]
}

module.exports = {
    buildTree,
}
