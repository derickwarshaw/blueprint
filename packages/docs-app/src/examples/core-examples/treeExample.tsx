/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, Icon, ITreeNode, Tooltip, Tree } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";

export interface ITreeExampleState {
    nodes: ITreeNode[];
}

export class TreeExample extends BaseExample<ITreeExampleState> {
    public state: ITreeExampleState = { nodes: INITIAL_STATE };

    // override @PureRender because nodes are not a primitive type and therefore aren't included in
    // shallow prop comparison
    public shouldComponentUpdate() {
        return true;
    }

    protected renderExample() {
        return (
            <Tree
                contents={this.state.nodes}
                onNodeClick={this.handleNodeClick}
                onNodeCollapse={this.handleNodeCollapse}
                onNodeExpand={this.handleNodeExpand}
                className={Classes.ELEVATION_0}
            />
        );
    }

    private handleNodeClick = (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
        const originallySelected = nodeData.isSelected;
        if (!e.shiftKey) {
            this.forEachNode(this.state.nodes, n => (n.isSelected = false));
        }
        nodeData.isSelected = originallySelected == null ? true : !originallySelected;
        this.setState(this.state);
    };

    private handleNodeCollapse = (nodeData: ITreeNode) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    };

    private handleNodeExpand = (nodeData: ITreeNode) => {
        nodeData.isExpanded = true;
        this.setState(this.state);
    };

    private forEachNode(nodes: ITreeNode[], callback: (node: ITreeNode) => void) {
        if (nodes == null) {
            return;
        }

        for (const node of nodes) {
            callback(node);
            this.forEachNode(node.childNodes, callback);
        }
    }
}

/* tslint:disable:object-literal-sort-keys so childNodes can come last */
const INITIAL_STATE: ITreeNode[] = [
    {
        id: 0,
        hasCaret: true,
        iconName: "folder-close",
        label: "Folder 0",
    },
    {
        id: 1,
        iconName: "folder-close",
        isExpanded: true,
        label: <Tooltip content="I'm a folder <3">Folder 1</Tooltip>,
        childNodes: [
            {
                id: 2,
                iconName: "document",
                label: "Item 0",
                secondaryLabel: (
                    <Tooltip content="An eye!">
                        <Icon iconName="eye-open" />
                    </Tooltip>
                ),
            },
            {
                id: 3,
                iconName: "tag",
                label: "Organic meditation gluten-free, sriracha VHS drinking vinegar beard man.",
            },
            {
                id: 4,
                hasCaret: true,
                iconName: "folder-close",
                label: <Tooltip content="foo">Folder 2</Tooltip>,
                childNodes: [
                    { id: 5, label: "No-Icon Item" },
                    { id: 6, iconName: "tag", label: "Item 1" },
                    {
                        id: 7,
                        hasCaret: true,
                        iconName: "folder-close",
                        label: "Folder 3",
                        childNodes: [
                            { id: 8, iconName: "document", label: "Item 0" },
                            { id: 9, iconName: "tag", label: "Item 1" },
                        ],
                    },
                ],
            },
        ],
    },
];
/* tslint:enable:object-literal-sort-keys */
