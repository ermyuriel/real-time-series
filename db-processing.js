/**
 * Created by EUCJ on 12/19/2016.
 */

module.exports.getLastNFromSeries = function (n, siteId) {


    return pool.acquire((redisConnection)=> {

        return redisConnection.get('series-counter:' + siteId).then((counterValue)=> {
            return redisConnection.zrange('series:' + siteId, counterValue - n, counterValue);
        })

    })


}

module.exports.getArrayFromDatabaseObject = function (databaseObject, parameter) {

    let array = [];

    for (let i = 0; i < databaseObject.length; i++)
        array.push(JSON.parse(databaseObject[i])[parameter]);

    return array;
}


module.exports.getValuesFromJsonArray = function (jsonObjectArray, target, identifierName = 'type', secondNestedParameter = 'dates', thirdNestedParameter = 'items', fourthNestedParameter = 'value', numeric = 1) {

    let array = [];


    for (let h = 0; h < jsonObjectArray.length; h++) {
        let i = 0;
        while (JSON.parse(jsonObjectArray[h])[i][identifierName] !== target)
            i++;


        let currentObjectArray = JSON.parse(jsonObjectArray[h])[i][secondNestedParameter];


        for (let j = 0; j < currentObjectArray.length; j++) {
            let itemsArray = currentObjectArray[j][thirdNestedParameter];


            for (let k = 0; k < itemsArray.length; k++) {
                if (numeric == 1)
                    array.push(parseInt(itemsArray[k][fourthNestedParameter]));
                else
                    array.push(itemsArray[k][fourthNestedParameter]);
            }
        }
    }

    return array;


}


module.exports.getMultipleValuesFromJsonArray = function (jsonObjectArray, target, identifierName = 'type', secondNestedParameter = 'dates', thirdNestedParameter = 'items', fourthNestedParameter = ['value'], numeric = 1) {

    let array = [];


    for (let h = 0; h < jsonObjectArray.length; h++) {
        let i = 0;
        while (JSON.parse(jsonObjectArray[h])[i][identifierName] !== target)
            i++;


        let currentObjectArray = JSON.parse(jsonObjectArray[h])[i][secondNestedParameter];


        for (let j = 0; j < currentObjectArray.length; j++) {
            let itemsArray = currentObjectArray[j][thirdNestedParameter];


            for (let k = 0; k < itemsArray.length; k++) {
                if (numeric == 1) {
                    aux = []
                    for (let i = 0; i < fourthNestedParameter.length; i++)
                        aux.push(parseInt(itemsArray[k][fourthNestedParameter[i]]));
                    array.push(aux);
                }
                else {
                    aux = []
                    for (let i = 0; i < fourthNestedParameter.length; i++)
                        aux.push(itemsArray[k][fourthNestedParameter[i]]);

                    array.push(aux);
                }
            }
        }
    }

    return array;


}