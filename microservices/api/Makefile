.PHONY: build-lambda-common
.PHONY: build-AuthLoginPOST
.ONESHELL: build-lambda-common build-ApiLayer

build-AuthLoginPOST:
	$(MAKE) HANDLER=src/auth/login/POST/index.ts build-lambda-common

build-lambda-common:
	cd $(shell echo "$(ARTIFACTS_DIR)" | sed 's@/.aws-sam.*@@')
	rm -rf dist
	echo "{\"extends\": \"./tsconfig.json\", \"includes\": [\"${HANDLER}\"] }" > tsconfig-only-handler.json
	yarn build --build tsconfig-only-handler.json
	cp -r dist "$(ARTIFACTS_DIR)/"

build-ApiLayer:
	cd $(shell echo "$(ARTIFACTS_DIR)" | sed 's@/.aws-sam.*@@')
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json "$(ARTIFACTS_DIR)/nodejs/"
	cd "$(ARTIFACTS_DIR)/nodejs/"
	touch yarn.lock
	sed 's/}$$/,\"installConfig\":{\"hoistingLimits\":\"dependencies\"}/' package.json
	yarn workspaces focus --production
	rm "package.json"