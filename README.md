This is an Angular based UI for the OC Papersubmission System
==============================================

This project needs the papersubmission-service deployed as an AWS Stack. 
The papersubmission-service must be deployed first and can be found under the following url 
[https://github.com/opitzconsulting/oc-papersubmission-services](https://github.com/opitzconsulting/oc-papersubmission-services)

Generating environment Files
---
Before the UI can be used the environment File must be generated for use with the deployed papersubmission-service.
To do that the cloudformation stack name for the papersubmission-service is required.

  ```bash
  $ cd <projact-root>/build
  $ node createEnvironment --api-stack-name <papersubmission-service stack name>
  ```
  
After that the environment file for development is generated and the ui can be started with the following command

  ```bash
  $ cd <project-root>
  $ ng serve
  ```
