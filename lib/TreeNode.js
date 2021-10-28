/**
 * Innit TreeNode from a object
 * @param {Object} node node object
 * @param {Option} [options] options for building tree
 *
 * Option object: {key: 'id', parentKey: 'parentId', childrenKey: 'children', sort}
 */
function TreeNode(node, options) {
    const { key, parentKey, childrenKey, sort } = options
    Object.assign(this, node)

    let _path = new Set()
    let _parent

    this.getPath = function () {
        return _path
    }

    this.getParent = function () {
        return _parent
    }

    this.setParent = function (parent) {
        if (!(parent instanceof TreeNode)) {
            throw new Error('Parent must be an instance of TreeNode')
        }

        _parent = parent
        const children = parent[childrenKey] || []
        parent[childrenKey] = children

        if (!children.find(child => child[key] === this[key])) {
            children.push(this)
            if (typeof sort === 'function') {
                parent[childrenKey].sort(sort)
            }
        }

        this.visitAncestors()
        return this
    }

    this.addChild = function (...children) {
        if (!children || !children.length) {
            return this
        }

        children.forEach(child => {
            let node = child
            if (!(child instanceof TreeNode)) {
                node = new TreeNode(child, options)
            }

            node.setParent(this)
        })

        if (typeof sort === 'function') {
            this[childrenKey].sort(sort)
        }

        return this
    }

    this.getChild = function (index) {
        const children = this[childrenKey]
        if (Array.isArray(children)) {
            return children[index] || undefined
        }

        return undefined
    }

    /**
     * refresh path by inherit from parent
     */
    this.inheritPath = function () {
        const parent = this.getParent()
        if (parent instanceof TreeNode) {
            _path = new Set([..._path, ...parent.getPath()])
        }
    }

    /**
     * refresh path by visit all ancestors
     */
    this.visitAncestors = function () {
        _path.clear
        buildPath(_path, this, { key, parentKey })
    }

    /**
     * refresh path of all descendants
     */
    this.visitDescendants = function () {
        visitDescendants(this[childrenKey])
    }
}

function buildPath(path, node, { key, parentKey }) {
    const parent = node.getParent()
    if (parent) {
        path.add(parent[key])
        return buildPath(path, parent, { key, parentKey })
    } else {
        return path
    }
}

function visitDescendants(children, childrenKey) {
    if (!children || !children.length) {
        return
    }
    children.forEach(child => {
        if (!(child instanceof TreeNode)) {
            return
        }

        child.inheritPath()
        visitDescendants(child[childrenKey])
    })
}

module.exports = TreeNode
