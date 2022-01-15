# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.5] - 2022-01-15
### Added
- getAllNodes(): get all nodes of tree

## [2.0.2] - 2021-12-24
### Added
- getNode(id): get a node by id

## [2.0.2] - 2021-10-28
### Changed
- update docs

## [2.0.0] - 2021-10-23
### Added
- fromNodes function: build trees from array of nodes
- TreeJS object:
  - getBranch(id): get branch (sub tree) from a node
  - getNodesOfBranch(id): get all nodes are descendant of a node. Result include current node.
- TreeNode object:
  - getPath(): get path direct to root
  - getParent(): get parent of current node
  - setParent(patent: TreeNode): set parent of current node. This action also adds current node to children list of parent.
  - addChild(...children): add child/children to node.This action also sets current node as parent of added child/children
  - inheritPath(): refresh path of current node by inherit from parent
  - visitAncestors(): refresh path by visit all ancestors
  - visitDescendants(): refresh path of all descendants

## [1.1.4] - 2021-10-19
### Added
- Sorting

## [1.1.3] - 2021-02-02
### Added
- Testing

### Changed
- Improve performance
  
## [1.1.2] - 2020-12-30
### Fixed
- Customize children's field name is not correct at tree deeper than 1 level.

## [1.1.0] - 2020-12-29
### Added
- Option object:
  - childrenFieldName: (default: 'children') custome children's field name.
  - cloneDeep: (default: false) if true, clone deep nodes.

## [1.0.0] - 2020-12-29
### Added
- Option object:
  - childrenFieldName: (default: 'children') custome children's field name.
  - cloneDeep: (default: false) if true, clone deep nodes.