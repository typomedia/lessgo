package less

import (
	"errors"
	"fmt"
	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/gobuffalo/packr/v2"
	"strings"
	"sync"
)

var (
	script          *goja.Program
	defaultCompiler *Compiler
	registry        *require.Registry

	box = packr.New("Assets", "./assets")
)

type Compiler struct {
	runtime *goja.Runtime
	mutex   *sync.Mutex
	r       Reader
	w       Writer
}

func NewCompiler() (*Compiler, error) {
	runtime := goja.New()

	registry.Enable(runtime)

	c := &Compiler{
		runtime: runtime,
		mutex:   &sync.Mutex{},
		r:       reader{},
		w:       writer{},
	}

	c.runtime.Set("print", func(call goja.FunctionCall) goja.Value {
		args := make([]interface{}, len(call.Arguments))

		for i, arg := range call.Arguments {
			args[i] = arg.String()
		}

		fmt.Println(args...)

		return goja.Null()
	})
	c.runtime.Set("readFile", c.readFile)
	c.runtime.Set("readFileFromAssets", c.readFileFromAssets)
	c.runtime.Set("writeFile", c.writeFile)

	if script == nil {
		return nil, errors.New("script was not loaded")
	}

	if _, err := c.runtime.RunProgram(script); err != nil {
		return nil, err
	}

	return c, nil
}

func init() {
	registry = require.NewRegistryWithLoader(func(filename string) ([]byte, error) {
		filename = strings.Replace(filename, "\\", "/", -1)

		bytes, err := box.Find(filename)

		if err == nil && bytes != nil && len(bytes) > 0 {
			return bytes, err
		}

		return nil, require.ModuleFileDoesNotExistError
	})

	script = goja.MustCompile("compiler.js", `
		var fs = require('./less-go/fs'),
			less = require('./less-go');
		
		function compile(input, options, cb) {
			less.render(input, options, function (e, output) {
				if (e == null) {
					cb(output.css);
				} else {
					cb(null, e);
				}
			});
		}
	`, false)

	var err error
	defaultCompiler, err = NewCompiler()

	if err != nil {
		panic(err)
	}
}

func (c *Compiler) readFile(call goja.FunctionCall) goja.Value {
	path := call.Argument(0).String()
	if path == "" {
		return goja.Null()
	}
	bytes, err := c.r.ReadFile(path)
	if err != nil {
		bytes, err = box.Find(path)
		if err != nil {
			return goja.Null()
		}
	}
	return c.runtime.ToValue(string(bytes))
}

func (c *Compiler) readFileFromAssets(call goja.FunctionCall) goja.Value {
	path := call.Argument(0).String()
	if path == "" {
		return goja.Null()
	}
	bytes, err := box.Find(path)
	if err != nil {
		return goja.Null()
	}
	return c.runtime.ToValue(string(bytes))
}

func (c *Compiler) writeFile(call goja.FunctionCall) goja.Value {
	data := []byte(call.Argument(0).String())
	path := call.Argument(1).String()
	if path == "" {
		return goja.Null()
	}
	err := c.w.WriteFile(path, data, 0644)
	if err != nil {
		return goja.Null()
	}
	return c.runtime.ToValue(true)
}

func (c *Compiler) SetReader(customReader Reader) {
	c.r = customReader
}

func (c *Compiler) SetWriter(customWriter Writer) {
	c.w = customWriter
}

func Render(input string, mods ...map[string]interface{}) (string, error) {
	return defaultCompiler.Render(input, mods...)
}

func RenderFile(input string, mods ...map[string]interface{}) (string, error) {
	return defaultCompiler.RenderFile(input, mods...)
}

func (c *Compiler) RenderFile(input string, mods ...map[string]interface{}) (string, error) {
	var options = map[string]interface{}{}

	if len(mods) > 0 {
		options = mods[0]
	}

	options["filename"] = input

	b, err := c.r.ReadFile(input)

	if err != nil {
		return "", err
	}

	return c.Render(string(b), options)
}

func (c *Compiler) Render(input string, mods ...map[string]interface{}) (string, error) {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	var options = map[string]interface{}{}

	if len(mods) > 0 {
		options = mods[0]
	}

	options["sync"] = true

	compile, ok := goja.AssertFunction(c.runtime.Get("compile"))

	if !ok {
		return "", errors.New("unable to get compiler")
	}

	var res string
	var renderErr error

	_, err := compile(goja.Null(), c.runtime.ToValue(input), c.runtime.ToValue(options), c.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 2 {
			res = call.Argument(0).String()
		} else {
			renderErr = errors.New(call.Argument(1).String())
		}

		return goja.Null()
	}))

	if err != nil {
		return "", err
	}

	return res, renderErr
}
