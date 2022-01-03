## Usage
```js
const Tree = require('@vahaha/treejs');

const arrTreeJs = Tree.fromNodes(nodes, options); // array of TreeJS objects
const tree = arrTreeJs[0].tree // tree json
```

### Optional object
- key (default 'id'): field name is key
- parentKey (default 'parentId'): field name is parent key
- childrenKey (default 'children'): field name is children key.
- sort: function is used to sort nodes (ex: (a, b) => a.id > b.id ? 1 : -1)
```js
const Tree = require('@vahaha/treejs');
const nodes = [
    {"_id": "1", "name": "Root 1"},
    {"_id": "2", "name": "Branch 1", "pId": "1"},
];

// use options object
const arrTreeJs = Tree.fromNodes(nodes, {
    key: '_id',
    parentKey: 'pId',
    sort: (a, b) => a._id > b._id ? 1 : -1 
}); // always return an array

const objTree = arrTreeJs[0] // TreeJS object
const tree = objTree.tree // tree json
```
### Tree's functions:
```js
const Tree = require('@vahaha/treejs');
const nodes = [
    {"id": "1", "name": "Root 1"},
    {"id": "2", "name": "Branch 1", "parentId": "1"},
    {"id": "3", "name": "Branch 2", "parentId": "1"},
    {"id": "4", "name": "Branch 3", "parentId": "1"},
    {"id": "5", "name": "Leaf 1", "parentId": "3"},
    {"id": "6", "name": "Leaf 2", "parentId": "3"}
];

/*
Tree:
    1: Root 1
    |- 2: Branch 1
    |- 3: Branch 2
       |- 5: Leaf 1
       |- 6: Leaf 2
    |- 4: Branch 3
*/

// use options object
const arrTreeJs = Tree.fromNodes(nodes);

const objTree = arrTreeJs[0]

// get a Branch
const branch = objTree.getBranch("3")
// result {id: "3", "name", "Branch 2", "parentId": "1", children: [{id: "5", ...}, {id: "6", ...}]},

// get all nodes of a branch
const branchNodes = objTree.getNodesOfBranch("3")
// [
//    {id: "3", "name", "Branch 2", "parentId": "1", children: [...]},
//    {id: "5", "name", "Leaf 1", "parentId": "3"},
//    {id: "6", "name", "Leaf 2", "parentId": "3"}
// ]

// get a node by id
const node = objTree.getNode("3")
// result such as getBranch: {id: "3", "name", "Branch 2", "parentId": "1", children: [{id: "5", ...}, {id: "6", ...}]}
```
### TreeNode's functions:
```js
const Tree = require('@vahaha/treejs');
const nodes = [
    {"id": "1", "name": "Root 1"},
    {"id": "2", "name": "Branch 1", "parentId": "1"},
    {"id": "3", "name": "Branch 2", "parentId": "1"},
    {"id": "4", "name": "Branch 3", "parentId": "1"},
    {"id": "5", "name": "Leaf 1", "parentId": "3"},
    {"id": "6", "name": "Leaf 2", "parentId": "3"}
];

/*
Tree:
    1: Root 1
    |- 2: Branch 1
    |- 3: Branch 2
       |- 5: Leaf 1
       |- 6: Leaf 2
    |- 4: Branch 3
*/

// use options object
const arrTreeJs = Tree.fromNodes(nodes);
const objTree = arrTreeJs[0]
// get a node by id
const node = objTree.getNode("5")

const pathToRoot = node.getPath() // ["3", "1"]
const parent = node.getParent() // {id: "3", "name", "Branch 2", "parentId": "1", children: [{id: "5", ...}, {id: "6", ...}]}
```

### References:
- fromNodes function: build trees from array of nodes (return array of TreeJS objects)
- TreeJS object:
  - property:
    - tree: tree json
  - functions:
    - construction(tree): init TreeJS object from a tree json
    - getBranch(id): get branch (sub tree) from a node
    - getNodesOfBranch(id): get all nodes are descendant of a node. Result include current node.
    - getNode(id): get a node by id. (alias getBranch)
- TreeNode object:
  - properties:
    - cloned properties of your node
    - [childrenKey] (default 'children'): contains child nodes
  - functions:
    - getPath(): get path direct to root
    - getParent(): get parent of current node
    - setParent(parent: TreeNode): set parent of current node. This action also adds current node to children list of parent.
    - addChild(...children): add child/children to node.This action also sets current node as parent of added child/children
    - inheritPath(): refresh path of current node by inherit from parent
    - visitAncestors(): refresh path by visit all ancestors
    - visitDescendants(): refresh path of all descendants

## Old version <= 1.1.4
---
```js
const Tree = require('@vahaha/treejs');

const tree = Tree.buildTree(nodes, keyName, parentFieldName, options);
```

### Options

Optional object
- childrenFieldName ('children' is default): custom children field name.
- cloneDeep (false is default): if true, it'll clone deep array of nodes.

### Example:
```js
var Tree = require('@vahaha/treejs');

const nodes = [
    {"id": "1", "name": "Root 1"},
    {"id": "2", "name": "Root 2"},
    {"id": "3", "name": "Branch 1", "parentId": "1"},
    {"id": "4", "name": "Branch 2", "parentId": "2"},
    {"id": "5", "name": "Branch 3", "parentId": "1"},
    {"id": "6", "name": "Leaf 1", "parentId": "3"},
    {"id": "7", "name": "Leaf 2", "parentId": "3"}
];

const keyName = "id";
const parentFieldName = "parentId";

const tree = Tree.buildTree(nodes, keyName, parentFieldName)

/* result:
[
    {
        "id": "2",
        "name": "Root 2",
        "children": [
            {"id": "4", "name": "Branch 2", "parentId": "2"}
        ]
    },
    {
        "id": "1",
        "name": "Root 1",
        "children": [
            {"id": "5", "name": "Branch 3", "parentId": "1"},
            {"id": "3", "name": "Branch 1", "parentId": "1",
                "children": [
                    {"id": "6", "name": "Leaf 1", "parentId": "3"},
                    {"id": "7", "name": "Leaf 2", "parentId": "3"}
                ]
            }
        ]
    }
]
*/

const tree2 = Tree.buildTree(nodes, keyName, parentFieldName, {childrenFieldName: 'nodes'})

/* result:
[
    {
        "id": "2",
        "name": "Root 2",
        "nodes": [  // using 'nodes' instead of 'children'
            {"id": "4", "name": "Branch 2", "parentId": "2"}
        ]
    },
    {
        "id": "1",
        "name": "Root 1",
        "nodes": [  // using 'nodes' instead of 'children'
            {"id": "5", "name": "Branch 3", "parentId": "1"},
            {"id": "3", "name": "Branch 1", "parentId": "1",
                "nodes": [  // using 'nodes' instead of 'children'
                    {"id": "6", "name": "Leaf 1", "parentId": "3"},
                    {"id": "7", "name": "Leaf 2", "parentId": "3"}
                ]
            }
        ]
    }
]
*/
```