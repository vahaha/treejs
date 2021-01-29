## Usage
```js
const Tree = require('@vahaha/treejs');

const tree = Tree.buildTree(nodes, keyName, parentFieldName, options);
```

### Options

Optional object
- childrenFieldName ('children' is default): custome children field name.
- cloneDeep (false is default): if true, it'll clone deep array of nodes. This ensures that any tree updates will not affect input nodes. However, you should pay attention to system performance if the number of nodes is large.

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