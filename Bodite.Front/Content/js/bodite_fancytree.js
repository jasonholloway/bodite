



$.ui.fancytree.registerExtension({
    name: "bodite_fancytree",
    version: "0.1.0",

    nodeRender: function (ctx, force, deep, collapsed, _recursive) {

        /* This method must take care of all cases where the current data mode
         * (i.e. node hierarchy) does not match the current markup.
         *
         * - node was not yet rendered:
         *   create markup
         * - node was rendered: exit fast
         * - children have been added
         * - children have been removed
         */
        var childLI, childNode1, childNode2, i, l, next, subCtx,
            node = ctx.node,
            tree = ctx.tree,
            opts = ctx.options,
            aria = opts.aria,
            firstTime = false,
            parent = node.parent,
            isRootNode = !parent,
            children = node.children,
            successorLi = null;

        if (!isRootNode && !parent.ul) {
            // Calling node.collapse on a deep, unrendered node
            return;
        }
        //_assert(isRootNode || parent.ul, "parent UL must exist");

        // Render the node
        if (!isRootNode) {
            // Discard markup on force-mode, or if it is not linked to parent <ul>
            if (node.li && (force || (node.li.parentNode !== node.parent.ul))) {
                if (node.li.parentNode === node.parent.ul) {
                    // #486: store following node, so we can insert the new markup there later
                    successorLi = node.li.nextSibling;
                } else {
                    // May happen, when a top-level node was dropped over another
                    this.debug("Unlinking " + node + " (must be child of " + node.parent + ")");
                }
                //	            this.debug("nodeRemoveMarkup...");
                this.nodeRemoveMarkup(ctx);
            }

            // Create <li><span /> </li>
            //			node.debug("render...");
            if (!node.li) {
                //	            node.debug("render... really");
                firstTime = true;
                node.li = document.createElement("li");
                node.li.ftnode = node;
                if (aria) {
                    // TODO: why doesn't this work:
                    //					node.li.role = "treeitem";
                    //                    $(node.li).attr("role", "treeitem")
                    //                    .attr("aria-labelledby", "ftal_" + node.key);
                }
                if (node.key && opts.generateIds) {
                    node.li.id = opts.idPrefix + node.key;
                }
                node.span = document.createElement("span");
                node.span.className = "fancytree-node";
                if (aria) {
                    $(node.span).attr("aria-labelledby", "ftal_" + node.key);
                }
                node.li.appendChild(node.span);

                // Create inner HTML for the <span> (expander, checkbox, icon, and title)
                this.nodeRenderTitle(ctx);
                
                node.divBefore = document.createElement("div");
                node.divBefore.className = 'before';
                node.li.appendChild(node.divBefore);
                
                node.divMain = document.createElement("div");
                node.li.appendChild(node.divMain);
   
                node.divAfter = document.createElement("div");
                node.divAfter.className = 'after';
                node.li.appendChild(node.divAfter);


                // Allow tweaking and binding, after node was created for the first time
                if (opts.createNode) {
                    opts.createNode.call(tree, { type: "createNode" }, ctx);
                }
            } else {
                //				this.nodeRenderTitle(ctx);
                this.nodeRenderStatus(ctx);
            }

            // Allow tweaking after node state was rendered
            if (opts.renderNode) {
             //   opts.renderNode.call(tree, { type: "renderNode" }, ctx);
            }
        }



        if (children) {
            if (isRootNode || node.expanded || deep === true) {
                
                if (!node.ul) {
                    node.ul = document.createElement("ul");
                    if ((collapsed === true && !_recursive) || !node.expanded) {
                        // hide top UL, so we can use an animation to show it later
                        node.ul.style.display = "none";
                    }
                    if (aria) {
                        $(node.ul).attr("role", "group");
                    }

                    node.divMain.appendChild(node.ul);
                }

                for (var child of children) {
                    subCtx = $.extend({}, ctx, { node: child });
                    this.nodeRender(subCtx, force, deep, false, true);
                }

                // Remove <li> if nodes have moved to another parent - so it renders then removes??? ARGH.
                childLI = node.ul.firstChild;
                while (childLI) {
                    childNode2 = childLI.ftnode;
                    if (childNode2 && childNode2.parent !== node) {
                        node.debug("_fixParent: remove missing " + childNode2, childLI);
                        next = childLI.nextSibling;
                        childLI.parentNode.removeChild(childLI);
                        childLI = next;
                    } else {
                        childLI = childLI.nextSibling;
                    }
                }
                // Make sure, that <li> order matches node.children order.
                childLI = node.ul.firstChild;
                for (i = 0, l = children.length - 1; i < l; i++) {
                    childNode1 = children[i];
                    childNode2 = childLI.ftnode;
                    if (childNode1 !== childNode2) {
                        // node.debug("_fixOrder: mismatch at index " + i + ": " + childNode1 + " != " + childNode2);
                        node.ul.insertBefore(childNode1.li, childNode2.li);
                    } else {
                        childLI = childLI.nextSibling;
                    }
                }
            }
        } else {
            // No children: remove markup if any
            if (node.ul) {
                //				alert("remove child markup for " + node);
                this.warn("remove child markup for " + node);
                this.nodeRemoveChildMarkup(ctx);
            }
        }

        if (!isRootNode) {
            // Update element classes according to node state
            // this.nodeRenderStatus(ctx);
            // Finally add the whole structure to the DOM, so the browser can render
            if (firstTime) {
                // #486: successorLi is set, if we re-rendered (i.e. discarded)
                // existing markup, which  we want to insert at the same position.
                // (null is equivalent to append)
                //				parent.ul.appendChild(node.li);
                parent.ul.insertBefore(node.li, successorLi);
            }
        }
    }
})
