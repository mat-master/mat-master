.PHONY: build-lambda-common
.PHONY: build-AuthLoginPOST
.ONESHELL: build-lambda-common build-ApiLayer

build-AuthLoginPOST:
	$(MAKE) HANDLER=src/auth/login/POST/index.ts build-lambda-common
build-AuthSignupPOST:
	$(MAKE) HANDLER=src/auth/signup/POST/index.ts build-lambda-common
build-UsersIdGET:
	$(MAKE) HANDLER=src/users/{id}/GET/index.ts build-lambda-common

build-lambda-common:
	cd $(shell echo "$(ARTIFACTS_DIR)" | sed 's@/.aws-sam.*@@')
	rm -rf dist
	echo "{\"extends\": \"./tsconfig.json\", \"includes\": [\"${HANDLER}\"] }" > tsconfig-only-handler.json
	yarn build tsconfig-only-handler.json
	cp -r dist "$(ARTIFACTS_DIR)/"

build-ApiLayer:
	cd $(shell echo "$(ARTIFACTS_DIR)" | sed 's@/.aws-sam.*@@')
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json "$(ARTIFACTS_DIR)/nodejs"
	cp -r ../../common/types "$(ARTIFACTS_DIR)/nodejs"
	cd "$(ARTIFACTS_DIR)/nodejs"
	sed --in-place 's/workspaces/dependencies/' package.json
	sed --in-place 's/"types": ".*"/"types": "file:.\/types"/' package.json
	touch yarn.lock
	touch test.txt
	yarn workspaces focus --production