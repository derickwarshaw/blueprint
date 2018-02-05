/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Classes, Icon, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";

export class MenuExample extends BaseExample<{}> {
    public className = "docs-menu-example";
    protected renderExample() {
        return (
            <div>
                <Menu className={`docs-inline-example ${Classes.ELEVATION_1}`}>
                    <MenuItem iconName="new-text-box" text="New text box" />
                    <MenuItem iconName="new-object" text="New object" />
                    <MenuItem iconName="new-link" text="New link" />
                    <MenuDivider />
                    <MenuItem iconName="cog" labelElement={<Icon iconName="share" />} text="Settings..." />
                </Menu>
                <Menu className={`docs-inline-example ${Classes.ELEVATION_1}`}>
                    <MenuDivider title="Edit" />
                    <MenuItem iconName="cut" text="Cut" label="⌘X" />
                    <MenuItem iconName="duplicate" text="Copy" label="⌘C" />
                    <MenuItem iconName="clipboard" text="Paste" label="⌘V" disabled={true} />
                    <MenuDivider title="Text" />
                    <MenuItem disabled={true} iconName="align-left" text="Alignment">
                        <MenuItem iconName="align-left" text="Left" />
                        <MenuItem iconName="align-center" text="Center" />
                        <MenuItem iconName="align-right" text="Right" />
                        <MenuItem iconName="align-justify" text="Justify" />
                    </MenuItem>
                    <MenuItem iconName="style" text="Style">
                        <MenuItem iconName="bold" text="Bold" />
                        <MenuItem iconName="italic" text="Italic" />
                        <MenuItem iconName="underline" text="Underline" />
                    </MenuItem>
                    <MenuItem iconName="asterisk" text="Miscellaneous">
                        <MenuItem iconName="badge" text="Badge" />
                        <MenuItem iconName="book" text="Long items will truncate when they reach max-width" />
                        <MenuItem iconName="more" text="Look in here for even more items">
                            <MenuItem iconName="briefcase" text="Briefcase" />
                            <MenuItem iconName="calculator" text="Calculator" />
                            <MenuItem iconName="dollar" text="Dollar" />
                            <MenuItem iconName="dot" text="Shapes">
                                <MenuItem iconName="full-circle" text="Full circle" />
                                <MenuItem iconName="heart" text="Heart" />
                                <MenuItem iconName="ring" text="Ring" />
                                <MenuItem iconName="square" text="Square" />
                            </MenuItem>
                        </MenuItem>
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}
