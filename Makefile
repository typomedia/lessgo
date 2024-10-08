build:
	go mod tidy
	go build -ldflags "-s -w" -o dist/ .

run:
	go mod tidy
	go run main.go

cross:
	go mod tidy
	GOOS=linux GOARCH=amd64 go build -ldflags "-s -w" -o dist/vocalizer-linux-amd64 .
	GOOS=darwin GOARCH=amd64 go build -ldflags "-s -w" -o dist/vocalizer-macos-amd64 .
	GOOS=windows GOARCH=amd64 go build -ldflags "-s -w" -o dist/vocalizer-windows-amd64.exe .

update:
	go install github.com/hashicorp/go-getter/cmd/go-getter@latest
	go-getter https://github.com/less/less.js/archive/refs/tags/v3.12.2.zip temp/
	#go install github.com/sanderhahn/gozip/cmd/gozip@latest
	#gozip -x temp/v3.12.2.zip temp/
	go install github.com/typomedia/gobabel@latest
	gobabel temp/less.js-3.12.2/packages/less/src/less/ --target less/assets/less/
	#gobabel temp/less.js-3.12.2/packages/less/src/less-node/ --target less/assets/less-go/
