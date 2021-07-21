//change '+' to %2B; '/' to %2F and delete '='
function Base64EncodeUrl(str){
    return str.replace(/\+/g, '%2B').replace(/\//g, '%2F').replace(/\=+$/, '');
}

module.exports = {
    Base64EncodeUrl
}