'use strict';

function deleteBorder() {
    $('#showContent').find('.border').removeClass('border');
    $('#showContent').find('textarea').remove();
}

$(document).ready(() => {
    if ($('#showContent').length === 1) {
        deleteBorder();
    }
});
