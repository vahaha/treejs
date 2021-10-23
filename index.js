const _ = require('lodash')
const TreeNode = require('./lib/TreeNode')

function Option({
    key = 'id',
    parentKey = 'parentId',
    childrenKey = 'children',
    clone = false,
    sort,
}) {
    this.childrenKey = childrenKey
    this.clone = clone
    this.key = key
    this.parentKey = parentKey
    this.sort = sort

    return this
}

/**
 * Innit TreeJS from array of trees.
 * @param {Array} trees array of trees.
 * @param {Option} [options] options for building trees
 *
 * Option object: {key: 'id', parentKey: 'parentId', childrenKey: 'children', sort}
 */
function TreeJS(
    trees,
    options = {
        key: 'id',
        parentKey: 'parentId',
        childrenKey: 'children',
    }
) {
    if (!Array.isArray(trees)) {
        throw new Error('trees must be an array')
    }

    const _options = new Option(options)
    const mapIdNodes = new Map()

    this.trees = trees.map(tree => new TreeNode(tree, _options))
    scanTree(mapIdNodes, this.trees, _options)

    return this
}

function scanTree(mapIdNodes, nodes, options) {
    const { key, childrenKey } = options

    nodes.forEach(node => {
        mapIdNodes.set(node[key], node)
        let children = node[childrenKey]
        if (children && children.length) {
            children = children.map(child => new TreeNode(child, options))
            children.forEach(child => child.setParent(node))
            node[childrenKey] = children
            scanTree(mapIdNodes, children, options)
        }
    })
}

/**
 * Build trees from array of nodes.
 * @param {Array} nodes array of nodes.
 * @param {String} key identity field name of the node. 'id' is default
 * @param {String} parentKey identify field name of the parent (foreign key). 'parentId' is default
 * @param {Option} [options] options for building trees
 *
 * Option object: {key: 'id', parentKey: 'parentId', childrenKey: 'children', sort}
 */
TreeJS.fromNodes = (
    nodes,
    options = {
        key: 'id',
        parentKey: 'parentId',
        childrenKey: 'children',
    }
) => {
    if (!Array.isArray(nodes)) {
        throw new Error('nodes must be an array')
    }

    const _options = new Option(options)
    const { key, parentKey } = _options

    let availableNodes = nodes.filter(node => node)
    availableNodes = _.cloneDeep(availableNodes)

    const mapIdNodes = new Map()
    availableNodes.forEach(entity => {
        const node = new TreeNode(entity, _options)
        mapIdNodes.set(node[key], node)
    })

    mapIdNodes.forEach(node => {
        const parentId = node[parentKey]
        if ([undefined, null].includes(parentId)) {
            return
        }
        const parent = mapIdNodes.get(parentId)
        if (parent) {
            node.setParent(parent)
        }
    })

    const trees = build(mapIdNodes, [...mapIdNodes.keys()], _options)
    trees.forEach(root => root.visitDescendants())

    return new TreeJS(trees, _options)
}

/**
 * Building trees from array of nodes.
 * @param {Array} nodes array of nodes.
 * @param {String} key field name, which is id of node.
 * @param {String} parentKey parent field name (foreign key), which is parent id of node
 * @param {Object} [options] options for building trees
 *
 * Option object: {childrenFieldName: 'children', cloneDeep: false, sort}
 */
TreeJS.buildTree = (
    nodes,
    key = 'id',
    parentKey = 'parentId',
    options = { childrenFieldName: 'children', cloneDeep: false }
) => {
    if (!Array.isArray(nodes)) {
        throw new Error('nodes must be an array')
    }

    if (!key) {
        throw new Error('unknown key name')
    }

    if (!parentKey) {
        throw new Error('unknown parent field name')
    }

    let availableNodes = nodes.filter(node => node)
    availableNodes = options.cloneDeep
        ? _.cloneDeep(availableNodes)
        : availableNodes

    const mapIdNodes = new Map()
    availableNodes.forEach(node => {
        node.__proto__.__path = new Set()
        const parentId = node[parentKey]
        if (parentId) {
            node.__proto__.__path.add(parentId)
        }
        mapIdNodes.set(node[key], node)
    })

    return build(mapIdNodes, [...mapIdNodes.keys()], {
        key,
        parentKey,
        childrenKey: options.childrenFieldName,
        sort: options.sort,
    })
}

const build = (mapIdNodes, nodeIds, options) => {
    const { parentKey, childrenKey, sort } = options
    const leafGroup = new Map()

    nodeIds.forEach(id => {
        const node = mapIdNodes.get(id)
        const parentId = node[parentKey]
        if (!leafGroup.has(parentId)) {
            leafGroup.set(parentId, [])
        }
        const group = leafGroup.get(parentId)
        group.push(node)
    })

    const parentIds = [...leafGroup.keys()]
    const trees = []
    parentIds.forEach(parentId => {
        const branch = mapIdNodes.get(parentId)
        const children = leafGroup.get(parentId)
        if (!branch) {
            return trees.push(...children)
        }

        if (branch[childrenKey] && Array.isArray(branch[childrenKey])) {
            branch[childrenKey] = [...branch[childrenKey], ...children]
        } else {
            branch[childrenKey] = children
        }
        if (typeof sort === 'function') {
            branch[childrenKey].sort(sort)
        }
    })

    if (typeof sort === 'function') {
        return trees.sort(sort)
    }

    return trees
}

module.exports = TreeJS
