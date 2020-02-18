'use strict';
$(document).ready(() => {
    const $saveGridLayout = $('#saveGridLayout');
    $saveGridLayout.hide();

    $(document)
        .ready(() => {
            $('body')
                .tooltip({ selector: '[data-toggle=tooltip]' });
        });

    function checkWidth(width) { width = parseFloat(width); if (Math.round(width) !== width) width.toFixed(2).replace('.', ','); return width; }

    let rows = 0;
    const columns = [];

    // Grid Layout Template
    const gridLayoutTemplate = (id, rows, cols) => {
        const range = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        const gridLayoutContainer = $('.gridLayoutContainer');
        gridLayoutContainer.attr('data-id', id);
        const row = $('<div>')
            .attr({
                class: 'row',
                'data-id': `row-${rows}`
                // ,style: `height: ${950 / rows}px;`
            });
        for (let j = 1; j <= cols; j++) {
            const col = $('<div>')
                .attr({
                    class: 'col ' + ' p-2 border',
                    'data-id': `col-${rows}-${j}`
                });
            const textareaContainer = $('<div>')
                .attr({
                    class: 'form-group text ql-editor'
                });
            const colTextarea = $('<textarea>')
                .attr({
                    style: 'display:none',
                    class: 'form-control',
                    id: `textarea-${rows}-${j}`
                });
            const selectContainer = $('<div>')
                .attr({
                    class: 'form-group select-container width'
                });
            const widthSelector = $('<select>')
                .attr({
                    class: 'form-control widthSelector mr-2',
                    id: `select-${rows}-${j}`,
                    'data-id': `select-${rows}-${j}`
                });
            const deleteButton = $('<button>')
                .attr({
                    class: 'btn btn-secondary float-right mb-2',
                    type: 'button',
                    'data-id': `btn-${rows}-${j}`,
                    'data-toggle': 'tooltip',
                    'data-placement': 'top',
                    title: 'Delete this column'
                });
            deleteButton.html('x');
            const defaultWidth = 100 / cols;
            const defaultOption = $('<option>')
                .text(`${checkWidth(defaultWidth)} %`);
            widthSelector.append(defaultOption);
            for (let n = 0; n < range.length; n++) {
                if (range[n] !== defaultWidth) {
                    const option = $('<option>')
                        .text(`${range[n]} %`);
                    widthSelector.append(option);
                }
            }
            row.append(col.append(
                deleteButton, selectContainer.append(widthSelector),
                textareaContainer.append(colTextarea)
            ));
            gridLayoutContainer.append(row);
        }
        return gridLayoutContainer;
    };

    const displayGridLayout = (layout) => {
        // $('.gridLayoutContainer').empty();
        // const {rows} = layout;
        const $gridLayout = $('.gridLayoutContainer');
        const id = $gridLayout.attr('data-id');
        const cols = layout;
        columns.push(cols);
        const newGridLayout = gridLayoutTemplate(id, rows, cols);
    };

    const displayGridLayoutFail = (response) => {
        alert('Failed to generate Grid Layout');
    };

    $('#addRow')
        .on('click', (event) => {
            event.preventDefault();
            console.log("Hey");
            // const rows = $('input[name="rows"]').val();
            const cols = $('input[name="columns"]')
                .val();
            rows++;
            console.log(rows);
            if (cols === '') {
                console.log('Please enter values');
            } else {
                displayGridLayout(cols);
            }
        });
    $('#saveLayout')
        .on('click', (event) => {
            event.preventDefault();
            const layoutName = $('input[name="layoutName"]')
                .val();
            const $gridLayout = $('.gridLayoutContainer')
                .clone();
            console.log($gridLayout);
            $gridLayout.find('.widthSelector')
                .remove();
            $gridLayout.find('.select-container')
                .remove();
            $gridLayout.find('.btn')
                .remove();
            const gridLayout = $gridLayout.html();
            // gridLayout = $(gridLayout).find('.widthSelector').remove();
            // gridLayout = $($.parseHTML(gridLayout)).filter('.select-container').remove();
            $.ajax({
                url: '/admin/layout/createLayout/add',
                method: 'POST',
                data: {
                    layoutName,
                    rows,
                    columns,
                    gridLayout
                }
            });
        });

    function adjustGridLayout() {
        const id = $(this).attr('data-id');
        const idSplit = id.split('-');
        const currentRow = idSplit[1];
        const currentColumn = idSplit[2];
        const cols = columns[currentRow - 1];
        const selectedWidth = $(this).val().split(' ')[0];
        const selectedCol = Math.round(12 * selectedWidth / 100);
        console.log(`selectedWidth: ${selectedWidth}`);
        const leftWidthEach = (100 - selectedWidth) / (cols - 1);
        console.log(`leftWidthEach: ${leftWidthEach}`);
        // const leftColEach = Math.floor(Math.round(12 * ((100 - selectedWidth) / 100)) / (cols - 1));
        // console.log(`leftColEach: ${leftColEach}`);

        console.log(`idSplit: ${idSplit}`);
        console.log(`currentRow: ${currentRow}`);
        console.log(`currentColumn: ${currentColumn}`);

        const range = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        const $row = $('div').find(`[data-id=row-${currentRow}]`);

        for (let i = 1; i <= cols; i++) {
            // Current row of col i
            const $selectCurrentRow = $(`#select-${currentRow}-${i}`);
            // Find all cols of current row
            const $SelectCurrentCol = $selectCurrentRow
                .closest('div[class*="col"]');

            // Delete all available width options in each col i
            $selectCurrentRow
                .find('option')
                .remove();

            $selectCurrentRow
                .attr('class', 'form-control widthSelector')
                .attr('id', `select-${currentRow}-${i}`)
                .attr('data-id', `select-${currentRow}-${i}`);

            if (i != currentColumn) {
                // Left width in % for remaining cols except current col
                const leftWidthColumn = $('<option>').text(`${checkWidth(leftWidthEach)} %`);

                $selectCurrentRow
                    .append(leftWidthColumn);

                // set all cols except selected col
                $SelectCurrentCol.attr('class', 'col p-2 border');
            } else {
                // set new col width for selected col
                $SelectCurrentCol.attr('class', `col-${selectedCol} p-2 border`);

                const selectedWidthCol = $('<option>').text(`${checkWidth(selectedWidth)} %`);
                $selectCurrentRow
                    .append(selectedWidthCol);
            }
            for (let n = 0; n < range.length; n++) {
                // avoid duplicate width in select options
                if (range[n] != selectedWidth) {
                    const option = $('<option>')
                        .text(`${range[n]} %`);
                    $selectCurrentRow
                        .append(option);
                }
            }

            // console.log(`i: ${i}, currentCol: ${currentColumn}`);
            // console.log(i != currentColumn);
        }
    }

    $(document)
        .on('change', '.widthSelector', adjustGridLayout);

    $saveGridLayout.on('click', (event) => {
        event.preventDefault();
        const $gridLayout = $('.gridLayoutContainer');
        const id = $gridLayout.attr('data-id');
        $('.widthSelector')
            .remove();
        $('.select-container')
            .remove();
        $('textarea')
            .attr('style', 'display:block');
        const gridLayout = $('<div />')
            .append($gridLayout.clone())
            .html();
        const dataToSend = JSON.stringify({ id, gridLayout });
        $.ajax({
            url: '/admin/layout/createLayout/saveGridLayout',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: dataToSend
        })
            .then(() => {
                alert('success');
            })
            .catch(() => {
                alert('fail');
            });
    });


    /**
     * Load GridLayout
     *
     * -->move to addPage.js
     */
    const displayLoadedGridLayout = (layout) => {
        const gridLayoutContainer = layout.gridLayout;
        $('.gridLayoutLoadPreview')
            .prepend(gridLayoutContainer);
    };

    const displayLoadedGridLayoutFail = (response) => {
        alert('Failed to load GridLayout');
    };

    $('#loadGridLayout')
        .on('click', (event) => {
            event.preventDefault();
            const $gridLayout = $('.gridLayoutContainer');
            const id = $gridLayout.attr('data-id');
            $.ajax({
                url: '/admin/layout/createLayout/loadLayout',
                method: 'POST',
                data: {
                    id
                }
            })
                .then(displayLoadedGridLayout)
                .catch(displayLoadedGridLayoutFail);
        });
});
