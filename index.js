const _ = require('lodash')

/**
 * Building trees from array of nodes.
 * @param {Array} nodes array of nodes.
 * @param {String} keyName field name of the node key.
 * @param {String} parentFieldName parent field name (foreign key).
 * @param {Object} [options] options for building trees
 *
 * Opstion object: {childrenFieldName: 'children', cloneDeep: false}
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

    return findChildren(
        indexNodes,
        Object.keys(indexNodes),
        keyName,
        parentFieldName,
        { childrenFieldName }
    )
}

const findChildren = (
    indexNodes,
    nodeIds,
    keyName,
    parentFieldName,
    { childrenFieldName }
) => {
    let leafIds = new Set(nodeIds)
    const parentIds = new Set()

    // find leaves
    nodeIds.forEach(nodeId => {
        const node = indexNodes[nodeId]
        const parentId = node[parentFieldName]

        if (parentId) {
            parentIds.add(parentId)
            leafIds.delete(parentId)
        }
    })

    leafIds = Array.from(leafIds)
    let leaves = leafIds.map(id => indexNodes[id])

    /* find trees */
    // nodes stand alone(don't have parent), that's tree
    const tmpLeaves = []
    const trees = []

    leaves.forEach(leaf => {
        if (leaf[parentFieldName]) {
            tmpLeaves.push(leaf)
        } else {
            trees.push(leaf)
        }
    })
    leaves = tmpLeaves

    if (!leaves.length) {
        return trees
    }

    // There are leaves, that have parent. We need to continue to build tree.
    // groupping leaves to branch level
    const leafGroup = _.groupBy(leaves, parentFieldName)
    const branches = Array.from(parentIds).map(id => {
        const parentId = id.toString()
        const branch = indexNodes[parentId]
        const children = leafGroup[parentId]
        if (children) {
            if (
                branch[childrenFieldName] &&
                Array.isArray(branch[childrenFieldName])
            ) {
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
    return [
        ...trees,
        ...findChildren(
            indexNodes,
            branches.map(e => e[keyName]),
            keyName,
            parentFieldName,
            {
                childrenFieldName,
            }
        ),
    ]
}

module.exports = {
    buildTree,
}
