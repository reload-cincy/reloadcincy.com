/**
 * @function sanityBlockContent
 * @description Renders out a Sanity Block Content Node. Created as a
 * replacement to the Sanity team's "Portable Text" render libraries.
 * @param {HTMLElement} renderNode The node that will be modified with the
 * sanity block content
 * @param {Object[]} block The array of block data
 * @see https://github.com/portabletext/to-html/blob/main/package.json for a
 * library that is a more feature complete way to do this, and the library I
 * am replacing, since I don't want to use any dependencies.
 *
 * @copyright 2023 Alexander Burdiss
 * @author Alexander Burdiss
 * @since 2/12/23
 * @version 1.0.0
 */
function sanityBlockContent(renderNode, block) {
  renderNode.innerHTML = '';

  let isInList = false;
  let listParent = null;

  block.forEach((item) => {
    if (item._type === 'block') {
      const style = item.style;
      const linkData = item.markDefs;
      const parentTag = (() => {
        if (item.listItem === 'bullet') {
          if (!isInList) {
            listParent = document.createElement('ul');
            renderNode.appendChild(listParent);
          }
          isInList = true;
          return 'li';
        }

        isInList = false;
        if (style === 'normal') {
          return 'p';
        }
        return style;
      })();
      const parent = document.createElement(parentTag);

      item.children.map((child) => {
        const text = child.text;
        if (child.marks.length) {
          // This is an anchor and needs attached to its data in the parent;
          const href = linkData.find(
            (item) => item._key === child.marks[0]
          )?.href;
          const link = document.createElement('a');
          link.href = href;
          link.innerText = text;
          parent.appendChild(link);
        } else {
          const span = document.createElement('span');
          span.innerText = text;
          parent.appendChild(span);
        }
      });
      if (isInList) {
        listParent.appendChild(parent);
      } else {
        renderNode.appendChild(parent);
      }
    }
  });
}
