function sanetizeDni(dni){
    return dni.replace(/^0+/, '').replace(/\D+/g, '')
}

module.exports = {
    sanetizeDni
}