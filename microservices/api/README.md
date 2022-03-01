# Backend API
This is the backend API hosted using AWS Cloud Formation and SAM templates. This project takes advantage of the SAM CLI and Make to create a custom build process while also making local development easy.

## Setting Up
To run the API, the main project tooling and dependencies are required and the following:
- [AWS CLI](https://aws.amazon.com/cli/)
- [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- Make
- Overmind

### Setup on Ubuntu/Debian
Follow the AWS guides on installing the AWS CLI tools.

Installing Make:
> sudo apt-get install make

Follow the guide to install overmind [here](https://unix.stackexchange.com/a/647209)

Make sure to setup the environment variables by creating a new file named **env.json** in the api folder.

## Usage
To create a local dev environment for the api run:
> yarn dev

This command automatically setups up a local **node_modules** folder for development and SAM CLI. It uses overmind take advantage of the Procfile to spur up two instances at once

To build the api for AWS Deployment run:
> yarn aws-build

This command automatically removes the local node_modules folder if present to prevent a copy on every build task. This command then builds every single Lambda Function, Lambda Layer, and the API template.