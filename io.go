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

type writer struct{}

func (writer) WriteFile(path string, data []byte, mode os.FileMode) error {
	return ioutil.WriteFile(path, data, mode)
}
