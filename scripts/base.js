$(document).ready(function () {
    registerFallback();
    registerQuillRender();
    renderTimeAgo();
    registerDropdown();
    registerTooltips();
    registerButtons();
    registerSyntaxHighlight();
});

function registerFallback() {
    // Register fallback image sources
    $('img[data-failover]').on("error", function () {
        // Fetch the fail url
        var failover = $(this).data('failover');

        // Assign only if we haven't yet
        if (this.src != failover)
            this.src = failover;
    });
}

function renderTimeAgo() {
    // Render elements
    timeago().render($('.timeago-render'));
    // No real-time updates
    timeago.cancel();
}

function registerDropdown() {
    // Find all root .dropdown and register click events
    $('.dropdown').click(function () {
        if ($(this).hasClass('drop-active')) {
            $(this).removeClass('drop-active');
        } else {
            $(this).addClass('drop-active');
        }
    });
    // Handle closing when clicked outside
    $(document).click(function (event) {
        if (!$(event.target).closest('.dropdown').length) {
            if ($('.dropdown').hasClass('drop-active')) {
                $('.dropdown').removeClass('drop-active');
            }
        }
    });
}

function registerTooltips() {
    // Find .tooltip-render and register styles
    $('.tooltip-render').tooltipster({
        theme: 'tooltipster-borderless'
    });
}

function registerButtons() {
    // Find core button controls and register events
    $('.btn-view-source').click(viewQuillSrc);
}

function registerQuillRender() {
    // Find and render quill targets
    $('.ql-editor-page').each(function () {
        try {
            var tempOps = $(this).text();
            $(this).html(getQuillRender(tempOps));
            $(this).data('quill-src', tempOps);
            $(this).addClass('render');
        } catch (err) {
            $(this).html('<p>This content was invalid :(</p>');
            $(this).addClass('render');
        }
    });
}

function registerSyntaxHighlight() {
    // Find and render syntax
    $('.ql-syntax').each(function () {
        hljs.highlightBlock(this);
    });
}

function getQuillRender(inputDelta) {
    // Render quill data
    var tempElem = document.createElement('div');
    var tempTool = document.createElement('div');
    var tempQuill = new Quill(tempElem, {
        modules: {
            syntax: true,
            toolbar: tempTool,
        },
        theme: 'snow'
    });
    tempQuill.setContents(JSON.parse(inputDelta));
    return tempQuill.root.innerHTML;
}

function viewQuillSrc() {
    var tempPID = $(this).attr('data-pid');
    var srcElem = $('.ql-post-' + tempPID);

    // Determine state
    if (srcElem.is(":visible")) {
        // Setup source
        var quillSrc = srcElem.data('quill-src');

        // Hide the element
        srcElem.hide();

        // Build the new one
        var parentTarget = srcElem.parent();
        var srcData = '';

        // Pretty print it
        try {
            srcData = JSON.stringify(JSON.parse(quillSrc), null, 2);
        } catch (err) {
            srcData = '';
        }

        // Append element
        parentTarget.append('<div class="ql-src-view">' + srcData + '</div>');
    } else {
        // Undo src
        srcElem.parent().find('.ql-src-view').remove();
        srcElem.show();
    }
}