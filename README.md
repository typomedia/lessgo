# less-go 

[Less](http://lesscss.org/) compiler for [Golang](https://golang.org/)

Builds CSS using original [Less compiler](https://github.com/less/less.js) and [goja](https://github.com/dop251/goja) for a true cross-platform Less solution.

The original project [less-go](https://github.com/kib357/less-go) used Duktape instead of goja.

## Status

This project is "stable" but also very much a work in progress. Expect changes as required, and feel free to submit pull requests to improve it.

## Installation

```
go get github.com/tystuyfzand/less-go
```

## Command Line usage

```
cd $GOPATH/src/github.com/tystuyfzand/less-go/lessc
go get
go build
./lessc --input="inputFile" --output="outputFile"
./lessc -i inputFile -o outputFile
```

Examples:

```
./lessc --input="./styles.less" --output="./styles.css"
./lessc -i styles.less -o styles.css
```

More about usage you can see in cli help:

```
./lessc -h
```

## Programmatic usage

```go
import "github.com/tystuyfzand/less-go"

func main() {
	output, err := less.RenderFile("./styles.less", map[string]interface{}{"compress": true})
}
```

### Function reference

#### Render(input string, mods ...map[string]interface{}) (string, error)

Renders Less as raw input and generates output CSS.

#### RenderFile(input string, mods ...map[string]interface{}) (string, error)

Renders Less files and generates output CSS.

#### SetReader(customReader Reader)

```go
type Reader interface {
    ReadFile(string) ([]byte, error)
}
```

Sets a custom reader for .less files. You can use it to replace standard input from file system to another. Example:

```go
type LessReader struct{}

var lessFiles = map[string][]byte{"styles": []byte{".class { width: (1 + 1) }"}}

func (LessReader) ReadFile(path string) ([]byte, error) {
    lessFile, ok := lessFiles[path]
    if !ok {
    	return "", errors.New("path not found")
    }
    return lessFile, nil
}

func main() {
    less.SetReader(LessReader)
    ...
}

```
## Updating Less

Get the [latest version of less.js](https://github.com/less/less.js/releases), navigate to `packages/less/src`.

With npm installed, run:

```
npm install @babel/core @babel/cli @babel/preset-env
```

Then, run babel to get a copy that goja can run:

```
npx babel less/ --out-dir /path/to/less-go/assets/less/ --presets=@babel/preset-env
```

And finally, re-build the packr files:

```
packr2
```

## Current limitations

Unlike the original version, this doesn't use any C Javascript engine. It will run on any platform, and cross compile just fine.

CLI interface doesn't support options
