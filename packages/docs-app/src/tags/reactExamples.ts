/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IBaseExampleProps, IExampleMap } from "@blueprintjs/docs-theme";
import * as React from "react";

// tslint:disable no-submodule-imports
import * as CoreExamples from "../examples/core-examples";
import * as DateExamples from "../examples/datetime-examples";
import * as SelectExamples from "../examples/select-examples";
import * as TableExamples from "../examples/table-examples";
import * as TimezoneExamples from "../examples/timezone-examples";

import { getTheme } from "../components/blueprintDocs";

const SRC_HREF_BASE = "https://github.com/palantir/blueprint/blob/develop/packages/docs-app/src/examples";

export const reactExamples: IExampleMap = {};

function addPackageExamples(
    packageName: string,
    packageExamples: { [name: string]: React.ComponentClass<IBaseExampleProps> },
) {
    for (const exampleName of Object.keys(packageExamples)) {
        const example = packageExamples[exampleName];
        const fileName = exampleName.charAt(0).toLowerCase() + exampleName.slice(1) + ".tsx";
        reactExamples[exampleName] = {
            render: props => React.createElement(example, { ...props, themeName: getTheme() }),
            sourceUrl: [SRC_HREF_BASE, `${packageName}-examples`, fileName].join("/"),
        };
    }
}

addPackageExamples("core", CoreExamples as any);
addPackageExamples("datetime", DateExamples as any);
addPackageExamples("select", SelectExamples as any);
addPackageExamples("table", TableExamples as any);
addPackageExamples("timezone", TimezoneExamples as any);
