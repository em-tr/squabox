'use strict';

$(document).ready(() => {
    $('#page-edit-form').submit(function(e) {
        e.preventDefault();
        // Serialize the form data.
        const lastText = $('#quill .ql-editor').html();
        if (lastText !== '') {
            $(lastTarget).empty();
            $(lastTarget).html(lastText);
            $(lastTarget).addClass('ql-editor');
        }
        const formData = $('#page-edit-form').serializeArray().reduce((obj, item) => {
            obj[item.name] = item.value; // eslint-disable-line no-param-reassign
            return obj;
        }, {});
        console.log(formData);
        const content = $('.gridLayoutContainer').html();
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: { content, form: formData },
            success(callback) {
                window.location.href = '/admin/pages/';
            }
        });
    });

});
