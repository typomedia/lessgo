package less

import (
	"testing"
)

func TestRender(t *testing.T) {
	str, err := defaultCompiler.Render(".class { width: (1 + 1) }", map[string]interface{}{"compress": true})

	if err != nil {
		t.Fatal("Render error:", err)
	}

	var expected = `.class{width:2}`
	if str != expected {
		t.Error(`Render result invalid: "`+str+`" != "`, expected, `"`)
	}

	t.Log("Output:", str)
}

func TestRenderFile(t *testing.T) {
	str, err := defaultCompiler.RenderFile("test/style.less")

	if err != nil {
		t.Fatal("Render error:", err)
	}

	t.Log("Output:", str)
}
