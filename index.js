const _ = require('lodash')

const buildTree = (nodes, keyName, parentFieldName) => {
    if (!Array.isArray(nodes)) {
        throw new Error('nodes must be an array')
    }

    if (!keyName) {
        throw new Error('unknown key name')
    }

    if (!parentFieldName) {
        throw new Error('unknown parent field name')
    }

    const availableNodes = nodes.filter(node => node)
    const indexNodes = _.keyBy(availableNodes, keyName)

    let leafIds = new Set(Object.keys(indexNodes))
    const parentIds = new Set()

    // find nodes're leaf
    for (let i = 0; i < availableNodes.length; i++) {
        const parentId = availableNodes[i][parentFieldName]

        if (parentId) {
            parentIds.add(parentId)
            leafIds.delete(parentId.toString())
        }
    }

    leafIds = Array.from(leafIds)
    let leafs = leafIds.map(id => indexNodes[id])

    // find trees and filter leaf(node) isn't tree.
    // leaf(node) stand alone(don't have parent), that's tree
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

    // there are leafs have parent. so we need continue to build tree
    // groupping leafs to branch level
    const leafGroup = _.groupBy(leafs, parentFieldName)
    const branches = Array.from(parentIds).map(id => {
        const parentId = id.toString()
        const branch = indexNodes[parentId]
        const children = leafGroup[parentId]
        if (children) {
            if (branch.children) {
                branch.children = [...branch.children, ...children]
            } else {
                branch.children = children
            }
        }
        return branch
    })

    // continue to build trees with branches in nodes role
    // and retunning when completed
    return [...trees, ...buildTree(branches, keyName, parentFieldName)]
}

module.exports = {
    buildTree,
}
