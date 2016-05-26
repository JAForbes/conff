conff
=====

Generate command line flags from a standard config file.

#### Quick start

1. `npm install conff -g`
2. Define a `conff.json` file in the root of your project.

```json
{

    "watch": [
        "watchify"
        ,"app.js"
        ,{
            "transform": ["browserify-css"]
            , "outfile": "bundle.min.js"
            , "verbose": true
        }
    ]

    ,"compile": [
        "browserify"
        "app.js"
        ,{ "transform": ["browserify-css"] }
    ]

    ,"compress": ["uglifyjs", { "mangle": true, "compress": true }]
}
```

Then in bash:

```bash
`conff compile` | `conf compress` > bundle.min.js
```

The above command will expand into:

```bash
browserify app.js --transform browserify-css | uglifyjs --mangle --compress > bundle.min.js
```

If you are on windows you can use `--exec` and `--pipe`:

```bash
conff compile --exec | conff compress --pipe --exec
```

#### Why?

- A single configuration file for any bash command simplifies your
build scripts.

- Defining configuration in one place illuminates the relationship
between different scripts

- Editing json is easier than editing command line flags

- Encourages use of verbose flags instead of single letter options

- Removes the need for project specific config files with their own
particular translation logic

#### JSON structure

The top level key is the name of your command.
The top level value should be an array containing either:

- a string
- an array
- an object of key values

##### Arrays:

A sub array follows the same rules as the top level array, and can be
arbitrarily nested.

##### Objects:

Objects will not be deeply traversed they are only a key:value store.
If a value is a boolean, only the key will be added.

##### Strings

Strings are inserted verbatim in order.  They will usually be either filenames or commands.

#### Roadmap

conff is a tiny script.  I expect it will not change much (if at all),
but pull requests are welcome and encouraged!