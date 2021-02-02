const Tree = require('./index')

describe('Tree', () => {
    testingWorkFlow('Build tree by default', {})
    testingWorkFlow('Build tree by customize key', { key: 'key' })
    testingWorkFlow('Build tree by customize parent key', {
        parentKey: 'parentKey',
    })
    testingWorkFlow('Build tree by customize children key', {
        childrenFieldName: 'nodes',
    })
})

function testingWorkFlow(
    title,
    { key = 'id', parentKey = 'parentId', childrenFieldName = 'children' }
) {
    return describe(title, () => {
        let numberTree = 2
        let numberChildren = 2
        let deep = 3
        let trees = []

        beforeAll(() => {
            numberTree = Math.floor(Math.random() * 5) || numberTree
            numberChildren = Math.floor(Math.random() * 10) || numberChildren
            deep = Math.floor(Math.random() * 5) || deep

            const nodes = genNodes(numberTree, numberChildren, deep, {
                key,
                parentKey,
            })
            nodes.push(null, undefined, 1, 'one', {})

            trees = Tree.buildTree(nodes, key, parentKey, { childrenFieldName })
        })

        test('Total tree is correct', () => {
            expect(trees.length).toBe(numberTree + 1)
        })

        test('Number children is correct on each branch', () => {
            expect(
                trees[0][childrenFieldName] || trees[1][childrenFieldName]
            ).toBeTruthy()
            trees.forEach(checkNumberChildren)

            function checkNumberChildren(node) {
                if (node[childrenFieldName]) {
                    expect(node[childrenFieldName].length).not.toBe(0)
                    if (!node[childrenFieldName].length) {
                        return
                    }
                    expect(node[childrenFieldName].length).toBe(numberChildren)
                    node[childrenFieldName].forEach(checkNumberChildren)
                }
            }
        })

        test('Deep length is correct', () => {
            const deepOfTrees = trees
                .filter(tree => Object.keys(tree).length)
                .map(tree => getDeepLength(0, tree))
            expect(deepOfTrees.length).toBe(numberTree)
            deepOfTrees.forEach(length => expect(length).toBe(deep))

            function getDeepLength(length, node) {
                if (node[childrenFieldName]) {
                    return getDeepLength(length + 1, node[childrenFieldName][0])
                }

                return length
            }
        })
    })
}

function genNodes(numberTree, numberChildren, deep, { key, parentKey }) {
    const nodes = []

    for (let i = 0; i < numberTree; i++) {
        const id = i + 1 + ''
        nodes.push({
            [key]: id,
        })
        genChildNodes(1, id)
    }

    function genChildNodes(level, parentId) {
        if (level > deep) {
            return
        }

        for (let i = 0; i < numberChildren; i++) {
            const id = [parentId, i + 1].join('.')
            nodes.push({
                [key]: id,
                [parentKey]: parentId,
            })

            genChildNodes(level + 1, id)
        }
    }

    return nodes
}
