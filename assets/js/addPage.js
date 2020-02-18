'use strict';

let lastTarget = null;
const quillEditorHtml = ` <div>
    <span class="ql-formats">
      <button class="ql-header" value="1"></button>
      <button class="ql-header" value="2"></button>
      <button class="ql-code-block"></button>
    </span>
    <span class="ql-formats" >
        <select class="ql-size">
            <option value="small"></option>
            <option selected></option><!-- Note a missing, thus falsy value, is used to reset to default -->
            <option value="large"></option>
            <option value="huge"></option>
        </select>
        <button class="ql-bold"></button>
        <button type="button" class="ql-italic"></button>
        <button type="button" class="ql-underline"></button>
    </span>
        <span class="ql-formats">
            <button type="button" class="ql-indent" value="-1"></button>
            <button type="button" class="ql-indent" value="+1"></button>
            <select class="ql-align">
                <option selected="selected"></option>
                <option value="center"></option>
                <option value="right"></option>
                <option value="justify"></option>
            </select>
            <button type="button" class="ql-direction" value="rtl"></button>
            <button type="button" class="ql-list" value="ordered"></button>
            <button type="button" class="ql-list" value="bullet"></button>
        </span>
        <span class="ql-formats">
          <select class="ql-color"></select>
          <select class="ql-background"></select>
        </span>
        <span class="ql-formats">
            <button type="button" class="ql-image"></button>
            <button type="button" class="ql-code-block"></button>
            <button type="button" class="ql-script" value="sub"></button>
            <button type="button" class="ql-script" value="super"></button>
            <button type="button" class="ql-clean"></button>
        </span>
            </div >`;
$(document).ready(() => {
    if ($('#layout').length === 1) {
        applyLayout();
    }
    $('#layout').change(applyLayout);
    $('.gridLayoutContainerAddPage').on('click', '.text', (e) => {
        changeBox(e);
    });
    $('#page-form').submit((e) => {
        e.preventDefault();
        // Serialize the form data.

        const lastText = $('#quill .ql-editor').html();
        if (lastText !== '') {
            $(lastTarget).empty();
            $(lastTarget).html(lastText);
            $(lastTarget).addClass('ql-editor');
        }
        const formData = $('#page-form').serializeArray().reduce((obj, item) => {
            obj[item.name] = item.value; // eslint-disable-line no-param-reassign
            return obj;
        }, {});
        console.log(formData);
        const content = $('.gridLayoutContainer').html();
        $.ajax({
            type: 'POST',
            url: '/admin/pages/addPage',
            data: { content, form: formData },
            success(callback) {
                window.location.href = '/admin/pages/';
            }
        });
    });
});

function applyLayout() {
    const name = $('#layout option:selected').text();
    console.log(name);
    $.ajax({
        type: 'POST',
        url: '/admin/findLayout',
        data: { layout: name },
        success(callback) {
            $('.gridLayoutContainer').empty();
            const row = 0;
            const index = 0;
            const data = callback[index];
            /* data.columns.forEach((column) => {
                displayGridLayout(column);
            });*/
            $('.gridLayoutContainer').html(data.gridLayout);
            $('.width').each(function(e) {
                $(this).remove();
            });
            $('textarea').attr('style', 'display:block');
        }
    });
}
function changeBox(e) {
    if (e.currentTarget !== lastTarget) {
        console.log(e);
        console.log(lastTarget);
        const lastText = $('#quill .ql-editor').html();
        const lastCSS = $('#quill .ql-editor').html();
        if (lastText !== '') {
            $(lastTarget).empty();
            $(lastTarget).html(lastText);
            $(lastTarget).addClass('ql-editor');
        }

        const currentText = $(e.currentTarget).html();
        $(e.currentTarget).removeClass('ql-editor');
        $(e.currentTarget).empty();
        /* $('body').append(`<div id ='dialog'>${$(e.target).text()}</div>`);
        $('#dialog').dialog({
            title: 'Change Text',
            close() {
                $(e.target).html($('.ql-editor').html());
                $('#dialog').remove();
            }
        });*/
        $(e.currentTarget).append(`<div id='quill'>${currentText}</div>`);
        $('#editor-toolbar').empty();
        $('#editor-toolbar').html(quillEditorHtml);
        const quill = new Quill('#quill', {
            modules: {
                toolbar: '#editor-toolbar'
            },
            theme: 'snow'
        });
        $(e.currentTarget).find('.ql-editor').focus();
        lastTarget = e.currentTarget;
    }
}
