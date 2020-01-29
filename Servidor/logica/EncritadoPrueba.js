var sjcl = require('sjcl')

var encriptado = sjcl.encrypt("password", "Emilio")

console.log(encriptado)

var desencriptado = sjcl.decrypt("password", encriptado);

console.log(desencriptado)
