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
 * @param {Object} tree tree object
 * @param {Option} [options] options for building trees
 *
 * Option object: {key: 'id', parentKey: 'parentId', childrenKey: 'children', sort}
 */
function TreeJS(
    tree,
    options = {
        key: 'id',
        parentKey: 'parentId',
        childrenKey: 'children',
    }
) {
    if (typeof tree !== 'object' || Array.isArray(tree)) {
        throw new Error('tree must be an object')
    }

    const _options = new Option(options)
    const mapIdNodes = new Map()

    this.tree = new TreeNode(tree, _options)
    scanTree(mapIdNodes, [this.tree], _options)

    this.getBranch = function (id) {
        return mapIdNodes.get(id)
    }

    this.getNodesOfBranch = function (id) {
        const root = mapIdNodes.get(id)
        if (!root) {
            return root
        }

        const nodes = [root]
        mapIdNodes.forEach(node => {
            const path = node.getPath() || new Set()
            if (path.has(id)) {
                nodes.push(node)
            }
        })

        return nodes
    }

    return this
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

    // clean nodes
    let availableNodes = nodes.filter(node => node)
    availableNodes = _.cloneDeep(availableNodes)

    // create index by id
    const mapIdNodes = new Map()
    availableNodes.forEach(entity => {
        const node = new TreeNode(entity, _options)
        mapIdNodes.set(node[key], node)
    })

    // attach parent to child node
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

    // build trees
    const trees = build(mapIdNodes, [...mapIdNodes.keys()], _options)
    trees.forEach(root => root.visitDescendants())

    return trees.map(tree => new TreeJS(tree, _options))
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
    const { parentKey, sort } = options
    const trees = []

    mapIdNodes.forEach(node => {
        const parentId = node[parentKey]
        const parent = mapIdNodes.get(parentId)
        if ([undefined, null].includes(parentId) || !parent) {
            return trees.push(node)
        }

        node.setParent(parent)
    })

    if (typeof sort === 'function') {
        trees.sort(sort)
    }

    return trees
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

module.exports = TreeJS
