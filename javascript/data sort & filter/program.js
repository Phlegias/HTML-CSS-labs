import {weapons} from './data.js'

let correspond = {
    "Наименование": "name",
    "Тип оружия": "type",
    "Длина, см": ["lengthFrom","lengthTo"],
    "Дистанция": "distant",
    "Вес, кг": ["weightFrom", "weightTo"],
    "Тип урона": "damage",
    "Происхождение": "country",
    "Материал": "material",
    "Время": ["timeFrom", "timeTo"]
}

document.addEventListener("DOMContentLoaded", function() {
    setSortSelects(weapons, document.getElementById("sort-settings"));
    createTable(weapons, "megatable");
    let sort1 = document.getElementById("sort1");
    let sort2 = document.getElementById("sort2");

    sort1.onchange = () => {
        changeNextSelect(sort2, sort1);
    }
    
    document.getElementById("filter").onclick = () => {
        filterTable(weapons, "megatable", document.getElementById("filter-settings"));
    }
    document.getElementById("clear-filters").onclick = () => {
        clearTable("megatable")
        createTable(weapons, "megatable");
    }

    document.getElementById("sort").onclick = () => {
        sortTable("megatable", document.getElementById("sort-settings"));
    }

    document.getElementById("clear-sort").onclick = () => {
        sort1.value = 0;
        sort1.onchange();
        clearTable("megatable")
        createTable(weapons, "megatable");
    }
});

let createTable = (data, idTable) => {
    let table = document.getElementById(idTable);
    data.forEach(item => {
        let tr = document.createElement("tr");
        for(let key in item) {
            let td = document.createElement("td");
            td.innerText = item[key];
            tr.append(td);
        }
        table.append(tr);
    });
    sortTable(idTable, document.getElementById("sort-settings"));
}
let dataFilter = (dataForm) => {
    let dictFilter = {};
    dataForm.querySelectorAll("input").forEach(item => {
        var valInput = item.value;
        if (item.type == "text") {
            valInput = valInput.toLowerCase();
        }
        if (item.type == "number") {
            if (valInput == "" && item.id.includes("From")) {   
                valInput = (valInput == "") ? Number.NEGATIVE_INFINITY : Number(item.min);
            }
            else if (valInput == "" && item.id.includes("To")) {
                item.value = item.max;
                valInput = valInput == "" ? Number.POSITIVE_INFINITY : Number(item.max);
            }
            else valInput = +valInput;
        }
        dictFilter[item.id] = valInput;
    });
    delete dictFilter["clear-filters"];
    delete dictFilter["filters"];
    return dictFilter;
    
}
let clearTable = (idTable) => {
    let table = document.getElementById(idTable);
    table.innerHTML = "";
}
let filterTable = (data, idTable, dataForm) => {
    let datafilter = dataFilter(dataForm);
    console.log(datafilter);
    let tableFilter = data.filter(item => {
        let result = true;
        //console.log(item)
        for (let key in item) {
            let field = item[key];
            if (field != "" && field != undefined && field != null) {

                if (typeof field == "object") {
                    if (field.indexOf(datafilter[correspond[key]]) == -1 && datafilter[correspond[key]] != "") {
                        result = false;
                    }
                }
                if (typeof field == "string") {
                    field = field.toLowerCase();
                    //console.log(field);
                    result &&= (field == datafilter[correspond[key]]) || field.indexOf(datafilter[correspond[key]]) != -1;
                }
                else if (typeof field == "number") {
                    //console.log(correspond[key][0])
                    if (correspond[key][0].includes("From")) {
                        result &&= field >= datafilter[correspond[key][0]];
                        //console.log(`${field} >= ${datafilter[correspond[key][0]]}`)
                        
                    }
                    if (correspond[key][1].includes("To")) {
                        result &&= field <= datafilter[correspond[key][1]];
                        //console.log("to")
                    }
                    else {
                        result &&= field >= datafilter[correspond[key][0]];
                        result &&= field <= datafilter[correspond[key][1]];
                    }
                } 
            }
        }
        return result;
    });
    clearTable(idTable);
    createTable(tableFilter, idTable);
}


let createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
}

let setSortSelect = (head, sortSelect) => {
    sortSelect.append(createOption('Нет', 0));
    for (let i in head) sortSelect.append(createOption(head[i], Number(i) + 1));
}

let setSortSelects = (data, dataForm) => {
    let head = Object.keys(data[0]);
    let allSelect = dataForm.getElementsByTagName('select');
    for(let j = 0; j < allSelect.length; j++) {
        setSortSelect(head, allSelect[j]);
        if (j > 0) allSelect[j].disabled= true;
    }
}
let changeNextSelect = (nextSelect, curSelect) => {
    nextSelect.disabled = false;
    nextSelect.innerHTML = curSelect.innerHTML;
    if (curSelect.value != 0) {
        for (let i = 0; i < nextSelect.options.length; i++) {
            if (nextSelect.options[i].value == curSelect.value) nextSelect.remove(i);
        }
    } else {
        nextSelect.disabled = true;
    }
}

let createSortArr = (dataForm) => {
    let sortArr = [];
    let sortSelects = dataForm.getElementsByTagName('select');
    for (let i = 0; i < sortSelects.length; i++) {
        let keySort = sortSelects[i].value;
        if (keySort == 0) break;
        let desc = document.getElementById(sortSelects[i].id + 'Desc').checked;
        sortArr.push({column: keySort - 1, order: desc});
    }
    return sortArr;
}

let sortTable = (idTable, dataForm) => {
    let sortArr = createSortArr(dataForm);
    if (sortArr.length === 0) return;
    let table = document.getElementById(idTable);
    let rowData = Array.from(table.rows);
    rowData.sort((first, second) => {
        for (let i in sortArr) {
            let key = sortArr[i].column;
            if (first.cells[key].innerHTML > second.cells[key].innerHTML) {
                return sortArr[i].order ? -1 : 1;
            } else if (first.cells[key].innerHTML < second.cells[key].innerHTML) {
                return sortArr[i].order ? 1 : -1;
            }
        }
        return 0;
    });

    rowData.forEach(item => {
        table.append(item);
    });
}