#!/usr/bin/env node
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

if(!key){
    console.error('Error: You must a command that references a key in ./conff.json')
    process.exit(1)
}

try {
    var config = JSON.parse( fs.readFileSync( './conff.json' ))
} catch(e) {
    console.error('Error: Could not find a valud ./conff.json file')
    process.exit(1)
}

var options = config[key]

if(!options){
    console.error('Error: The command you provided did not have a match in ./conff.json')
    process.exit(1)
}

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