package less

import (
	"embed"
	"errors"
	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"sync"
)

var (
	script          *goja.Program
	defaultCompiler *Compiler
	registry        *require.Registry

	defaultReader = &reader{}
)

type Compiler struct {
	runtime *goja.Runtime
	mutex   *sync.Mutex
	r       Reader
}

//go:embed assets
var assets embed.FS

// Initialize the registry and precompile the script
func init() {
	registry = require.NewRegistryWithLoader(func(filename string) ([]byte, error) {
		//filename = strings.Replace(filename, "\\", "/", -1)
		bytes, err := assets.ReadFile("assets/" + filename)
		if err == nil && bytes != nil && len(bytes) > 0 {
			return bytes, err
		}

		//fmt.Println(bytes, err)

		return nil, require.ModuleFileDoesNotExistError
	})

	script = goja.MustCompile("compiler.js", `
		var	less = require('./less-go');
		
		function compile(input, options, cb) {
			less.render(input, options, function (e, output) {
				if (e == null) {
					cb(null, output.css);
				} else {
					cb(e);
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

// NewCompiler creates a new compiler with a set reader/writer.
// Compilers are thread-safe, only because they use a shared mutex.
// If using from multiple goroutines regularly, it's probably better to use a pool.
func NewCompiler() (*Compiler, error) {
	runtime := goja.New()

	registry.Enable(runtime)

	c := &Compiler{
		runtime: runtime,
		mutex:   &sync.Mutex{},
		r:       defaultReader,
	}

	c.runtime.Set("readFileNative", c.readFile)
	c.runtime.Set("readFileFromAssets", c.readFileFromAssets)

	if script == nil {
		return nil, errors.New("script was not loaded")
	}

	if _, err := c.runtime.RunProgram(script); err != nil {
		return nil, err
	}

	return c, nil
}

// readFile will read a sync file either from the reader interface, or the box
func (c *Compiler) readFile(call goja.FunctionCall) goja.Value {
	path := call.Argument(0).String()

	if path == "" {
		return goja.Null()
	}

	bytes, err := c.r.ReadFile(path)

	if err != nil {
		bytes, err = assets.ReadFile("assets/" + path)

		if err != nil {
			return goja.Null()
		}
	}

	return c.runtime.ToValue(string(bytes))
}

// readFileFromAssets will read a file from the packr box
func (c *Compiler) readFileFromAssets(call goja.FunctionCall) goja.Value {
	path := call.Argument(0).String()
	if path == "" {
		return goja.Null()
	}
	bytes, err := assets.ReadFile("assets/" + path)
	if err != nil {
		return goja.Null()
	}
	return c.runtime.ToValue(string(bytes))
}

// SetReader sets the reader interface to provide files
func (c *Compiler) SetReader(customReader Reader) {
	c.r = customReader
}

// SetReader sets the default compiler's reader
func SetReader(r Reader) {
	defaultCompiler.SetReader(r)
}

// Render renders the input as raw less using a shared compiler.
func Render(input string, mods ...map[string]interface{}) (string, error) {
	return defaultCompiler.Render(input, mods...)
}

// RenderFile renders the input as a file using a shared compiler.
func RenderFile(input string, mods ...map[string]interface{}) (string, error) {
	return defaultCompiler.RenderFile(input, mods...)
}

// RenderFile renders the input as a file path, using the Reader interface.
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

// Render renders input as raw less
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
		errArgument := call.Argument(0)

		if goja.IsNull(errArgument) {
			res = call.Argument(1).String()
		} else {
			renderErr = errors.New(errArgument.String())
		}

		return goja.Null()
	}))

	if err != nil {
		return "", err
	}

	return res, renderErr
}
