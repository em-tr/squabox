'use strict';

$('.all-layouts .layout button').on('click', function() {
    const id = $(this).attr('data-id');

    $.ajax({
        url: `/admin/layout/delete/${id}`,
        method: 'DELETE'
    })
        .then(() => {
            $(`.all-layouts .layout[data-id="${id}"]`).remove();
        })
        .catch(() => {
            alert('failed to delete Layout');
        });
});

$('#editLayout').on('click', function() {
    const id = $(this).attr('data-id');

    $.ajax({
        url: `/admin/layout/edit/${id}`,
        method: 'GET'
    });
});
