const _ = require('lodash')

/**
 * Building trees from array of nodes.
 * @param {Array} nodes array of nodes.
 * @param {String} keyName field name of the node key.
 * @param {String} parentFieldName parent field name (foreign key).
 * @param {Object} [options] options for building trees
 */
const buildTree = (
    nodes,
    keyName,
    parentFieldName,
    options = { childrenFieldName: 'children', cloneDeep: false }
) => {
    if (!Array.isArray(nodes)) {
        throw new Error('nodes must be an array')
    }

    if (!keyName) {
        throw new Error('unknown key name')
    }

    if (!parentFieldName) {
        throw new Error('unknown parent field name')
    }

    const { childrenFieldName, cloneDeep } = options

    let availableNodes = nodes.filter(node => node)
    availableNodes = cloneDeep ? _.cloneDeep(availableNodes) : availableNodes

    const indexNodes = _.keyBy(availableNodes, keyName)

    let leafIds = new Set(Object.keys(indexNodes))
    const parentIds = new Set()

    // find leafs
    for (let i = 0; i < availableNodes.length; i++) {
        const parentId = availableNodes[i][parentFieldName]

        if (parentId) {
            parentIds.add(parentId)
            leafIds.delete(parentId.toString())
        }
    }

    leafIds = Array.from(leafIds)
    let leafs = leafIds.map(id => indexNodes[id])

    /* find trees */
    // nodes stand alone(don't have parent), that's tree
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

    // There are leafs, that have parent. We need to continue to build tree.
    // groupping leafs to branch level
    const leafGroup = _.groupBy(leafs, parentFieldName)
    const branches = Array.from(parentIds).map(id => {
        const parentId = id.toString()
        const branch = indexNodes[parentId]
        const children = leafGroup[parentId]
        if (children) {
            if (branch[childrenFieldName]) {
                branch[childrenFieldName] = [
                    ...branch[childrenFieldName],
                    ...children,
                ]
            } else {
                branch[childrenFieldName] = children
            }
        }
        return branch
    })

    // continue to build trees with branches in nodes role
    // and retunning trees when completed
    return [...trees, ...buildTree(branches, keyName, parentFieldName)]
}

module.exports = {
    buildTree,
}
