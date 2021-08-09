function appendReplaceHtmlElement(newHtmlElement, parentNode) {
    var oldHtmlElement;
    if ((oldHtmlElement = document.getElementById(newHtmlElement.id)) &&
        oldHtmlElement.parentNode === parentNode) {

        parentNode.replaceChild(newHtmlElement, oldHtmlElement);
    } else {
        parentNode.appendChild(newHtmlElement);
    }
}

if (typeof FormHandler == "undefined") { // Make sure namespace isn't used.
    var FormHandler = (function() {
        var init = function() {
            jQuery.validator.addMethod(
                "compareTo",
                function(value, element, params) {

                    var num1 = parseInt(value);
                    var num2 = parseInt($('input[name="' + params[0] + '"]').val());


                    if (isNaN(num1) || isNaN(num2)) return true;

                    if (params[2]) {
                        return num1 <= num2;
                    } else {
                        return num1 >= num2;
                    }
                }, 'Maximum {1} value must be >= minimum {1} value.'); // Error messag

            $('form').validate({


                rules: {
                    multiplierMin: {
                        required: true,
                        number: true,
                        step: 1,
                        compareTo: ['multiplierMax', 'multiplier', true]
                    },
                    multiplierMax: {
                        required: true,
                        number: true,
                        step: 1,
                        compareTo: // Must be >= multiplierMin.
                            ['multiplierMin', 'multiplier', false]
                    },
                    multiplicandMin: {
                        required: true,
                        number: true,
                        step: 1,
                        compareTo: // Must be <= multiplicandMax.
                            ['multiplicandMax', 'multiplicand', true]
                    },
                    multiplicandMax: {
                        required: true,
                        number: true,
                        step: 1,
                        compareTo: // Must be >= multiplicandMin.
                            ['multiplicandMin', 'multiplicand', false]
                    }
                },

                // shows errors
                showErrors: function(error, errorMap) {
                    //plug in doing its thing
                    this.defaultShowErrors();

                    var isMaxError = false;


                    errorMap.forEach(function(error) {

                        if (error.method === 'compareTo') {

                            isMaxError = true;
                            $('#' + error.element.name + '-error').empty();
                            var type = error.element.name.slice(0, -3);
                            $('#' + type + 'Error').html(error.message);
                        }
                    });

                    if (errorMap.length === 0 || !isMaxError) {

                        this.currentElements.each(function(index, element) {
                            var type = element.name.slice(0, -3);
                            $('#' + type + 'Error').empty();
                        });
                    }
                },

                messages: {
                    multiplierMin: {
                        required: 'Value cannot be empty.',
                        number: 'Value must be an integer.',
                        step: 'Decimals not allowed. Value must be an integer.'
                    },
                    multiplierMax: {
                        required: 'Value cannot be empty.',
                        number: 'Value must be an integer.',
                        step: 'Decimals not allowed. Value must be an integer.'
                    },
                    multiplicandMin: {
                        required: 'Value cannot be empty.',
                        number: 'Value must be an integer.',
                        step: 'Decimals not allowed. Value must be an integer.'
                    },
                    multiplicandMax: {
                        required: 'Value cannot be empty.',
                        number: 'Value must be an integer.',
                        step: 'Decimals not allowed. Value must be an integer.'
                    }
                },

                submitHandler: function(form, event) {
                    event.preventDefault(); // Don't submit

                    var table = createMultTable(
                        form.elements['multiplierMin'].value,
                        form.elements['multiplierMax'].value,
                        form.elements['multiplicandMin'].value,
                        form.elements['multiplicandMax'].value);
                    appendReplaceHtmlElement(table, form);
                }

            });
        }

        return {
            init: init //Makes init accessiable
        };
    })();


    document.addEventListener('DOMContentLoaded', FormHandler.init);
};

function createMultTable(MinimumValueMultiplier, MaximumValueMultiplier) {
    var table = document.createElement('table');
    table.id = 'table';
    var firstRow = true;
    var firstCol = true;

    for (var row = MinimumValueMultiplier - 1; row <= MaximumValueMultiplier; row++) { //makes the rows!
        var tableRow = document.createElement('tr');

        for (var col = MinimumValueMultiplier - 1; col <= MaximumValueMultiplier; col++) {
            var cell;
            var cellText;
            if (firstRow) {
                cell = document.createElement('th');
                if (!firstCol) {

                    // first row wont be the first colom 
                    cellText = document.createTextNode(col);
                    cell.appendChild(cellText);
                }
            } else {
                if (firstCol) {

                    cell = document.createElement('th');
                    cellText = document.createTextNode(row);
                    cell.appendChild(cellText);

                } else {

                    // put multiplier * multiplicand in a <td>.
                    cell = document.createElement('td');
                    cellText = document.createTextNode(row * col);
                    cell.appendChild(cellText);
                }
            }
            tableRow.appendChild(cell);
            firstCol = false; // add cells
        }
        table.appendChild(tableRow); // add rows
        firstRow = false;
        firstCol = true;
    }
    return table;
}