
var row_id = 0;

var subtype_colour_code = {
    "nvs": "#ebab34",
    "ota": "#3483eb",
    "phy": "#eb345e",
    "factory": "#34eb5e",
    "nvs_keys": "#ebe834",
    "ota_0": "#e4bbee",
    "ota_1": "#dca7ea",
    "ota_2": "#d594e5",
    "ota_3": "#cd80e0",
    "ota_4": "#c56ddb",
    "ota_5": "#be59d6",
    "ota_6": "#b646d2",
    "ota_7": "#ae32cd",
    "ota_8": "#9e2db9",
    "ota_9": "#8d28a6",
    "ota_10": "#7d2492",
    "ota_11": "#6c1f7f",
    "ota_12": "#5b1a6b",
    "ota_13": "#4b1558",
    "ota_14": "#3a1144",
    "ota_15": "#2a0c31",
}

function addPartitionTableRow(partition_data=null)
{
    var partition_table = document.getElementById("partition-table");
    
    // add new row
    var row = partition_table.insertRow(-1);
    row.dataset.rowId = row_id;
    
    // add drag handle cell
    // var cell_drag = row.insertCell(-1);
    // cell_drag.innerHTML = '<i class="fa fa-bars" aria-hidden="true"></i>';
    // cell_drag.classList.add("drag-handle");
    
    // add name cell
    var cell_name = row.insertCell(-1)
    var name_field = document.createElement("input")
    name_field.id = "name-field-" + row_id;
    name_field.type = "text"
    name_field.size = 5
    name_field.maxLength = 16
    if (partition_data) name_field.value = partition_data[0].trim();
    // name_field.placeholder = "ota_0";
    name_field.classList.add("form-control");
    name_field.classList.add("partition-name-input");
    name_field.addEventListener("input", e => {
        resetGraphicalPartition();
    })
    cell_name.appendChild(name_field)
    
    // add type field
    var cell_type = row.insertCell(-1);
    var type_field = document.createElement("input");
    type_field.id = "type-field-" + row_id;
    type_field.size = 5;
    type_field.type = "list";
    if (partition_data) type_field.value = partition_data[1].trim();
    // type_field.placeholder = "app"
    type_field.setAttribute("list", "partition-types");
    type_field.classList.add("form-control");
    type_field.classList.add("type-input");
    cell_type.appendChild(type_field);
    
    // add subtype field
    var cell_subtype = row.insertCell(-1);
    var subtype_field = document.createElement("input");
    subtype_field.id = "subtype-field-" + row_id;
    subtype_field.size = 5;
    subtype_field.type = "list";
    if (partition_data) subtype_field.value = partition_data[2].trim();
    // subtype_field.placeholder = "ota_0";
    subtype_field.setAttribute("list", "partition-subtypes");
    subtype_field.classList.add("form-control")
    subtype_field.classList.add("subtype-input")
    
    cell_subtype.appendChild(subtype_field);
    
    // add offset field
    var cell_offset = row.insertCell(-1);
    var offset_field = document.createElement("input");
    offset_field.id = "offset-field-" + row_id;
    offset_field.size = 5;
    if (partition_data) offset_field.value = partition_data[3].trim();
    // offset_field.placeholder = "0x10000";
    offset_field.classList.add("form-control");
    offset_field.classList.add("offset-input");
    offset_field.addEventListener("input", e => {
        resetGraphicalPartition();
    })
    cell_offset.appendChild(offset_field);
    
    // add size field
    var cell_size = row.insertCell(-1);
    
    var size_input_group = document.createElement("div");
    size_input_group.classList.add("input-group");
    size_input_group.classList.add("mb-3");
    
    var size_field = document.createElement("input");
    size_field.id = "size-field-" + row_id;
    // size_field.type = "number";
    size_field.size = 1;
    if (partition_data) size_field.value = partition_data[4].replace(/K|M/gm, "").trim()
    // size_field.placeholder = "2048";
    size_field.classList.add("form-control");
    size_field.classList.add("size-value-input");
    size_field.addEventListener("input", e => {
        resetGraphicalPartition();
    })
    size_input_group.appendChild(size_field);
    
    var size_suffix = document.createElement("input");
    size_suffix.id = "size-suffix-" + row_id;
    size_suffix.type = "list";
    size_suffix.size = 1;
    if (partition_data) size_suffix.value = partition_data[4].match(/K|M/gm);
    // size_suffix.placeholder = "K";
    size_suffix.setAttribute("list", "partition-size-suffixes");
    size_suffix.classList.add("form-control");
    size_suffix.classList.add("size-suffix-input");
    size_suffix.addEventListener("input", e => {
        resetGraphicalPartition();
    })
    size_input_group.appendChild(size_suffix);
    
    cell_size.appendChild(size_input_group);
    
    // add flag thingy
    var cell_flags = row.insertCell(-1);
    
    var flag_dropdown = document.createElement("div");
    flag_dropdown.classList.add("dropdown-menu");
    
    var flag_dropdown_dropdown = document.createElement("div");
    flag_dropdown_dropdown.classList.add("form-check");
    
    var flags_button = document.createElement("button");
    flags_button.innerText = "Flags";
    flags_button.classList.add("btn", "btn-info", "dropdown-toggle");
    flags_button.dataset.bsToggle = "dropdown";
    cell_flags.appendChild(flags_button);
    
    var flag_encrypted_checkbox = document.createElement("input")
    flag_encrypted_checkbox.type = "checkbox";
    flag_encrypted_checkbox.id = "flag-encrypted-" + row_id;
    if (partition_data && partition_data.length >= 5) 
        flag_encrypted_checkbox.checked = (partition_data[5] == "encrypted")
    flag_encrypted_checkbox.classList.add("form-check-input");
    flag_encrypted_checkbox.classList.add("flag-encrypted-input");
    flag_dropdown_dropdown.appendChild(flag_encrypted_checkbox);
    
    var flag_encrypted_label = document.createElement("label");
    flag_encrypted_label.innerText = "Encrypted";
    flag_encrypted_label.setAttribute("for", "flag-encrypted-" + row_id);
    flag_encrypted_label.classList.add("form-check-label");
    flag_dropdown_dropdown.appendChild(flag_encrypted_label);
    
    flag_dropdown.appendChild(flag_dropdown_dropdown);
    cell_flags.appendChild(flag_dropdown);
    
    // delete row button
    var cell_delete = row.insertCell(-1);
    var delete_button = document.createElement("button");
    delete_button.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    delete_button.onclick = function() {
        partition_table.deleteRow(row.rowIndex);
        resetGraphicalPartition();
    }
    delete_button.classList.add("btn", "btn-info");
    cell_delete.appendChild(delete_button);
    
    
    // increment row id
    row_id++;
    
    // make table draggable
    $("#partition-table").tableDnD({
        // "dragHandle": ".drag-handle"
    });
}

function clearPartitionTable()
{
    var partition_table = document.getElementById("partition-table");
    while (partition_table.rows.length > 1) 
        partition_table.deleteRow(-1);
        
    resetGraphicalPartition();
}

function openFileDialog()
{
    // open file dialog
    document.getElementById("csv-input").click();
}

function loadCsvFromFile()
{
    var files = document.getElementById("csv-input").files;
    console.log(files);
    
    if (files.length > 0)
    {
        var file = files[0];
        console.log("loading", file.name);
        var reader = new FileReader();
        reader.onloadend = function() {
            importCsv(reader.result);
        }
        reader.readAsText(file);
    }
}

function importCsv(csv_string)
{    
    clearPartitionTable();
    $.csv.toArrays(csv_string, {}, (err, data) => {
        
        if (err)
        {
            console.error("Error parsing CSV:", err)
        }
        else
        {
            console.log(data);
            
            // for each partition
            data.forEach((partition, i) => {
                
                // if partition starts with a '#', assume it's a comment
                if (!partition[0].startsWith('#'))
                {
                    // ignore blank rows
                    if (partition.length > 1) addPartitionTableRow(partition)
                }
                
            })
            
            resetGraphicalPartition();
        }
        
    })
}

function exportCsv()
{
    console.log("Generating CSV...")
    var csv_string = "# ESP-IDF Partition Table - generated by ESP32 Partition Editor :)\n";
    csv_string +=    "# Name,   Type, SubType, Offset,  Size, Flags\n"
    csv_string +=    "# bootloader.bin,,,         0x1000, 32K\n"
    csv_string +=    "# partition table,,,        0x8000,  4K\n"
    
    $("#partition-table tr").each((i, e) => {
        
        if (i > 0)
        {
            var row_id = $(e).data("row-id");
            
            var name = $(e).find(".partition-name-input").first().val();
            var type = $(e).find(".type-input").first().val();
            var subtype = $(e).find(".subtype-input").first().val();
            var size = $("#size-field-" + row_id).val();
            var size_suffix = $("#size-suffix-" + row_id).val().trim();
            var offset = $("#offset-field-" + row_id).val();
            if (isNaN(offset)) offset = last_offset + last_size // if offset isn't specified, use the (offset + size) of the previous partition
            var flag_encrypted = $(e).find(".flag-encrypted-input").first().is(":checked");
            
            console.log(flag_encrypted)
            csv_string += name + ",\t" + type + ",\t" + subtype + ",\t" 
                       +  offset.toString(15) + ",\t" + size + size_suffix + ",\t" + 
                       (flag_encrypted ? "encrypted" : "") + "\n"
           
        }        
    })
    
    console.log(csv_string)
    downloadFile(csv_string, "partitions.csv", "text/csv");
}

function resetGraphicalPartition()
{    
    // remove existing partitions
    $(".graphical-partition-section").remove();
    
    // add new partitions based on table data
    last_offset = 0x0
    last_size = 0x9000
    $("#partition-table tr").each((i, e) => {
        
        if (i > 0)
        {
            var row_id = $(e).data("row-id");
            
            var name = $(e).find(".partition-name-input").first().val();
            var color = subtype_colour_code[$(e).find(".subtype-input").first().val()];
            
            console.log(name)
            
            console.log("\tsize-field-" + row_id)
            console.log("\toffset-field-" + row_id)
            
            var size = parseInt($("#size-field-" + row_id).val());
            var size_suffix = $("#size-suffix-" + row_id).val();
            if (size_suffix == "K") size *= 1024;
            if (size_suffix == "M") size *= 1024 * 1024;
            console.log("\tsize:", size, "bytes");
            
            var offset = parseInt($("#offset-field-" + row_id).val());
            if (isNaN(offset)) offset = last_offset + last_size // if offset isn't specified, use the (offset + size) of the previous partition
            console.log("\toffset:", offset)
            
            var size_percent   = (size   / getFlashSize()) * 100;
            var offset_percent = (offset / getFlashSize()) * 100;
            console.log("\tsize percent  ", size_percent, "%");
            console.log("\toffset percent", offset_percent, "%");
            
            // todo: add left css thing to apply offset!
            $("#graphical-partition").append(`<div 
                class='graphical-partition-section' 
                style='
                    background-color: ${color}; 
                    width: ${size_percent}%; 
                    left: ${offset_percent}%;
                ' data-row-id=${row_id}
            ><span>${name}</span></div>`)
        
            last_offset = offset
            last_size = size
        }
        
    })
    
    // check flash size
    var flash_size_check = last_offset + last_size;
    if (getFlashSize() != flash_size_check) console.warn("Flash Size mismatch - original:", getFlashSize(), ", calculated:", flash_size_check);
    else console.log("Flash Size check good")
    
    $(".graphical-partition-section").draggable({
        axis: 'x',
        containment: '#graphical-partition',
        scroll: false,
        snap: ".graphical-partition-section",
        drag: function(event, ui) {
            
            var percent = (ui.position.left / $("#graphical-partition").width())
            var offset_field = $("#offset-field-" + ui.helper.data("row-id"))
            var new_offset = (Math.round( (getFlashSize() * percent) / 0x10000) * 0x10000)
            var offset_string = "0x" + new_offset.toString(16)
            offset_field.val(offset_string)
            
            console.log("offset left: ", ui.offset.left)
            console.log("pos left:    ", ui.position.left)
            console.log("percent:     ", percent)
            console.log("new offset:  ", offset_string)
        }
    });
        
    // make partitions resizable
    $(".graphical-partition-section").resizable({
        containment: "parent",
        alsoResize: false,
        resize: function(event, ui) {
            
            var percent = (ui.size.width / $("#graphical-partition").width())
            var size_field = $("#size-field-" + ui.helper.data("row-id"))
            var size_suffix = $("#size-suffix-" + ui.helper.data("row-id")).val()
            
            var new_size = Math.round(getFlashSize() * percent)
            
            if (size_suffix == "K") new_size = Math.floor(new_size / 1024)
            if (size_suffix == "M") new_size = Math.floor(new_size / 1024 / 1024)
            
            var size_string = new_size.toString()
            size_field.val(size_string)
            
            console.log("percent: ", percent)
            console.log("new size:", size_string)
        }
    });
        
    
}

// Function to download data to a file
// from https://stackoverflow.com/a/30832210
function downloadFile(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function getFlashSize()
{
    var flash_size_input = document.getElementById("flash-size-input");
    var flash_size = parseInt(flash_size_input.value);
    return flash_size * 1024 * 1024
}

function updateFlashSize()
{
    resetGraphicalPartition();
}

$(document).ready(() => {
    
})