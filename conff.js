#!/usr/bin/env node
var fs = require('fs')
var cp = require('child_process')


function complement(f){ return function(v){
    return !f(v)
}}

function has(str){ return function(v){
    return v.indexOf(str) > -1
}}

function exec(command, stdin){

    var executed = cp.exec(command, { stdio: ['pipe', 'pipe']})

    executed.stdout.pipe(process.stdout)
    executed.stderr.pipe(process.stderr)

    if( stdin ){
        process.stdin.pipe(executed.stdin)
    }
}

function identity(i){ return i }

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

var args = process.argv.slice(2)
var flags = args.filter(has('--'))
var key = args.filter( complement(has('--')))[0]

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

var command = computed.join(' ')

if( flags.some(has('--exec')) ){
    var stdin = flags.some(has('--pipe'))
    exec(command, stdin)
} else {
    console.log(command)
}