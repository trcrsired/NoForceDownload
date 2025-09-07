// baijiahao.js

const selectors = [
    "#routerView > div > div.app_content > div.readerFooter > div > button.readerFooter_button.blue",
    "#routerView > div > div.readerBottomBar.showShadow.active > div.readerBottomBar_content > button.wr_btn.wr_btn_Big.rbb_addShelf",
];

function removeSelectors() {
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(node => {
            node.remove();
        });
    });
    document.querySelectorAll("div.wr_index_page_header_download_wrapper").forEach(node => {
    node.style.visibility = "hidden";
    node.style.pointerEvents = "none";});
}

function observeDOMChanges() {
    removeSelectors();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => removeSelectors());
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

removeSelectors();
window.addEventListener('DOMContentLoaded', observeDOMChanges);

window.addEventListener('load', observeDOMChanges);
