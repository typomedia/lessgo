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
	go-getter https://github.com/less/less.js/archive/refs/tags/v4.2.0.zip build/
	go install github.com/gen2brain/go-unarr/cmd/unarr@latest
	unarr build/v4.2.0.zip build/
	npm install @babel/core @babel/cli @babel/preset-env
	npx babel ls build/less.js-4.2.0/packages/less/src/less --out-dir assets/less/ --presets=@babel/preset-env