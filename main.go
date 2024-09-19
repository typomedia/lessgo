package main

import (
	"fmt"
	"github.com/spf13/cobra"
	"github.com/typomedia/lessgo/less"
	"log"
	"os"
)

func main() {
	var input, output *string
	rootCmd := &cobra.Command{
		Use:   "lessc",
		Short: "LESS CSS compiler",
		Long:  "Crossplatform LESS CSS compiler with no dependencies",
		Run: func(cmd *cobra.Command, args []string) {
			render(*input, *output)
		},
	}
	input = rootCmd.PersistentFlags().StringP("input", "i", "style.less", "Input less file")
	output = rootCmd.PersistentFlags().StringP("output", "o", "style.css", "Output css file")

	rootCmd.Execute()
}

func render(input, output string) {
	fmt.Println(input, output)

	outputFile, err := os.Create(output)

	if err != nil {
		log.Fatalln("Unable to open output file:", err)
	}

	defer outputFile.Close()

	outputStr, err := less.RenderFile(input)

	if err != nil {
		log.Fatalln("Unable to render:", err)
	}

	outputFile.Write([]byte(outputStr))
}
