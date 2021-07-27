# mkto-flow-lookup

This is a proof-of-concept for Marketo Self-service Flow steps on IO Runtime.  It includes a light API implementation of the AIO files library to support managing the list of available files.  

- It currently reads files synchronously and has an unknown maximum file size when executed on a 256mb action
- The SSFS API is fully implemented.  Async submission works and the callback produces correct results and validates.  Service Definition is implemented
- End-to-end tests cannot be run locally due to usage of the AIO Files library
- AIO files is currently the only supported file store
- lookup search is exact match only


## Setup

- [Get IO runtime credentials.](https://www.adobe.io/apis/experienceplatform/runtime/docs.html#!adobedocs/adobeio-runtime/master/getting_started.md) then Populate the `.env` file in the project root and fill it as shown [below](#env)
- clone https://git.corp.adobe.com/kelkingt/multipart-form-parser and add as a local dependency.  e.g if you have /source/mkto-flow-lookup for this repo, /source/multi-part-form-parser.  looking to fix this by getting it published to npm, but living with it rn

## Local Dev

- `aio app run` to start your local Dev server
- App will run on `localhost:9080` by default

By default the UI will be served locally but actions will be deployed and served from Adobe I/O Runtime. To start a
local serverless stack and also run your actions locally use the `aio app run --local` option.

## Test & Coverage


- `aio app test` is currently bugged on windows, see alternate instructions below
- Run `aio app test` to run unit tests for ui and actions.  
- Run `aio app test -e` to run e2e tests
- Windows: `aio app run -v` in one terminal.  This will hot-reploy when you alter an action if you leave the terminal open
- Windows: `npm test` in another terminal.

## Deploy & Cleanup

- `aio app deploy` to build and deploy all actions on Runtime and static files to CDN
- `aio app undeploy` to undeploy the app

## Config

### `.env`

```bash
# This file must not be committed to source control

## please provide your Adobe I/O Runtime credentials
# AIO_RUNTIME_AUTH=
# AIO_RUNTIME_NAMESPACE=
```

### `manifest.yml`

- List your backend actions under the `actions` field within the `__APP_PACKAGE__`
package placeholder. We will take care of replacing the package name placeholder
by your project name and version.
- For each action, use the `function` field to indicate the path to the action
code.
- More documentation for supported action fields can be found
[here](https://github.com/apache/incubator-openwhisk-wskdeploy/blob/master/specification/html/spec_actions.md#actions).

#### Action Dependencies

- You have two options to resolve your actions' dependencies:

  1. **Packaged action file**: Add your action's dependencies to the root
   `package.json` and install them using `npm install`. Then set the `function`
   field in `manifest.yml` to point to the **entry file** of your action
   folder. We will use `parcelJS` to package your code and dependencies into a
   single minified js file. The action will then be deployed as a single file.
   Use this method if you want to reduce the size of your actions.

  2. **Zipped action folder**: In the folder containing the action code add a
     `package.json` with the action's dependencies. Then set the `function`
     field in `manifest.yml` to point to the **folder** of that action. We will
     install the required dependencies within that directory and zip the folder
     before deploying it as a zipped action. Use this method if you want to keep
     your action's dependencies separated.
