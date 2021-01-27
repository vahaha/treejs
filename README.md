## Usage
```js
var Tree = require('@vahaha/treejs');

const nodes = [
    {
        "id": "1",
        "name": "Root 1",
    },
    {
        "id": "2",
        "name": "Root 2",
    },
    {
        "id": "3",
        "name": "Branch 1",
        "parentId": "1",
    },
    {
        "id": "4",
        "name": "Branch 2",
        "parentId": "2",
    },
    {
        "id": "5",
        "name": "Branch 3",
        "parentId": "1",
    },
    {
        "id": "6",
        "name": "Leaf 1",
        "parentId": "3",
    },
    {
        "id": "7",
        "name": "Leaf 2",
        "parentId": "3"
    }
];

const tree = Tree.buildTree(nodes, "id", "parentId")

/* result:
[
    {
        "id": "2",
        "name": "Root 2",
        "children": [
            {
                "id": "4",
                "name": "Branch 2",
                "parentId": "2"
            }
        ]
    },
    {
        "id": "1",
        "name": "Root 1",
        "children": [
            {
                "id": "5",
                "name": "Branch 3",
                "parentId": "1"
            },
            {
                "id": "3",
                "name": "Branch 1",
                "parentId": "1",
                "children": [
                    {
                        "id": "6",
                        "name": "Leaf 1",
                        "parentId": "3"
                    },
                    {
                        "id": "7",
                        "name": "Leaf 2",
                        "parentId": "3"
                    }
                ]
            }
        ]
    }
]
/*
```

