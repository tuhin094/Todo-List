module.exports.getDate = function (){
    let option = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    
    let date = new Date();
    return date.toLocaleDateString("en-us",option);;
};


module.exports.getDay = function (){
    let week = ["Sunday", "Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Seterday"];
    let date = new Date();
    return week[date.getDay()];;
}