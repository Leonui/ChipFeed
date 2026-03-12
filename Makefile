.DEFAULT_GOAL := help

dev: ## Start Next.js dev server
	npm run dev

build: ## Build static site
	npm run build

lint: ## Run ESLint
	npx eslint .

fetch: ## Fetch all sources (GitHub + arXiv + Scholar) and merge
	npm run fetch:all

pipeline: ## Full pipeline: download index, fetch, merge, upload
	npm run pipeline

upload: ## Upload data to R2
	npm run upload:r2

typecheck: ## Run TypeScript type checking
	npx tsc --noEmit

help: ## Show this help
	@printf '\n\033[32m  ChipFeed\033[0m\n\n'
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""

.PHONY: dev build lint fetch pipeline upload typecheck help
