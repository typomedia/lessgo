package less

import (
	"testing"
)

type CssAssetReader struct{}

func (CssAssetReader) ReadFile(path string) ([]byte, error) {
	return []byte(".class { width: (1 + 1) }"), nil
}

func TestRender(t *testing.T) {
	defaultCompiler.SetReader(&CssAssetReader{})
	str, err := defaultCompiler.RenderFile("input", map[string]interface{}{"compress": true})

	if err != nil {
		t.Fatal("Render error:", err)
	}

	var expected = `.class{width:2}`
	if str != expected {
		t.Error(`Render result invalid: "`+str+`" != "`, expected, `"`)
	}

	t.Log("Output:", str)
}
