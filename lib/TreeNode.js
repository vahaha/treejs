function TreeNode(node, { key, parentKey, childrenKey }) {
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
        this.visitAncestors()
    }

    // refresh path by inherit from parent
    this.inheritPath = function () {
        const parent = this.getParent()
        if (parent instanceof TreeNode) {
            _path = new Set([..._path, ...parent.getPath()])
        }
    }

    // refresh path by visit all ancestors
    this.visitAncestors = function () {
        _path.clear
        buildPath(_path, this, { key, parentKey })
    }

    // refresh path of all descendants
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
