package less

import (
	"io/ioutil"
	"os"
)

type Reader interface {
	ReadFile(string) ([]byte, error)
}

type Writer interface {
	WriteFile(string, []byte, os.FileMode) error
}

type reader struct{}

func (reader) ReadFile(path string) ([]byte, error) {
	return ioutil.ReadFile(path)
}
