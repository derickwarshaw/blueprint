/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { assert } from "chai";
import { mount, ReactWrapper, shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { spy, stub } from "sinon";

import { MENU_WARN_CHILDREN_SUBMENU_MUTEX } from "../../src/common/errors";
import {
    Button,
    Classes,
    Icon,
    IMenuItemProps,
    IMenuProps,
    IPopoverProps,
    MenuItem,
    Popover,
    PopoverInteractionKind,
    Text,
} from "../../src/index";

describe("MenuItem", () => {
    it("React renders MenuItem", () => {
        const wrapper = shallow(<MenuItem iconName="graph" text="Graph" />);
        assert.isTrue(wrapper.find(Icon).exists());
        assert.strictEqual(findText(wrapper).text(), "Graph");
    });

    it("supports HTML props", () => {
        const func = () => false;
        const item = shallow(<MenuItem text="text" onClick={func} onKeyDown={func} onMouseMove={func} />).find("a");
        assert.strictEqual(item.prop("onClick"), func);
        assert.strictEqual(item.prop("onKeyDown"), func);
        assert.strictEqual(item.prop("onMouseMove"), func);
    });

    it("children appear in submenu", () => {
        const wrapper = shallow(
            <MenuItem iconName="style" text="Style">
                <MenuItem iconName="bold" text="Bold" />
                <MenuItem iconName="italic" text="Italic" />
                <MenuItem iconName="underline" text="Underline" />
            </MenuItem>,
        );
        const submenu = findSubmenu(wrapper);
        assert.lengthOf(submenu.props.children, 3);
    });

    it("submenu props appear as MenuItems in submenu", () => {
        const items: IMenuItemProps[] = [
            { iconName: "align-left", text: "Align Left" },
            { iconName: "align-center", text: "Align Center" },
            { iconName: "align-right", text: "Align Right" },
        ];
        const wrapper = shallow(<MenuItem iconName="align-left" text="Alignment" submenu={items} />);
        const submenu = findSubmenu(wrapper);
        assert.lengthOf(submenu.props.children, items.length);
    });

    it("disabled MenuItem will not show its submenu", () => {
        const wrapper = shallow(
            <MenuItem disabled={true} iconName="style" text="Style">
                <MenuItem iconName="bold" text="Bold" />
                <MenuItem iconName="italic" text="Italic" />
                <MenuItem iconName="underline" text="Underline" />
            </MenuItem>,
        );
        assert.isTrue(wrapper.find(Popover).prop("disabled"));
    });

    it("disabled MenuItem blocks mouse listeners", () => {
        const mouseSpy = spy();
        mount(<MenuItem disabled={true} text="disabled" onClick={mouseSpy} onMouseEnter={mouseSpy} />)
            .simulate("click")
            .simulate("mouseenter")
            .simulate("click");
        assert.strictEqual(mouseSpy.callCount, 0);
    });

    it("renders children if given children and submenu", () => {
        const warnSpy = stub(console, "warn");
        const wrapper = shallow(
            <MenuItem iconName="style" text="Style" submenu={[{ text: "foo" }]}>
                <MenuItem text="one" />
                <MenuItem text="two" />
            </MenuItem>,
        );
        const submenu = findSubmenu(wrapper);
        assert.lengthOf(submenu.props.children, 2);
        assert.isTrue(warnSpy.alwaysCalledWith(MENU_WARN_CHILDREN_SUBMENU_MUTEX));
        warnSpy.restore();
    });

    it("Clicking MenuItem triggers onClick prop", () => {
        const onClick = spy();
        shallow(<MenuItem text="Graph" onClick={onClick} />)
            .find("a")
            .simulate("click");
        assert.isTrue(onClick.calledOnce);
    });

    it("Clicking disabled MenuItem does not trigger onClick prop", () => {
        const onClick = spy();
        shallow(<MenuItem disabled={true} text="Graph" onClick={onClick} />)
            .find("a")
            .simulate("click");
        assert.isTrue(onClick.notCalled);
    });

    it("shouldDismissPopover=false prevents a clicked MenuItem from closing the Popover automatically", () => {
        const handleClose = spy();
        const menu = <MenuItem text="Graph" shouldDismissPopover={false} />;
        const wrapper = mount(
            <Popover content={menu} isOpen={true} onInteraction={handleClose}>
                <Button />
            </Popover>,
        );
        wrapper
            .find(MenuItem)
            .find("a")
            .simulate("click");
        assert.isTrue(handleClose.notCalled);
    });

    it("popoverProps (except content) are forwarded to Popover", () => {
        // Ensures that popover props are passed to Popover component, except content property
        const popoverProps: Partial<IPopoverProps> = {
            content: "CUSTOM_CONTENT",
            interactionKind: PopoverInteractionKind.CLICK,
            popoverClassName: "CUSTOM_POPOVER_CLASS_NAME",
        };
        const wrapper = shallow(
            <MenuItem iconName="style" text="Style" popoverProps={popoverProps}>
                <MenuItem text="one" />
                <MenuItem text="two" />
            </MenuItem>,
        );
        assert.strictEqual(wrapper.find(Popover).prop("interactionKind"), popoverProps.interactionKind);
        assert.notStrictEqual(
            wrapper
                .find(Popover)
                .prop("popoverClassName")
                .indexOf(popoverProps.popoverClassName),
            0,
        );
        assert.notStrictEqual(wrapper.find(Popover).prop("content"), popoverProps.content);
    });

    it("multiline prop determines if long content is ellipsized", () => {
        const wrapper = mount(
            <MenuItem multiline={false} text="multiline prop determines if long content is ellipsized." />,
        );
        function assertOverflow(expected: boolean) {
            assert.strictEqual(findText(wrapper).hasClass(Classes.TEXT_OVERFLOW_ELLIPSIS), expected);
        }

        assertOverflow(true);
        wrapper.setProps({ multiline: true });
        assertOverflow(false);
    });

    it("label and labelElement are rendered in .pt-menu-item-label", () => {
        const wrapper = shallow(
            <MenuItem text="text" label="label text" labelElement={<article>label element</article>} />,
        );
        const label = wrapper.find(`.${Classes.MENU_ITEM_LABEL}`);
        assert.match(label.text(), /^label text/);
        assert.strictEqual(label.find("article").text(), "label element");
    });
});

function findSubmenu(wrapper: ShallowWrapper<any, any>) {
    return wrapper.find(Popover).prop("content") as React.ReactElement<
        IMenuProps & { children: Array<React.ReactElement<IMenuItemProps>> }
    >;
}

function findText(wrapper: ShallowWrapper | ReactWrapper) {
    return wrapper.find(Text).children();
}
