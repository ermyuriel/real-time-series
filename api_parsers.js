/**
 * Created by ermyuriel on 7/26/2017.
 */



module.exports = {

    "clicky": function (data) {

        parsedData = JSON.parse(data)

        value = parsedData[0]['dates'][0]['items'][0]['value']

        console.log(value)


        return value;

    },

    "clicky-demo": function (data) {



        parsedData = JSON.parse(data)

        value = parsedData[0]['dates'][0]['items'][0]['value']

        console.log(value)


        return value;

    },

    "r": function (data) {

        return data


    }


}