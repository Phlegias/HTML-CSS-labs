import {weapons} from './data.js';
import { sortTable } from "./sort.js";

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
    createTable(weapons, "megatable");
    
    document.getElementById("filter").onclick = () => {
        filterTable(weapons, "megatable", document.getElementById("filter-settings"));
    }
    
    document.getElementById("clear-filters").onclick = () => {
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




