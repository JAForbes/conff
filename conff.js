var fs = require('fs')

var objectToFlags = function(object){
    return Object.keys(object)
        .reduce(function(flags, key){
            var value = object[key]
            return flags.concat(
                '--'+key+ (
                    typeof value == 'boolean' ? ''
                    : ' ' + value
                )
            )
        }, [])
}

var key = process.argv[2]

var config = JSON.parse( fs.readFileSync( './conff.json' ))
var options = config[key]

var computed =
    options
    .reduce(function(command, value, list){
        return command
            .concat(
                typeof value == 'string' ? value
                : Array.isArray(value) ? ( [].push.apply(list, value) && [] )
                : objectToFlags(value)
            )
    }, [])
    .join(' ')

console.log(key+ ' ' +computed)