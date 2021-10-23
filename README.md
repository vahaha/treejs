## Usage
```js
const Tree = require('@vahaha/treejs');

const tree = Tree.fromNodes(nodes, options);
```

### Optional object
- key (default 'id'): field name is key
- parentKey (default 'parentId'): field name is parent key
- childrenKey (default 'children'): field name is children key.
- sort: function is used to sort nodes
### References:
- fromNodes function: build trees from array of nodes
- TreeJS object:
  - getBranch: get branch (sub tree) from a node
  - getNodesOfBranch: get all nodes are descendant of a node. Result include current node.
- TreeNode object:
  - getPath: get path direct to root
  - getParent: get parent of current node
  - setParent: set parent of current node. This action also adds current node to children list of parent.
  - addChild: add child/children to node.This action also sets current node as parent of added child/children
  - inheritPath: refresh path of current node by inherit from parent
  - visitAncestors: refresh path by visit all ancestors
  - visitDescendants: refresh path of all descendants

## Old version <= 1.14
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