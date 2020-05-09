var template = function(idx){
    return `
        <div class="form-row">
            <div class="form-group col-md-11">
                <input class="form-control" name="b${idx}" placeholder="barcode">
            </div>
            <div class="form-group col-md-1">
                <input class="form-control" name="q${idx}" placeholder="quantity">
            </div>
        </div>
`
}

$(document).ready(() => {
    idx = 0;
    $('#add-product-field').click(() => {
        $('#product-list').append($(template(idx)));
        idx += 1;
    });
});